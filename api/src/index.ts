import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes";
import marketsRoutes from "./modules/markets/routes";
import weatherRoutes from "./modules/weather/routes";
import placesRoutes from "./modules/places/routes";
import userRoutes from "./modules/user/routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/markets", marketsRoutes);
app.use("/api/markets", weatherRoutes);
app.use("/api/markets", placesRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});
