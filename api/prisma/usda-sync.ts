import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface USDAMarketRow {
  FMID: string;
  MarketName: string;
  Website: string;
  Facebook: string;
  Twitter: string;
  Youtube: string;
  OtherMedia: string;
  street: string;
  city: string;
  County: string;
  State: string;
  zip: string;
  Season1Date: string;
  Season1Time: string;
  Season2Date: string;
  Season2Time: string;
  Season3Date: string;
  Season3Time: string;
  Season4Date: string;
  Season4Time: string;
  x: string;
  y: string;
  Location: string;
  Credit: string;
  WIC: string;
  WICcash: string;
  SFMNP: string;
  SNAP: string;
  Organic: string;
  Bakedgoods: string;
  Cheese: string;
  Crafts: string;
  Flowers: string;
  Eggs: string;
  Seafood: string;
  Herbs: string;
  Vegetables: string;
  Honey: string;
  Jams: string;
  Maple: string;
  Meat: string;
  Nursery: string;
  Nuts: string;
  Plants: string;
  Poultry: string;
  Prepared: string;
  Soap: string;
  Trees: string;
  Wine: string;
  Coffee: string;
  Beans: string;
  Fruits: string;
  Grains: string;
  Juices: string;
  Mushrooms: string;
  PetFood: string;
  Tofu: string;
  WildHarvested: string;
  updateTime: string;
}

function parseBoolean(value: string): boolean {
  return value?.toLowerCase() === "y";
}

function parseFloat(value: string): number | null {
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

async function syncUSDAData() {
  const csvPath = path.join(__dirname, "data", "usda_farmers_markets.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.error("❌ CSV file not found at:", csvPath);
    console.log("Download from: https://catalog.data.gov/dataset/national-farmers-market-directory");
    process.exit(1);
  }
  
  console.log("📦 Starting USDA farmers market data sync...");
  console.log("📄 Reading CSV file:", csvPath);
  
  const markets: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row: USDAMarketRow) => {
        const market = {
          usdaMarketId: parseInt(row.FMID),
          name: row.MarketName?.trim() || "Unnamed Market",
          
          website: row.Website?.trim() || null,
          facebook: row.Facebook?.trim() || null,
          twitter: row.Twitter?.trim() || null,
          youtube: row.Youtube?.trim() || null,
          otherMedia: row.OtherMedia?.trim() || null,
          
          addressLine1: row.street?.trim() || null,
          city: row.city?.trim() || "Unknown",
          county: row.County?.trim() || null,
          state: row.State?.trim() || "Unknown",
          postalCode: row.zip?.trim() || null,
          locationDescription: row.Location?.trim() || null,
          
          latitude: parseFloat(row.y),
          longitude: parseFloat(row.x),
          
          season1Date: row.Season1Date?.trim() || null,
          season1Time: row.Season1Time?.trim() || null,
          season2Date: row.Season2Date?.trim() || null,
          season2Time: row.Season2Time?.trim() || null,
          season3Date: row.Season3Date?.trim() || null,
          season3Time: row.Season3Time?.trim() || null,
          season4Date: row.Season4Date?.trim() || null,
          season4Time: row.Season4Time?.trim() || null,
          
          acceptsCredit: parseBoolean(row.Credit),
          acceptsWIC: parseBoolean(row.WIC),
          acceptsWICCash: parseBoolean(row.WICcash),
          acceptsSeniorFMNP: parseBoolean(row.SFMNP),
          acceptsSNAP: parseBoolean(row.SNAP),
          
          hasOrganic: parseBoolean(row.Organic),
          hasBakedGoods: parseBoolean(row.Bakedgoods),
          hasCheese: parseBoolean(row.Cheese),
          hasCrafts: parseBoolean(row.Crafts),
          hasFlowers: parseBoolean(row.Flowers),
          hasEggs: parseBoolean(row.Eggs),
          hasSeafood: parseBoolean(row.Seafood),
          hasHerbs: parseBoolean(row.Herbs),
          hasVegetables: parseBoolean(row.Vegetables),
          hasHoney: parseBoolean(row.Honey),
          hasJams: parseBoolean(row.Jams),
          hasMaple: parseBoolean(row.Maple),
          hasMeat: parseBoolean(row.Meat),
          hasNursery: parseBoolean(row.Nursery),
          hasNuts: parseBoolean(row.Nuts),
          hasPlants: parseBoolean(row.Plants),
          hasPoultry: parseBoolean(row.Poultry),
          hasPreparedFoods: parseBoolean(row.Prepared),
          hasSoap: parseBoolean(row.Soap),
          hasTrees: parseBoolean(row.Trees),
          hasWine: parseBoolean(row.Wine),
          hasCoffee: parseBoolean(row.Coffee),
          hasBeans: parseBoolean(row.Beans),
          hasFruits: parseBoolean(row.Fruits),
          hasGrains: parseBoolean(row.Grains),
          hasJuices: parseBoolean(row.Juices),
          hasMushrooms: parseBoolean(row.Mushrooms),
          hasPetFood: parseBoolean(row.PetFood),
          hasTofu: parseBoolean(row.Tofu),
          hasWildHarvested: parseBoolean(row.WildHarvested),
          
          lastUsdaUpdateRaw: row.updateTime?.trim() || null,
        };
        
        markets.push(market);
      })
      .on("end", async () => {
        console.log(`✅ Parsed ${markets.length} markets from CSV`);
        console.log("💾 Writing to database...");
        
        try {
          let imported = 0;
          let updated = 0;
          
          for (const market of markets) {
            try {
              await prisma.market.upsert({
                where: { usdaMarketId: market.usdaMarketId },
                update: market,
                create: market,
              });
              
              const existing = await prisma.market.findUnique({
                where: { usdaMarketId: market.usdaMarketId },
              });
              
              if (existing) {
                updated++;
              } else {
                imported++;
              }
            } catch (err: any) {
              console.error(`Error processing market ${market.usdaMarketId}:`, err.message);
            }
          }
          
          console.log("\n✨ Sync complete!");
          console.log(`   📊 Imported: ${imported}`);
          console.log(`   🔄 Updated: ${updated}`);
          console.log(`   📍 Total markets in database: ${imported + updated}`);
          
          resolve(true);
        } catch (err) {
          console.error("❌ Database error:", err);
          reject(err);
        } finally {
          await prisma.$disconnect();
        }
      })
      .on("error", (err) => {
        console.error("❌ CSV parsing error:", err);
        reject(err);
      });
  });
}

syncUSDAData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
