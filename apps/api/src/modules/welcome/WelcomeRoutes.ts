import { Router, Request, Response } from "express";
import { WelcomeController } from "./WelcomeController";
import { SessionAuthMiddleware } from "../../middleware/SessionAuthMiddleware";
import { RateLimitMiddleware } from "../../middleware/RateLimitMiddleware";
import { WelcomeValidation } from "./WelcomeValidation";

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
  WelcomeValidation.validateCreateWelcomeMiddleware,
  (req: Request, res: Response) => WelcomeController.createWelcome(req, res)
);

router.post("/test-variables", (req: Request, res: Response) =>
  WelcomeController.testWelcomeVariables(req, res)
);

router.put(
  "/:id",
  SessionAuthMiddleware.isAuthenticated,
  WelcomeValidation.validateUpdateWelcomeMiddleware,
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
  WelcomeValidation.validateToggleWelcomeMiddleware,
  (req: Request, res: Response) => WelcomeController.toggleWelcome(req, res)
);

export default router;
