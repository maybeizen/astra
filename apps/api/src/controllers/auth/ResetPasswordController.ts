import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ResetPasswordRequest, AuthError } from "../../types/auth";
import { Logger } from "@astra/logger";
import { User } from "../../models/UserModel";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class ResetPasswordController {
  private static logger = Logger.getInstance({ title: "Auth Reset Password" });

  public static async resetPassword(
    req: Request<{}, {}, ResetPasswordRequest>,
    res: Response<{ message: string } | AuthError>
  ): Promise<void> {
    try {
      const { token, password } = req.body;

      const passwordValidation = ValidationUtils.validatePassword(password);
      if (!passwordValidation.isValid) {
        this.logger.warning("Invalid password format during reset", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_PASSWORD",
          message: passwordValidation.message,
        });
        return;
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        this.logger.warning("Invalid or expired reset token used", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_RESET_TOKEN",
          message: "Invalid or expired reset token",
        });
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      this.logger.info(
        `Password reset successful for: <hl>${user.username}</hl>`,
        { box: false }
      );

      res.status(200).json({
        message: "Password has been reset successfully",
      });
    } catch (error) {
      this.logger.error(`Reset password error: <hl>${error}</hl>`, {
        box: false,
      });
      res.status(500).json({
        code: "AUTH_RESET_PASSWORD_ERROR",
        message: "Error resetting password",
      });
    }
  }
}
