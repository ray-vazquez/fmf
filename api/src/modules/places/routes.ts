import { Router, Response } from "express";
import { getNearbyPlaces } from "./service";
import { MarketIdSchema } from "../../lib/validation";
import { AuthRequest } from "../../middleware/auth";

const router = Router();

router.get("/:id/places", async (req: AuthRequest, res: Response) => {
  try {
    const id = MarketIdSchema.parse(req.params.id);
    const places = await getNearbyPlaces(id);
    
    if (!places) {
      res.status(404).json({ error: "Places data not available" });
      return;
    }
    
    res.json(places);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
