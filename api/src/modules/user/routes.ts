import { Router, Response } from "express";
import prisma from "../../lib/prisma";
import { authMiddleware, AuthRequest } from "../../middleware/auth";
import {
  FavoriteActionSchema,
  VisitMarkSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
} from "../../lib/validation";
import { isWithinRadius } from "../../lib/geo";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ============================================================================
// FAVORITES
// ============================================================================

router.post("/favorites", async (req: AuthRequest, res: Response) => {
  try {
    const { marketId } = FavoriteActionSchema.parse(req.body);
    
    const favorite = await prisma.favoriteMarket.create({
      data: {
        userId: req.userId!,
        marketId,
      },
      include: { market: true },
    });
    
    res.status(201).json(favorite);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Already favorited" });
      return;
    }
    res.status(400).json({ error: err.message });
  }
});

router.delete("/favorites/:marketId", async (req: AuthRequest, res: Response) => {
  try {
    const marketId = parseInt(req.params.marketId);
    
    await prisma.favoriteMarket.delete({
      where: {
        userId_marketId: {
          userId: req.userId!,
          marketId,
        },
      },
    });
    
    res.json({ message: "Favorite removed" });
  } catch (err: any) {
    res.status(404).json({ error: "Favorite not found" });
  }
});

router.get("/favorites", async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favoriteMarket.findMany({
      where: { userId: req.userId! },
      include: { market: true },
      orderBy: { createdAt: "desc" },
    });
    
    res.json(favorites.map((f) => f.market));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// VISITS
// ============================================================================

router.post("/visit/mark", async (req: AuthRequest, res: Response) => {
  try {
    const { marketId, distanceM } = VisitMarkSchema.parse(req.body);
    
    const market = await prisma.market.findUnique({
      where: { id: marketId },
      select: { latitude: true, longitude: true },
    });
    
    if (!market || !market.latitude || !market.longitude) {
      res.status(404).json({ error: "Market not found" });
      return;
    }
    
    // Check if visit exists
    const existing = await prisma.visitedMarket.findUnique({
      where: {
        userId_marketId: {
          userId: req.userId!,
          marketId,
        },
      },
    });
    
    if (existing) {
      const updated = await prisma.visitedMarket.update({
        where: { id: existing.id },
        data: {
          lastVisitedAt: new Date(),
          visitCount: { increment: 1 },
          lastDistanceM: distanceM,
        },
      });
      res.json(updated);
    } else {
      const created = await prisma.visitedMarket.create({
        data: {
          userId: req.userId!,
          marketId,
          lastDistanceM: distanceM,
        },
      });
      res.status(201).json(created);
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/visited", async (req: AuthRequest, res: Response) => {
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

// ============================================================================
// TASKS
// ============================================================================

router.post("/tasks", async (req: AuthRequest, res: Response) => {
  try {
    const data = TaskCreateSchema.parse(req.body);
    
    const task = await prisma.task.create({
      data: {
        ...data,
        userId: req.userId!,
      },
      include: { market: true },
    });
    
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/tasks", async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId!,
        ...(status && { status: status as any }),
      },
      include: { market: true },
      orderBy: { createdAt: "desc" },
    });
    
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/tasks/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = TaskUpdateSchema.parse(req.body);
    
    const task = await prisma.task.updateMany({
      where: {
        id,
        userId: req.userId!,
      },
      data,
    });
    
    if (task.count === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    
    const updated = await prisma.task.findUnique({
      where: { id },
      include: { market: true },
    });
    
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/tasks/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const task = await prisma.task.deleteMany({
      where: {
        id,
        userId: req.userId!,
      },
    });
    
    if (task.count === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    
    res.json({ message: "Task deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
