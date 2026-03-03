import axios from "axios";
import prisma from "../../lib/prisma";
import cache from "../../lib/cache";

export async function getWeatherForecast(marketId: number) {
  const market = await prisma.market.findUnique({
    where: { id: marketId },
    select: { latitude: true, longitude: true },
  });
  
  if (!market || !market.latitude || !market.longitude) {
    return null;
  }
  
  const cacheKey = `weather:${marketId}`;
  const cached = cache.get<any>(cacheKey);
  if (cached) return cached;
  
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return { error: "OpenWeather API key not configured" };
    }
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${market.latitude}&lon=${market.longitude}&appid=${apiKey}&units=imperial`;
    const response = await axios.get(url);
    
    const forecast = {
      city: response.data.city.name,
      days: response.data.list.slice(0, 5).map((item: any) => ({
        date: item.dt_txt,
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      })),
    };
    
    cache.set(cacheKey, forecast, 60 * 60 * 1000); // 1 hour
    return forecast;
  } catch (err) {
    console.error("Weather API error:", err);
    return null;
  }
}
