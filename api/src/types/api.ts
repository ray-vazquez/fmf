export interface MarketWithDistance {
  id: number;
  name: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  isFavorite?: boolean;
  visitCount?: number;
}
