import { Router, Response } from "express";
import { searchMarkets, findNearbyMarkets, getMarketById } from "./service";
import { authMiddleware, AuthRequest } from "../../middleware/auth";
import { SearchQuerySchema, NearbyQuerySchema, MarketIdSchema } from "../../lib/validation";

const router = Router();

function optionalAuth(req: AuthRequest, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authMiddleware(req, res, next);
  }
  next();
}

router.get("/search", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = SearchQuerySchema.parse(req.query);
    const markets = await searchMarkets(query, req.userId);
    res.json(markets);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/nearby", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, radiusKm } = NearbyQuerySchema.parse(req.query);
    const markets = await findNearbyMarkets(lat, lng, radiusKm, req.userId);
    res.json(markets);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = MarketIdSchema.parse(req.params.id);
    const market = await getMarketById(id, req.userId);
    
    if (!market) {
      res.status(404).json({ error: "Market not found" });
      return;
    }
    
    res.json(market);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
