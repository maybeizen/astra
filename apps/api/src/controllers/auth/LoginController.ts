import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginRequest, AuthResponse, AuthError } from "../../types/auth";
import { Logger } from "@astra/logger";
import { User } from "../../models/UserModel";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class LoginController {
  private static logger = Logger.getInstance({ title: "Auth Login" });

  public static async login(
    req: Request<{}, {}, LoginRequest>,
    res: Response<AuthResponse | AuthError>
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const emailValidation = ValidationUtils.validateEmail(email);
      if (!emailValidation.isValid) {
        this.logger.warning("Invalid email format during login", {
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
        this.logger.warning("Login attempt with non-existent email", {
          box: false,
        });
        res.status(401).json({
          code: "AUTH_INVALID_CREDENTIALS",
          message: "Invalid email or password",
        });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        this.logger.warning("Login attempt with invalid password", {
          box: false,
        });
        res.status(401).json({
          code: "AUTH_INVALID_CREDENTIALS",
          message: "Invalid email or password",
        });
        return;
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
          algorithm: "HS512",
          audience: "astra-api",
          issuer: "astra-auth",
        }
      );

      this.logger.info(`User logged in: <hl>${user.username}</hl>`, {
        box: false,
      });

      const {
        password: _,
        verificationToken: __,
        resetPasswordToken: ___,
        resetPasswordExpires: ____,
        ...userData
      } = user.toObject();

      res.status(200).json({
        token,
        user: userData,
      });
    } catch (error) {
      this.logger.error(`Login error: <hl>${error}</hl>`, { box: false });
      res.status(500).json({
        code: "AUTH_LOGIN_ERROR",
        message: "Error during login",
      });
    }
  }
}
