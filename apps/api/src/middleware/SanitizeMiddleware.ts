import { Request, Response, NextFunction } from "express";
import { Logger } from "@astra/logger";
import { sanitize } from "class-sanitizer";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class SanitizeMiddleware {
  private static logger = Logger.getInstance({ title: "Sanitize Middleware" });

  public static sanitizeInput(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dtoObject = plainToInstance(dtoClass, req.body);
        await sanitize(dtoObject);

        const errors = await validate(dtoObject);
        if (errors.length > 0) {
          const errorDetails = errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          }));
          this.logger.warning(
            `Validation failed: ${JSON.stringify(errorDetails)}`,
            { box: true }
          );
          res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errorDetails,
          });
          return;
        }

        req.body = dtoObject;
        next();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        this.logger.error(`Sanitization failed: ${errorMessage}`, {
          box: true,
        });
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    };
  }
}
