import axios from "axios";
import prisma from "../../lib/prisma";
import cache from "../../lib/cache";

export async function getNearbyPlaces(marketId: number) {
  const market = await prisma.market.findUnique({
    where: { id: marketId },
    select: { latitude: true, longitude: true },
  });
  
  if (!market || !market.latitude || !market.longitude) {
    return null;
  }
  
  const cacheKey = `places:${marketId}`;
  const cached = cache.get<any>(cacheKey);
  if (cached) return cached;
  
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      return { error: "Geoapify API key not configured" };
    }
    
    const url = `https://api.geoapify.com/v2/places?categories=catering,entertainment,tourism&filter=circle:${market.longitude},${market.latitude},1000&limit=10&apiKey=${apiKey}`;
    const response = await axios.get(url);
    
    const places = response.data.features.map((feature: any) => ({
      id: feature.properties.place_id,
      name: feature.properties.name,
      category: feature.properties.categories[0],
      address: feature.properties.address_line1,
      distance: feature.properties.distance,
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
    }));
    
    cache.set(cacheKey, places, 24 * 60 * 60 * 1000); // 24 hours
    return places;
  } catch (err) {
    console.error("Places API error:", err);
    return [];
  }
}
