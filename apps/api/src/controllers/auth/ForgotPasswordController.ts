import { Request, Response } from "express";
import crypto from "crypto";
import { ForgotPasswordRequest, AuthError } from "../../types/auth";
import { Logger } from "@astra/logger";
import { User } from "../../models/UserModel";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class ForgotPasswordController {
  private static logger = Logger.getInstance({ title: "Auth Forgot Password" });

  public static async forgotPassword(
    req: Request<{}, {}, ForgotPasswordRequest>,
    res: Response<{ message: string } | AuthError>
  ): Promise<void> {
    try {
      const { email } = req.body;

      const emailValidation = ValidationUtils.validateEmail(email);
      if (!emailValidation.isValid) {
        this.logger.warning("Invalid email format during forgot password", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_EMAIL",
          message: emailValidation.message,
        });
        return;
      }

      const sanitizedEmail = ValidationUtils.sanitizeInput(email);

      const user = await User.findOne({ email: sanitizedEmail });
      if (!user) {
        this.logger.warning("Forgot password attempt with non-existent email", {
          box: false,
        });
        res.status(404).json({
          code: "AUTH_USER_NOT_FOUND",
          message: "User not found",
        });
        return;
      }

      const resetToken = crypto.randomBytes(48).toString("hex");
      const resetExpires = new Date(Date.now() + 3600000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      this.logger.info(
        `Password reset token generated for: <hl>${user.username}</hl>`,
        { box: false }
      );

      res.status(200).json({
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      this.logger.error(`Forgot password error: <hl>${error}</hl>`, {
        box: false,
      });
      res.status(500).json({
        code: "AUTH_FORGOT_PASSWORD_ERROR",
        message: "Error processing forgot password request",
      });
    }
  }
}
