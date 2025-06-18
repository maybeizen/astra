import { Router } from "express";
import healthRoutes from "./HealthRoutes";
import authRoutes from "./AuthRoutes";
import guildRoutes from "./GuildRoutes";

const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/guilds", guildRoutes);

export default router;
