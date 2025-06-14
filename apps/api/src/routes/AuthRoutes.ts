import { Router, Request, Response } from "express";
import { RegisterController } from "../controllers/auth/RegisterController";
import { LoginController } from "../controllers/auth/LoginController";
import { ForgotPasswordController } from "../controllers/auth/ForgotPasswordController";
import { ResetPasswordController } from "../controllers/auth/ResetPasswordController";
import { VerifyEmailController } from "../controllers/auth/VerifyEmailController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { Logger } from "@astra/logger";

const logger = Logger.getInstance({ title: "Auth Routes" });
const router: Router = Router();

router.post("/register", (req, res) => RegisterController.register(req, res));
router.post("/login", (req, res) => LoginController.login(req, res));
router.post("/forgot-password", (req, res) =>
  ForgotPasswordController.forgotPassword(req, res)
);
router.post("/reset-password", (req, res) =>
  ResetPasswordController.resetPassword(req, res)
);
router.post("/verify-email", (req, res) =>
  VerifyEmailController.verifyEmail(req, res)
);

router.get(
  "/me",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    logger.debug("User profile accessed", { box: false });
    res.json({ user: req.user });
  }
);

export default router;
