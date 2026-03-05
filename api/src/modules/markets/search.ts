// Additional search utilities and helpers
import { Market } from "@prisma/client";

export interface SearchFilters {
  hasOrganic?: boolean;
  acceptsSNAP?: boolean;
  hasVegetables?: boolean;
  hasFruits?: boolean;
  hasMeat?: boolean;
  hasPoultry?: boolean;
  hasSeafood?: boolean;
  hasDairy?: boolean;
  hasBakedGoods?: boolean;
}

export function buildFilterQuery(filters: SearchFilters) {
  const where: any = {};
  
  if (filters.hasOrganic) where.hasOrganic = true;
  if (filters.acceptsSNAP) where.acceptsSNAP = true;
  if (filters.hasVegetables) where.hasVegetables = true;
  if (filters.hasFruits) where.hasFruits = true;
  if (filters.hasMeat) where.hasMeat = true;
  if (filters.hasPoultry) where.hasPoultry = true;
  if (filters.hasSeafood) where.hasSeafood = true;
  if (filters.hasBakedGoods) where.hasBakedGoods = true;
  
  return where;
}

export function extractProducts(market: Market): string[] {
  const products: string[] = [];
  
  if (market.hasVegetables) products.push("Vegetables");
  if (market.hasFruits) products.push("Fruits");
  if (market.hasMeat) products.push("Meat");
  if (market.hasPoultry) products.push("Poultry");
  if (market.hasSeafood) products.push("Seafood");
  if (market.hasEggs) products.push("Eggs");
  if (market.hasCheese) products.push("Cheese");
  if (market.hasBakedGoods) products.push("Baked Goods");
  if (market.hasHoney) products.push("Honey");
  if (market.hasJams) products.push("Jams");
  if (market.hasMaple) products.push("Maple Syrup");
  if (market.hasHerbs) products.push("Herbs");
  if (market.hasFlowers) products.push("Flowers");
  if (market.hasPlants) products.push("Plants");
  if (market.hasNuts) products.push("Nuts");
  if (market.hasBeans) products.push("Beans");
  if (market.hasGrains) products.push("Grains");
  if (market.hasJuices) products.push("Juices");
  if (market.hasMushrooms) products.push("Mushrooms");
  if (market.hasWine) products.push("Wine");
  if (market.hasCoffee) products.push("Coffee");
  if (market.hasSoap) products.push("Soap");
  if (market.hasCrafts) products.push("Crafts");
  if (market.hasPreparedFoods) products.push("Prepared Foods");
  if (market.hasTofu) products.push("Tofu");
  if (market.hasWildHarvested) products.push("Wild Harvested");
  
  return products;
}

export function formatSeasonInfo(market: Market): string[] {
  const seasons: string[] = [];
  
  if (market.season1Date || market.season1Time) {
    seasons.push(`${market.season1Date || ""} ${market.season1Time || ""}`.trim());
  }
  if (market.season2Date || market.season2Time) {
    seasons.push(`${market.season2Date || ""} ${market.season2Time || ""}`.trim());
  }
  if (market.season3Date || market.season3Time) {
    seasons.push(`${market.season3Date || ""} ${market.season3Time || ""}`.trim());
  }
  if (market.season4Date || market.season4Time) {
    seasons.push(`${market.season4Date || ""} ${market.season4Time || ""}`.trim());
  }
  
  return seasons.filter((s) => s.length > 0);
}
