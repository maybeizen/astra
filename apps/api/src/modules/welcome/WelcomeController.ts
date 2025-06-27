import { Request, Response } from "express";
import { User } from "../auth/UserModel";
import { Logger } from "@astra/logger";
import { WelcomeService } from "./WelcomeService";
import { WelcomeCacheService } from "./WelcomeCacheService";
import { WelcomeAuthService } from "./WelcomeAuthService";
import { CreateWelcomeDto, UpdateWelcomeDto, ToggleWelcomeDto } from "./types";

const logger = Logger.getInstance({ title: "Welcome Controller" });

export class WelcomeController {
  static async getGuildWelcomes(req: Request, res: Response) {
    try {
      const user = await WelcomeAuthService.authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { guildId } = req.params;

      const hasAccess = await WelcomeAuthService.checkGuildAccess(
        user,
        guildId
      );
      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied to this guild" });
      }

      const result = await WelcomeCacheService.getCachedWelcomes(guildId);
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
      const user = await WelcomeAuthService.authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const welcome = await WelcomeService.getWelcomeById(id);

      const hasAccess = await WelcomeAuthService.checkGuildAccess(
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
      const user = await WelcomeAuthService.authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const data: CreateWelcomeDto = req.body;

      const hasAccess = await WelcomeAuthService.checkGuildAccess(
        user,
        data.guildId
      );
      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied to this guild" });
      }

      const welcome = await WelcomeService.createWelcome(data, user);
      await WelcomeCacheService.invalidateGuildCache(data.guildId);

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
      const user = await WelcomeAuthService.authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const data: UpdateWelcomeDto = req.body;

      const welcome = await WelcomeService.updateWelcome(id, data, user);
      await WelcomeCacheService.invalidateGuildCache(welcome.guildId);

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
      const user = await WelcomeAuthService.authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const guildId = await WelcomeService.deleteWelcome(id, user);
      await WelcomeCacheService.invalidateGuildCache(guildId);

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
      const user = await WelcomeAuthService.authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const { type, enabled }: ToggleWelcomeDto = req.body;

      const welcome = await WelcomeService.toggleWelcome(
        id,
        type,
        enabled,
        user
      );
      await WelcomeCacheService.invalidateGuildCache(welcome.guildId);

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

  static async testWelcomeVariables(req: Request, res: Response) {
    try {
      const { content, guildId, userId } = req.body;

      if (!content || !guildId || !userId) {
        return res.status(400).json({
          error: "Missing required fields: content, guildId, userId",
        });
      }

      const result = await WelcomeService.testVariableReplacement(
        content,
        guildId,
        userId
      );

      return res.json(result);
    } catch (error) {
      logger.error(`Error testing welcome variables: ${error}`, { box: true });
      return res.status(500).json({ error: "Failed to test variables" });
    }
  }
}
