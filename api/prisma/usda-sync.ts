import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UsdaRow {
  FMID: string;
  MarketName: string;
  Website?: string;
  Facebook?: string;
  Twitter?: string;
  Youtube?: string;
  OtherMedia?: string;
  street?: string;
  city: string;
  County?: string;
  State: string;
  zip?: string;
  Season1Date?: string;
  Season1Time?: string;
  Season2Date?: string;
  Season2Time?: string;
  Season3Date?: string;
  Season3Time?: string;
  Season4Date?: string;
  Season4Time?: string;
  x?: string;
  y?: string;
  Location?: string;
  Credit?: string;
  WIC?: string;
  WICcash?: string;
  SFMNP?: string;
  SNAP?: string;
  Organic?: string;
  Bakedgoods?: string;
  Cheese?: string;
  Crafts?: string;
  Flowers?: string;
  Eggs?: string;
  Seafood?: string;
  Herbs?: string;
  Vegetables?: string;
  Honey?: string;
  Jams?: string;
  Maple?: string;
  Meat?: string;
  Nursery?: string;
  Nuts?: string;
  Plants?: string;
  Poultry?: string;
  Prepared?: string;
  Soap?: string;
  Trees?: string;
  Wine?: string;
  Coffee?: string;
  Beans?: string;
  Fruits?: string;
  Grains?: string;
  Juices?: string;
  Mushrooms?: string;
  PetFood?: string;
  Tofu?: string;
  WildHarvested?: string;
  updateTime?: string;
}

function parseYesNo(value?: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toUpperCase();
  return normalized === "Y" || normalized === "YES";
}

async function syncUsdaData() {
  const csvPath = path.join(__dirname, "data", "usda_farmers_markets.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    console.error("Please download the USDA Farmers Market Directory CSV from:");
    console.error("https://catalog.data.gov/dataset/national-farmers-market-directory");
    console.error(`And place it at: ${csvPath}`);
    process.exit(1);
  }
  
  console.log("📥 Reading USDA Farmers Market CSV...");
  
  const rows: UsdaRow[] = [];
  
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row: UsdaRow) => rows.push(row))
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
  
  console.log(`✅ Loaded ${rows.length} markets from CSV`);
  console.log("🔄 Syncing to database...");
  
  let created = 0;
  let updated = 0;
  let skipped = 0;
  
  for (const row of rows) {
    try {
      const usdaMarketId = parseInt(row.FMID);
      
      if (isNaN(usdaMarketId)) {
        skipped++;
        continue;
      }
      
      const marketData = {
        usdaMarketId,
        name: row.MarketName || "Unknown Market",
        website: row.Website || null,
        facebook: row.Facebook || null,
        twitter: row.Twitter || null,
        youtube: row.Youtube || null,
        otherMedia: row.OtherMedia || null,
        addressLine1: row.street || null,
        city: row.city || "Unknown",
        county: row.County || null,
        state: row.State || "Unknown",
        postalCode: row.zip || null,
        locationDescription: row.Location || null,
        latitude: row.y ? parseFloat(row.y) : null,
        longitude: row.x ? parseFloat(row.x) : null,
        season1Date: row.Season1Date || null,
        season1Time: row.Season1Time || null,
        season2Date: row.Season2Date || null,
        season2Time: row.Season2Time || null,
        season3Date: row.Season3Date || null,
        season3Time: row.Season3Time || null,
        season4Date: row.Season4Date || null,
        season4Time: row.Season4Time || null,
        acceptsCredit: parseYesNo(row.Credit),
        acceptsWIC: parseYesNo(row.WIC),
        acceptsWICCash: parseYesNo(row.WICcash),
        acceptsSeniorFMNP: parseYesNo(row.SFMNP),
        acceptsSNAP: parseYesNo(row.SNAP),
        hasOrganic: parseYesNo(row.Organic),
        hasBakedGoods: parseYesNo(row.Bakedgoods),
        hasCheese: parseYesNo(row.Cheese),
        hasCrafts: parseYesNo(row.Crafts),
        hasFlowers: parseYesNo(row.Flowers),
        hasEggs: parseYesNo(row.Eggs),
        hasSeafood: parseYesNo(row.Seafood),
        hasHerbs: parseYesNo(row.Herbs),
        hasVegetables: parseYesNo(row.Vegetables),
        hasHoney: parseYesNo(row.Honey),
        hasJams: parseYesNo(row.Jams),
        hasMaple: parseYesNo(row.Maple),
        hasMeat: parseYesNo(row.Meat),
        hasNursery: parseYesNo(row.Nursery),
        hasNuts: parseYesNo(row.Nuts),
        hasPlants: parseYesNo(row.Plants),
        hasPoultry: parseYesNo(row.Poultry),
        hasPreparedFoods: parseYesNo(row.Prepared),
        hasSoap: parseYesNo(row.Soap),
        hasTrees: parseYesNo(row.Trees),
        hasWine: parseYesNo(row.Wine),
        hasCoffee: parseYesNo(row.Coffee),
        hasBeans: parseYesNo(row.Beans),
        hasFruits: parseYesNo(row.Fruits),
        hasGrains: parseYesNo(row.Grains),
        hasJuices: parseYesNo(row.Juices),
        hasMushrooms: parseYesNo(row.Mushrooms),
        hasPetFood: parseYesNo(row.PetFood),
        hasTofu: parseYesNo(row.Tofu),
        hasWildHarvested: parseYesNo(row.WildHarvested),
        lastUsdaUpdateRaw: row.updateTime || null,
      };
      
      const existing = await prisma.market.findUnique({
        where: { usdaMarketId },
      });
      
      if (existing) {
        await prisma.market.update({
          where: { id: existing.id },
          data: marketData,
        });
        updated++;
      } else {
        await prisma.market.create({
          data: marketData,
        });
        created++;
      }
      
      if ((created + updated) % 100 === 0) {
        console.log(`   Processed ${created + updated} markets...`);
      }
    } catch (err: any) {
      console.error(`Error processing market ${row.FMID}:`, err.message);
      skipped++;
    }
  }
  
  console.log("");
  console.log("✅ Sync complete!");
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${created + updated + skipped}`);
}

syncUsdaData()
  .then(() => {
    console.log("\n🎉 USDA data sync successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Sync failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
