export interface Market {
  id: number;
  name: string;
  city: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  isFavorite?: boolean;
  visitCount?: number;
  website?: string;
  season1Date?: string;
  season1Time?: string;
  hasOrganic?: boolean;
  hasVegetables?: boolean;
  hasFruits?: boolean;
  acceptsSNAP?: boolean;
}

export interface WeatherForecast {
  city: string;
  days: Array<{
    date: string;
    temp: number;
    description: string;
    icon: string;
  }>;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: number;
  lat: number;
  lng: number;
}

export interface Task {
  id: number;
  title: string;
  notes?: string;
  status: "PENDING" | "COMPLETED";
  marketId?: number;
  market?: Market;
  poiId?: string;
  poiName?: string;
  createdAt: string;
}
