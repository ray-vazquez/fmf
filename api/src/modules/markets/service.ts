import prisma from "../../lib/prisma";
import { haversineDistance } from "../../lib/geo";
import { MarketWithDistance } from "../../types/api";

export async function searchMarkets(query: string, userId?: string): Promise<MarketWithDistance[]> {
  const searchTerms = query.toLowerCase().trim();
  
  if (/^\d{5}$/.test(searchTerms)) {
    return searchByZip(searchTerms, userId);
  }
  
  if (searchTerms.includes(",")) {
    const [city, state] = searchTerms.split(",").map((s) => s.trim());
    return searchByCityState(city, state, userId);
  }
  
  return searchByText(searchTerms, userId);
}

async function searchByZip(zip: string, userId?: string): Promise<MarketWithDistance[]> {
  const markets = await prisma.market.findMany({
    where: { postalCode: zip },
    take: 50,
  });
  return attachUserData(markets, userId);
}

async function searchByCityState(city: string, state: string, userId?: string): Promise<MarketWithDistance[]> {
  const markets = await prisma.market.findMany({
    where: {
      city: { contains: city, mode: "insensitive" },
      state: { equals: state.toUpperCase() },
    },
    take: 50,
  });
  return attachUserData(markets, userId);
}

async function searchByText(query: string, userId?: string): Promise<MarketWithDistance[]> {
  const markets = await prisma.market.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
        { state: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 50,
  });
  return attachUserData(markets, userId);
}

export async function findNearbyMarkets(
  lat: number,
  lng: number,
  radiusKm: number = 25,
  userId?: string
): Promise<MarketWithDistance[]> {
  const latRange = radiusKm / 111;
  const lngRange = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  
  const markets = await prisma.market.findMany({
    where: {
      latitude: { gte: lat - latRange, lte: lat + latRange },
      longitude: { gte: lng - lngRange, lte: lng + lngRange },
    },
  });
  
  const marketsWithDistance = markets
    .map((market) => {
      if (!market.latitude || !market.longitude) return null;
      const distance = haversineDistance(lat, lng, market.latitude, market.longitude);
      if (distance > radiusKm) return null;
      return { ...market, distanceKm: distance };
    })
    .filter((m): m is MarketWithDistance => m !== null)
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  
  return attachUserData(marketsWithDistance, userId);
}

export async function getMarketById(id: number, userId?: string): Promise<MarketWithDistance | null> {
  const market = await prisma.market.findUnique({ where: { id } });
  if (!market) return null;
  const [marketWithData] = await attachUserData([market], userId);
  return marketWithData || null;
}

async function attachUserData(markets: any[], userId?: string): Promise<MarketWithDistance[]> {
  if (!userId) return markets;
  
  const marketIds = markets.map((m) => m.id);
  const [favorites, visits] = await Promise.all([
    prisma.favoriteMarket.findMany({
      where: { userId, marketId: { in: marketIds } },
      select: { marketId: true },
    }),
    prisma.visitedMarket.findMany({
      where: { userId, marketId: { in: marketIds } },
      select: { marketId: true, visitCount: true },
    }),
  ]);
  
  const favoriteIds = new Set(favorites.map((f) => f.marketId));
  const visitMap = new Map(visits.map((v) => [v.marketId, v.visitCount]));
  
  return markets.map((market) => ({
    ...market,
    isFavorite: favoriteIds.has(market.id),
    visitCount: visitMap.get(market.id) || 0,
  }));
}
