import { z } from "zod";

export const SearchQuerySchema = z.object({
  query: z.string().min(1),
});

export const NearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(1).max(200).optional(),
});

export const MarketIdSchema = z.coerce.number().int().positive();

export const FavoriteActionSchema = z.object({
  marketId: z.number().int().positive(),
});

export const VisitMarkSchema = z.object({
  marketId: z.number().int().positive(),
  distanceM: z.number().int().min(0).optional(),
});

export const TaskCreateSchema = z.object({
  title: z.string().min(1).max(500),
  notes: z.string().max(2000).optional(),
  marketId: z.number().int().positive().optional(),
  poiId: z.string().optional(),
  poiName: z.string().optional(),
  poiCategory: z.string().optional(),
  poiLat: z.number().optional(),
  poiLng: z.number().optional(),
});

export const TaskUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional(),
});
