import { Router } from "express";
import { GuildController } from "../controllers/GuildController";
import { SessionAuthMiddleware } from "../middleware/SessionAuthMiddleware";

const router: Router = Router();

router.get("/user", SessionAuthMiddleware.isAuthenticated, (req, res) =>
  GuildController.getUserGuilds(req, res)
);

export default router;
