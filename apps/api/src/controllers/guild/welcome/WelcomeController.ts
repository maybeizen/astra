import { Request, Response } from "express";
import { WelcomeModel } from "../../../models/WelcomeModel";
import { User } from "../../../models/UserModel";
import { Logger } from "@astra/logger";
import { WelcomeValidation } from "../../../dto/WelcomeDto";
import { CreateWelcomeDto, UpdateWelcomeDto } from "../../../dto/WelcomeDto";
import { WelcomeService } from "./WelcomeService";
import { GuildAccessService } from "../GuildAccessService";
import redis from "../../../utils/Cache";

const logger = Logger.getInstance({ title: "Welcome Controller" });
const CACHE_TTL = 60 * 5; // 5 minutes cache

export class WelcomeController {
  static async getGuildWelcomes(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { guildId } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const hasAccess = await GuildAccessService.checkUserGuildAccess(
        user,
        guildId
      );
      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied to this guild" });
      }

      const cacheKey = `welcomes:${guildId}`;
      const cachedWelcomes = await redis.get(cacheKey);

      if (cachedWelcomes) {
        logger.info(`Cache hit for guild welcomes: ${guildId}`);
        return res.json(JSON.parse(cachedWelcomes));
      }

      const welcomes = await WelcomeModel.find({ guildId }).sort({
        createdAt: -1,
      });

      const result = {
        welcomes,
        count: welcomes.length,
      };

      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      logger.info(
        `Cached welcomes for guild ${guildId} for ${CACHE_TTL} seconds`
      );

      return res.json(result);
    } catch (error) {
      logger.error(`Error fetching guild welcomes: ${error}`, { box: true });
      return res
        .status(500)
        .json({ error: "Failed to fetch welcome configurations" });
    }
  }

  static async getWelcome(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const welcome = await WelcomeModel.findById(id);
      if (!welcome) {
        return res
          .status(404)
          .json({ error: "Welcome configuration not found" });
      }

      const hasAccess = await GuildAccessService.checkUserGuildAccess(
        user,
        welcome.guildId
      );
      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied to this guild" });
      }

      return res.json(welcome);
    } catch (error) {
      logger.error(`Error fetching welcome: ${error}`, { box: true });
      return res
        .status(500)
        .json({ error: "Failed to fetch welcome configuration" });
    }
  }

  static async createWelcome(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const data: CreateWelcomeDto = req.body;

      const validation = WelcomeValidation.validateCreateWelcome(data);
      if (!validation.isValid) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const hasAccess = await GuildAccessService.checkUserGuildAccess(
        user,
        data.guildId
      );
      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied to this guild" });
      }

      const welcome = await WelcomeService.createWelcome(data, user);
      await redis.del(`welcomes:${data.guildId}`);

      logger.info(
        `Created welcome configuration for guild ${data.guildId} by user ${user.discordId}`
      );
      return res.status(201).json(welcome);
    } catch (error) {
      logger.error(`Error creating welcome: ${error}`, { box: true });
      return res
        .status(500)
        .json({ error: "Failed to create welcome configuration" });
    }
  }

  static async updateWelcome(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const data: UpdateWelcomeDto = req.body;

      const validation = WelcomeValidation.validateUpdateWelcome(data);
      if (!validation.isValid) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const welcome = await WelcomeService.updateWelcome(id, data, user);
      await redis.del(`welcomes:${welcome.guildId}`);

      logger.info(
        `Updated welcome configuration ${id} by user ${user.discordId}`
      );
      return res.json(welcome);
    } catch (error) {
      logger.error(`Error updating welcome: ${error}`, { box: true });
      return res
        .status(500)
        .json({ error: "Failed to update welcome configuration" });
    }
  }

  static async deleteWelcome(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const guildId = await WelcomeService.deleteWelcome(id, user);
      await redis.del(`welcomes:${guildId}`);

      logger.info(
        `Deleted welcome configuration ${id} by user ${user.discordId}`
      );
      return res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting welcome: ${error}`, { box: true });
      return res
        .status(500)
        .json({ error: "Failed to delete welcome configuration" });
    }
  }

  static async toggleWelcome(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const { type, enabled } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (!type || !["message", "dm", "card"].includes(type)) {
        return res
          .status(400)
          .json({ error: "Invalid type. Must be 'message', 'dm', or 'card'" });
      }

      if (typeof enabled !== "boolean") {
        return res.status(400).json({ error: "Enabled must be a boolean" });
      }

      const welcome = await WelcomeService.toggleWelcome(
        id,
        type,
        enabled,
        user
      );
      await redis.del(`welcomes:${welcome.guildId}`);

      logger.info(
        `Toggled ${type} welcome for configuration ${id} to ${enabled} by user ${user.discordId}`
      );
      return res.json(welcome);
    } catch (error) {
      logger.error(`Error toggling welcome: ${error}`, { box: true });
      return res
        .status(500)
        .json({ error: "Failed to toggle welcome feature" });
    }
  }
}
