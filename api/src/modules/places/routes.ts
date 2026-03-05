import { Router, Response } from "express";
import axios from "axios";
import cache from "../../lib/cache";
import { MarketIdSchema } from "../../lib/validation";
import prisma from "../../lib/prisma";

const router = Router();

interface Place {
  id: string;
  name: string;
  category: string;
  distance: number;
  lat: number;
  lng: number;
  address?: string;
}

router.get("/:id/places", async (req, res: Response) => {
  try {
    const marketId = MarketIdSchema.parse(req.params.id);
    const category = req.query.category as string | undefined;
    
    const market = await prisma.market.findUnique({
      where: { id: marketId },
      select: { id: true, latitude: true, longitude: true },
    });
    
    if (!market || !market.latitude || !market.longitude) {
      res.status(404).json({ error: "Market not found or has no coordinates" });
      return;
    }
    
    const cacheKey = `places:${market.id}:${category || "all"}`;
    const cached = cache.get<Place[]>(cacheKey);
    
    if (cached) {
      res.json(cached);
      return;
    }
    
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "Places service not configured" });
      return;
    }
    
    const categories = category
      ? [category]
      : ["catering.cafe", "catering.restaurant", "entertainment", "leisure.park"];
    
    const response = await axios.get(
      `https://api.geoapify.com/v2/places`,
      {
        params: {
          categories: categories.join(","),
          filter: `circle:${market.longitude},${market.latitude},2000`,
          limit: 20,
          apiKey,
        },
      }
    );
    
    const places: Place[] = response.data.features.map((feature: any) => ({
      id: feature.properties.place_id,
      name: feature.properties.name || feature.properties.category,
      category: feature.properties.category,
      distance: Math.round(feature.properties.distance || 0),
      lat: feature.properties.lat,
      lng: feature.properties.lon,
      address: feature.properties.formatted,
    }));
    
    cache.set(cacheKey, places, 60 * 60 * 1000); // 1 hour cache
    res.json(places);
  } catch (err: any) {
    console.error("Places API error:", err.message);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

export default router;
