import { Request, Response, NextFunction } from "express";
import { WelcomeType } from "./types";

export class WelcomeValidation {
  static validateCreateWelcomeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { guildId, channelId, type } = req.body;

    if (!guildId || typeof guildId !== "string" || guildId.trim() === "") {
      return res.status(400).json({
        error: "Guild ID is required and must be a string",
      });
    }

    if (
      !channelId ||
      typeof channelId !== "string" ||
      channelId.trim() === ""
    ) {
      return res.status(400).json({
        error: "Channel ID is required and must be a string",
      });
    }

    if (!type || !Object.values(WelcomeType).includes(type)) {
      return res.status(400).json({
        error: "Type must be one of: message, card, dm",
      });
    }

    if (req.body.message) {
      if (
        typeof req.body.message.enabled !== "undefined" &&
        typeof req.body.message.enabled !== "boolean"
      ) {
        return res.status(400).json({
          error: "Message enabled must be a boolean",
        });
      }
      if (
        req.body.message.content &&
        typeof req.body.message.content !== "string"
      ) {
        return res.status(400).json({
          error: "Message content must be a string",
        });
      }
    }

    if (req.body.dm) {
      if (
        typeof req.body.dm.enabled !== "undefined" &&
        typeof req.body.dm.enabled !== "boolean"
      ) {
        return res.status(400).json({
          error: "DM enabled must be a boolean",
        });
      }
      if (req.body.dm.content && typeof req.body.dm.content !== "string") {
        return res.status(400).json({
          error: "DM content must be a string",
        });
      }
    }

    if (req.body.card) {
      if (
        typeof req.body.card.enabled !== "undefined" &&
        typeof req.body.card.enabled !== "boolean"
      ) {
        return res.status(400).json({
          error: "Card enabled must be a boolean",
        });
      }
      if (req.body.card.content && typeof req.body.card.content !== "string") {
        return res.status(400).json({
          error: "Card content must be a string",
        });
      }
      if (
        req.body.card.imageUrl &&
        typeof req.body.card.imageUrl !== "string"
      ) {
        return res.status(400).json({
          error: "Card image URL must be a string",
        });
      }
      if (
        typeof req.body.card.showCount !== "undefined" &&
        typeof req.body.card.showCount !== "boolean"
      ) {
        return res.status(400).json({
          error: "Card showCount must be a boolean",
        });
      }
      if (
        req.body.card.cardMessage &&
        typeof req.body.card.cardMessage !== "string"
      ) {
        return res.status(400).json({
          error: "Card cardMessage must be a string",
        });
      }
    }

    next();
  };

  static validateUpdateWelcomeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        error: "Invalid welcome ID format",
      });
    }

    const { guildId, channelId, type } = req.body;

    if (
      guildId !== undefined &&
      (typeof guildId !== "string" || guildId.trim() === "")
    ) {
      return res.status(400).json({
        error: "Guild ID must be a string",
      });
    }

    if (
      channelId !== undefined &&
      (typeof channelId !== "string" || channelId.trim() === "")
    ) {
      return res.status(400).json({
        error: "Channel ID must be a string",
      });
    }

    if (type !== undefined && !Object.values(WelcomeType).includes(type)) {
      return res.status(400).json({
        error: "Type must be one of: message, card, dm",
      });
    }

    if (req.body.message) {
      if (
        typeof req.body.message.enabled !== "undefined" &&
        typeof req.body.message.enabled !== "boolean"
      ) {
        return res.status(400).json({
          error: "Message enabled must be a boolean",
        });
      }
      if (
        req.body.message.content &&
        typeof req.body.message.content !== "string"
      ) {
        return res.status(400).json({
          error: "Message content must be a string",
        });
      }
    }

    if (req.body.dm) {
      if (
        typeof req.body.dm.enabled !== "undefined" &&
        typeof req.body.dm.enabled !== "boolean"
      ) {
        return res.status(400).json({
          error: "DM enabled must be a boolean",
        });
      }
      if (req.body.dm.content && typeof req.body.dm.content !== "string") {
        return res.status(400).json({
          error: "DM content must be a string",
        });
      }
    }

    if (req.body.card) {
      if (
        typeof req.body.card.enabled !== "undefined" &&
        typeof req.body.card.enabled !== "boolean"
      ) {
        return res.status(400).json({
          error: "Card enabled must be a boolean",
        });
      }
      if (req.body.card.content && typeof req.body.card.content !== "string") {
        return res.status(400).json({
          error: "Card content must be a string",
        });
      }
      if (
        req.body.card.imageUrl &&
        typeof req.body.card.imageUrl !== "string"
      ) {
        return res.status(400).json({
          error: "Card image URL must be a string",
        });
      }
      if (
        typeof req.body.card.showCount !== "undefined" &&
        typeof req.body.card.showCount !== "boolean"
      ) {
        return res.status(400).json({
          error: "Card showCount must be a boolean",
        });
      }
      if (
        req.body.card.cardMessage &&
        typeof req.body.card.cardMessage !== "string"
      ) {
        return res.status(400).json({
          error: "Card cardMessage must be a string",
        });
      }
    }

    next();
  };

  static validateToggleWelcomeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        error: "Invalid welcome ID format",
      });
    }

    const { type, enabled } = req.body;

    if (!type || !["message", "dm", "card"].includes(type)) {
      return res.status(400).json({
        error: "Type must be one of: message, dm, card",
      });
    }

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        error: "Enabled must be a boolean",
      });
    }

    next();
  };

  static validateGetWelcomeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        error: "Invalid welcome ID format",
      });
    }
    next();
  };

  static validateGetGuildWelcomesMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (
      !req.params.guildId ||
      typeof req.params.guildId !== "string" ||
      req.params.guildId.trim() === ""
    ) {
      return res.status(400).json({
        error: "Guild ID is required and must be a string",
      });
    }
    next();
  };
}
