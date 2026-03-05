import { Router, Response } from "express";
import axios from "axios";
import cache from "../../lib/cache";
import { MarketIdSchema } from "../../lib/validation";
import prisma from "../../lib/prisma";

const router = Router();

interface WeatherData {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number;
}

router.get("/:id/weather", async (req, res: Response) => {
  try {
    const marketId = MarketIdSchema.parse(req.params.id);
    
    const market = await prisma.market.findUnique({
      where: { id: marketId },
      select: { id: true, latitude: true, longitude: true, name: true },
    });
    
    if (!market || !market.latitude || !market.longitude) {
      res.status(404).json({ error: "Market not found or has no coordinates" });
      return;
    }
    
    const cacheKey = `weather:${market.id}`;
    const cached = cache.get<WeatherData[]>(cacheKey);
    
    if (cached) {
      res.json(cached);
      return;
    }
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "Weather service not configured" });
      return;
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          lat: market.latitude,
          lon: market.longitude,
          appid: apiKey,
          units: "imperial",
          cnt: 40,
        },
      }
    );
    
    const dailyForecasts = new Map<string, any[]>();
    
    response.data.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, []);
      }
      dailyForecasts.get(date)!.push(item);
    });
    
    const forecast: WeatherData[] = Array.from(dailyForecasts.entries())
      .slice(0, 5)
      .map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const midday = items[Math.floor(items.length / 2)];
        
        return {
          date,
          temp: Math.round(midday.main.temp),
          tempMin: Math.round(Math.min(...temps)),
          tempMax: Math.round(Math.max(...temps)),
          description: midday.weather[0].description,
          icon: midday.weather[0].icon,
          humidity: midday.main.humidity,
          windSpeed: Math.round(midday.wind.speed),
          pop: Math.round((midday.pop || 0) * 100),
        };
      });
    
    cache.set(cacheKey, forecast, 30 * 60 * 1000); // 30 min cache
    res.json(forecast);
  } catch (err: any) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export default router;
