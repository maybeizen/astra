import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RegisterRequest, AuthResponse, AuthError } from "../../types/auth";
import { Logger } from "@astra/logger";
import { User } from "../../models/UserModel";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class RegisterController {
  private static logger = Logger.getInstance({ title: "Auth Register" });

  public static async register(
    req: Request<{}, {}, RegisterRequest>,
    res: Response<AuthResponse | AuthError>
  ): Promise<void> {
    try {
      const { email, username, password } = req.body;

      const emailValidation = ValidationUtils.validateEmail(email);
      if (!emailValidation.isValid) {
        this.logger.warning("Invalid email format during registration", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_EMAIL",
          message: emailValidation.message,
        });
        return;
      }

      const usernameValidation = ValidationUtils.validateUsername(username);
      if (!usernameValidation.isValid) {
        this.logger.warning("Invalid username format during registration", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_USERNAME",
          message: usernameValidation.message,
        });
        return;
      }

      const passwordValidation = ValidationUtils.validatePassword(password);
      if (!passwordValidation.isValid) {
        this.logger.warning("Invalid password format during registration", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_INVALID_PASSWORD",
          message: passwordValidation.message,
        });
        return;
      }

      const sanitizedEmail = ValidationUtils.sanitizeInput(email);
      const sanitizedUsername = ValidationUtils.sanitizeInput(username);

      const existingUser = await User.findOne({
        $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }],
      });

      if (existingUser) {
        this.logger.warning("Registration attempt with existing credentials", {
          box: false,
        });
        res.status(400).json({
          code: "AUTH_USER_EXISTS",
          message: "User with this email or username already exists",
        });
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationToken = crypto.randomBytes(48).toString("hex");

      const user = await User.create({
        email: sanitizedEmail,
        username: sanitizedUsername,
        password: hashedPassword,
        isVerified: false,
        verificationToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

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

      this.logger.info(`New user registered: <hl>${sanitizedUsername}</hl>`, {
        box: false,
      });

      const {
        password: _,
        verificationToken: __,
        resetPasswordToken: ___,
        resetPasswordExpires: ____,
        ...userData
      } = user.toObject();

      res.status(201).json({
        token,
        user: userData,
      });
    } catch (error) {
      this.logger.error(`Registration error: <hl>${error}</hl>`, {
        box: false,
      });
      res.status(500).json({
        code: "AUTH_REGISTRATION_ERROR",
        message: "Error during registration",
      });
    }
  }
}
