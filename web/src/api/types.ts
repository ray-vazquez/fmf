export interface Market {
  id: number;
  usdaMarketId: number;
  name: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  city: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  season1Date?: string;
  season1Time?: string;
  acceptsCredit: boolean;
  acceptsWIC: boolean;
  acceptsSNAP: boolean;
  hasOrganic: boolean;
  hasVegetables: boolean;
  hasFruits: boolean;
  hasMeat: boolean;
  hasBakedGoods: boolean;
  distanceKm?: number;
  isFavorite?: boolean;
  visitCount?: number;
}

export interface WeatherForecast {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  distance: number;
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Task {
  id: number;
  title: string;
  notes?: string;
  status: "PENDING" | "COMPLETED";
  marketId?: number;
  market?: Market;
  poiName?: string;
  createdAt: string;
}

export interface Visit {
  id: number;
  marketId: number;
  market: Market;
  visitCount: number;
  lastVisitedAt: string;
  firstVisitedAt: string;
}
