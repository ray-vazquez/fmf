import { Router, Response } from "express";
import { getWeatherForecast } from "./service";
import { MarketIdSchema } from "../../lib/validation";
import { AuthRequest } from "../../middleware/auth";

const router = Router();

router.get("/:id/weather", async (req: AuthRequest, res: Response) => {
  try {
    const id = MarketIdSchema.parse(req.params.id);
    const forecast = await getWeatherForecast(id);
    
    if (!forecast) {
      res.status(404).json({ error: "Weather data not available" });
      return;
    }
    
    res.json(forecast);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
