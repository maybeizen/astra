import { Router, Request, Response } from "express";
import { GuildController } from "../controllers/GuildController";
import { SessionAuthMiddleware } from "../middleware/SessionAuthMiddleware";

const router: Router = Router();

router.get(
  "/user",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => GuildController.getUserGuilds(req, res)
);

router.get(
  "/:id",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => GuildController.getGuild(req, res)
);

export default router;
