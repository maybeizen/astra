import { Router } from "express";
import healthRoutes from "./HealthRoutes";
import authRoutes from "./AuthRoutes";
import guildRoutes from "./GuildRoutes";
import welcomeRoutes from "./WelcomeRoutes";

const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/guilds", guildRoutes);
router.use("/welcomes", welcomeRoutes);

export default router;
