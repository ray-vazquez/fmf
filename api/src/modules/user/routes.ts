import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../../middleware/auth";
import { FavoriteActionSchema, VisitMarkSchema, TaskCreateSchema, TaskUpdateSchema } from "../../lib/validation";
import prisma from "../../lib/prisma";

const router = Router();

// Favorites
router.post("/favorites", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { marketId } = FavoriteActionSchema.parse(req.body);
    const favorite = await prisma.favoriteMarket.create({
      data: { userId: req.userId!, marketId },
    });
    res.json(favorite);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/favorites/:marketId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const marketId = parseInt(req.params.marketId);
    await prisma.favoriteMarket.deleteMany({
      where: { userId: req.userId!, marketId },
    });
    res.json({ message: "Removed from favorites" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/favorites", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favoriteMarket.findMany({
      where: { userId: req.userId! },
      include: { market: true },
    });
    res.json(favorites.map((f) => f.market));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Visits
router.post("/visit/mark", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { marketId, distanceM } = VisitMarkSchema.parse(req.body);
    
    const existing = await prisma.visitedMarket.findUnique({
      where: { userId_marketId: { userId: req.userId!, marketId } },
    });
    
    if (existing) {
      const updated = await prisma.visitedMarket.update({
        where: { id: existing.id },
        data: {
          lastVisitedAt: new Date(),
          visitCount: existing.visitCount + 1,
          lastDistanceM: distanceM,
        },
      });
      res.json(updated);
    } else {
      const visit = await prisma.visitedMarket.create({
        data: { userId: req.userId!, marketId, lastDistanceM: distanceM },
      });
      res.json(visit);
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/visited", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const visits = await prisma.visitedMarket.findMany({
      where: { userId: req.userId! },
      include: { market: true },
      orderBy: { lastVisitedAt: "desc" },
    });
    res.json(visits);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks
router.post("/tasks", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const data = TaskCreateSchema.parse(req.body);
    const task = await prisma.task.create({
      data: { ...data, userId: req.userId! },
    });
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/tasks/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = TaskUpdateSchema.parse(req.body);
    const task = await prisma.task.update({
      where: { id, userId: req.userId! },
      data,
    });
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/tasks/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.task.delete({
      where: { id, userId: req.userId! },
    });
    res.json({ message: "Task deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/tasks", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId! },
      include: { market: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
