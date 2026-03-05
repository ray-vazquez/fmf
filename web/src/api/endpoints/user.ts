import { apiClient } from "../client";
import { Market, Task, Visit } from "../types";

// Favorites
export async function addFavorite(marketId: number): Promise<void> {
  await apiClient.post("/user/favorites", { marketId });
}

export async function removeFavorite(marketId: number): Promise<void> {
  await apiClient.delete(`/user/favorites/${marketId}`);
}

export async function getFavorites(): Promise<Market[]> {
  const { data } = await apiClient.get("/user/favorites");
  return data;
}

// Visits
export async function markVisit(marketId: number, distanceM?: number): Promise<void> {
  await apiClient.post("/user/visit/mark", { marketId, distanceM });
}

export async function getVisitHistory(): Promise<Visit[]> {
  const { data } = await apiClient.get("/user/visited");
  return data;
}

// Tasks
export async function createTask(task: {
  title: string;
  notes?: string;
  marketId?: number;
  poiId?: string;
  poiName?: string;
}): Promise<Task> {
  const { data } = await apiClient.post("/user/tasks", task);
  return data;
}

export async function getTasks(status?: "PENDING" | "COMPLETED"): Promise<Task[]> {
  const { data } = await apiClient.get("/user/tasks", {
    params: status ? { status } : {},
  });
  return data;
}

export async function updateTask(
  id: number,
  updates: { title?: string; notes?: string; status?: "PENDING" | "COMPLETED" }
): Promise<Task> {
  const { data } = await apiClient.patch(`/user/tasks/${id}`, updates);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await apiClient.delete(`/user/tasks/${id}`);
}
