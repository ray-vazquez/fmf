import { apiClient } from "../client";

export const authAPI = {
  socialLogin: async (provider: string, providerId: string, email: string, name?: string) => {
    const response = await apiClient.post("/auth/social", {
      provider,
      providerId,
      email,
      name,
    });
    return response.data;
  },

  getMe: async (token: string) => {
    const response = await apiClient.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};
