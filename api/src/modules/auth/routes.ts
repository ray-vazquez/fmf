import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { authMiddleware, AuthRequest } from "../../middleware/auth";

const router = Router();

// Demo social login (simplified)
router.post("/social", async (req: Request, res: Response) => {
  try {
    const { provider, providerId, email, name, avatarUrl } = req.body;
    
    if (!provider || !providerId || !email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { provider, providerId, email, name, avatarUrl },
      });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, provider: true },
    });
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", authMiddleware, (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
