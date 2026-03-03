import { apiClient } from "../client";
import { Market, Task } from "../types";

export const userAPI = {
  // Favorites
  addFavorite: async (marketId: number) => {
    const response = await apiClient.post("/user/favorites", { marketId });
    return response.data;
  },

  removeFavorite: async (marketId: number) => {
    const response = await apiClient.delete(`/user/favorites/${marketId}`);
    return response.data;
  },

  getFavorites: async (): Promise<Market[]> => {
    const response = await apiClient.get("/user/favorites");
    return response.data;
  },

  // Visits
  markVisit: async (marketId: number, distanceM?: number) => {
    const response = await apiClient.post("/user/visit/mark", {
      marketId,
      distanceM,
    });
    return response.data;
  },

  getVisits: async () => {
    const response = await apiClient.get("/user/visited");
    return response.data;
  },

  // Tasks
  createTask: async (data: Partial<Task>) => {
    const response = await apiClient.post("/user/tasks", data);
    return response.data;
  },

  updateTask: async (id: number, data: Partial<Task>) => {
    const response = await apiClient.patch(`/user/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await apiClient.delete(`/user/tasks/${id}`);
    return response.data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get("/user/tasks");
    return response.data;
  },
};
