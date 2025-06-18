import { Request, Response, NextFunction } from "express";
import { Logger } from "@astra/logger";
import rateLimit from "express-rate-limit";

export class RateLimitMiddleware {
  private static logger = Logger.getInstance({
    title: "Rate Limit Middleware",
  });

  public static createRateLimiter() {
    try {
      return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: {
          status: "error",
          message: "Too many requests, please try again later.",
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req: Request, res: Response) => {
          this.logger.warning(
            `Rate limit exceeded for <hl>${req.ip}</hl> on \n<hl>${req.path}</hl>`,
            { box: true }
          );
          res.status(429).json({
            status: "error",
            message: "Too many requests, please try again later.",
          });
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create rate limiter: <hl>${error}</hl>`, {
        box: true,
      });
      throw error;
    }
  }
}
