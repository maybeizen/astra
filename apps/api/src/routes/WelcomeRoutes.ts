import { Router, Request, Response } from "express";
import { WelcomeController } from "../controllers/guild/welcome";
import { SessionAuthMiddleware } from "../middleware/SessionAuthMiddleware";
import { RateLimitMiddleware } from "../middleware/RateLimitMiddleware";

const router: Router = Router();

router.use(RateLimitMiddleware.createRateLimiter());

router.get(
  "/guild/:guildId",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => WelcomeController.getGuildWelcomes(req, res)
);

router.get(
  "/:id",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => WelcomeController.getWelcome(req, res)
);

router.post(
  "/",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => WelcomeController.createWelcome(req, res)
);

router.put(
  "/:id",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => WelcomeController.updateWelcome(req, res)
);

router.delete(
  "/:id",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => WelcomeController.deleteWelcome(req, res)
);

router.patch(
  "/:id/toggle",
  SessionAuthMiddleware.isAuthenticated,
  (req: Request, res: Response) => WelcomeController.toggleWelcome(req, res)
);

export default router;
