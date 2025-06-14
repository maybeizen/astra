import { Request, Response } from "express";
import { VerifyEmailRequest, AuthError } from "../../types/auth";
import { Logger } from "@astra/logger";
import { User } from "../../models/UserModel";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class VerifyEmailController {
  private static logger = Logger.getInstance({
    title: "Auth Email Verification",
  });

  public static async verifyEmail(
    req: Request<{}, {}, VerifyEmailRequest>,
    res: Response<{ message: string } | AuthError>
  ): Promise<void> {
    try {
      const { token } = req.body;

      if (!/^[a-f0-9]{96}$/.test(token)) {
        this.logger.warning("Invalid verification token format", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_VERIFICATION_TOKEN",
          message: "Invalid verification token format",
        });
        return;
      }

      const user = await User.findOne({
        verificationToken: token,
      });

      if (!user) {
        this.logger.warning("Invalid verification token used", { box: false });
        res.status(400).json({
          code: "AUTH_INVALID_VERIFICATION_TOKEN",
          message: "Invalid verification token",
        });
        return;
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      this.logger.info(
        `Email verified successfully for: <hl>${user.username}</hl>`,
        {
          box: false,
        }
      );

      res.status(200).json({
        message: "Email verified successfully",
      });
    } catch (error) {
      this.logger.error(`Email verification error: <hl>${error}</hl>`, {
        box: false,
      });
      res.status(500).json({
        code: "AUTH_VERIFY_EMAIL_ERROR",
        message: "Error verifying email",
      });
    }
  }
}
