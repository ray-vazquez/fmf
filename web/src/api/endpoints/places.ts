import { apiClient } from "../client";
import { Place } from "../types";

export const placesAPI = {
  getNearby: async (marketId: number): Promise<Place[]> => {
    const response = await apiClient.get(`/markets/${marketId}/places`);
    return response.data;
  },
};
