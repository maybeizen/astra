import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthError, AuthTokenPayload } from "../types/auth";
import { Logger } from "@astra/logger";
import { User } from "../models/UserModel";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export class AuthMiddleware {
  private static logger = Logger.getInstance({ title: "Auth Middleware" });

  public static authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        AuthMiddleware.logger.warning("No authorization header", {
          box: false,
        });
        res.status(401).json({
          code: "AUTH_NO_TOKEN",
          message: "No authorization token provided",
        } as AuthError);
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        AuthMiddleware.logger.warning("Invalid authorization header format", {
          box: false,
        });
        res.status(401).json({
          code: "AUTH_INVALID_TOKEN",
          message: "Invalid authorization token format",
        } as AuthError);
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
          algorithms: ["HS512"],
          audience: "astra-api",
          issuer: "astra-auth",
        }) as AuthTokenPayload;

        const user = User.findById(decoded.userId);
        if (!user) {
          AuthMiddleware.logger.warning("User not found for token", {
            box: false,
          });
          res.status(401).json({
            code: "AUTH_INVALID_TOKEN",
            message: "Invalid authorization token",
          } as AuthError);
          return;
        }

        req.user = decoded;
        next();
      } catch (error) {
        AuthMiddleware.logger.warning(`Invalid token: <hl>${error}</hl>`, {
          box: false,
        });
        res.status(401).json({
          code: "AUTH_INVALID_TOKEN",
          message: "Invalid authorization token",
        } as AuthError);
      }
    } catch (error) {
      AuthMiddleware.logger.error(`Authentication error: <hl>${error}</hl>`, {
        box: false,
      });
      res.status(500).json({
        code: "AUTH_ERROR",
        message: "Error during authentication",
      } as AuthError);
    }
  }

  public static requireVerified(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!req.user?.isVerified) {
      AuthMiddleware.logger.warning("Unverified user access attempt", {
        box: false,
      });
      res.status(403).json({
        code: "AUTH_UNVERIFIED",
        message: "Email verification required",
      } as AuthError);
      return;
    }
    next();
  }
}
