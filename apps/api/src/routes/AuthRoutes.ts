import { Router, Request, Response } from "express";
import { DiscordController } from "../controllers/auth/DiscordController";
import { SessionAuthMiddleware } from "../middleware/SessionAuthMiddleware";
import { Logger } from "@astra/logger";

const logger = Logger.getInstance({ title: "Auth Routes" });
const router: Router = Router();

router.get("/discord", (req, res) => DiscordController.login(req, res));
router.get("/discord/callback", (req, res) =>
  DiscordController.callback(req, res)
);

router.get(
  "/me",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => {
    logger.debug("User profile accessed", { box: false });
    res.json({ user: req.user });
  }
);

router.post("/logout", SessionAuthMiddleware.isAuthenticated, (req, res) =>
  DiscordController.logout(req, res)
);

export default router;
