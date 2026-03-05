import { apiClient } from "../client";
import { Market, WeatherForecast, Place } from "../types";

export async function searchMarkets(query: string): Promise<Market[]> {
  const { data } = await apiClient.get("/markets/search", {
    params: { query },
  });
  return data;
}

export async function findNearbyMarkets(
  lat: number,
  lng: number,
  radiusKm: number = 25
): Promise<Market[]> {
  const { data } = await apiClient.get("/markets/nearby", {
    params: { lat, lng, radiusKm },
  });
  return data;
}

export async function getMarketById(id: number): Promise<Market> {
  const { data } = await apiClient.get(`/markets/${id}`);
  return data;
}

export async function getMarketWeather(id: number): Promise<WeatherForecast[]> {
  const { data } = await apiClient.get(`/markets/${id}/weather`);
  return data;
}

export async function getMarketPlaces(id: number): Promise<Place[]> {
  const { data } = await apiClient.get(`/markets/${id}/places`);
  return data;
}
