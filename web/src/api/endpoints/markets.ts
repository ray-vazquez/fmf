import { apiClient } from "../client";
import { Market } from "../types";

export const marketsAPI = {
  search: async (query: string): Promise<Market[]> => {
    const response = await apiClient.get(`/markets/search`, {
      params: { query },
    });
    return response.data;
  },

  nearby: async (lat: number, lng: number, radiusKm?: number): Promise<Market[]> => {
    const response = await apiClient.get(`/markets/nearby`, {
      params: { lat, lng, radiusKm },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Market> => {
    const response = await apiClient.get(`/markets/${id}`);
    return response.data;
  },
};
