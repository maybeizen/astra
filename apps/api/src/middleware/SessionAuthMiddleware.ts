import { Request, Response, NextFunction } from "express";
import { Logger } from "@astra/logger";

const logger = Logger.getInstance({ title: "Session Auth" });

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      discordId?: string;
      discordUsername?: string;
      [key: string]: any;
    }

    interface Request {
      isAuthenticated(): boolean;
      logout(callback: (err: Error | null) => void): void;
      user?: User;
    }
  }
}

export class SessionAuthMiddleware {
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    }

    logger.debug("Unauthorized access attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  static isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
      return next();
    }

    return res.status(403).json({ error: "Already authenticated" });
  }
}
