import { Router } from "express";
import healthRoutes from "./HealthRoutes";
import authRoutes from "./AuthRoutes";

const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

export default router;
