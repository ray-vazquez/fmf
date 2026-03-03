import { apiClient } from "../client";
import { WeatherForecast } from "../types";

export const weatherAPI = {
  getForecast: async (marketId: number): Promise<WeatherForecast> => {
    const response = await apiClient.get(`/markets/${marketId}/weather`);
    return response.data;
  },
};
