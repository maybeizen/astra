import { Request, Response } from "express";
import axios from "axios";
import { User } from "../models/UserModel";
import { Logger } from "@astra/logger";
import redis from "../utils/Cache";

const logger = Logger.getInstance({ title: "Guild Controller" });

const DISCORD_API_URL = "https://discord.com/api/v10";
const DISCORD_GUILDS_ENDPOINT = `${DISCORD_API_URL}/users/@me/guilds`;
const DISCORD_TOKEN_ENDPOINT = `${DISCORD_API_URL}/oauth2/token`;
const DISCORD_GUILD_ENDPOINT = `${DISCORD_API_URL}/guilds`;

const ADMINISTRATOR_PERMISSION = 0x8;
const CACHE_TTL = 60 * 5; // 5 minutes cache

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface DetailedGuildData {
  id: string;
  name: string;
  icon: string | null;
  features: string[];
  owner_id: string;
  approximate_member_count?: number;
  roles: any[];
  channels?: any[];
}

export class GuildController {
  static async refreshToken(user: any): Promise<boolean> {
    try {
      if (!user.discordRefreshToken) {
        return false;
      }

      const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: user.discordRefreshToken,
      });

      const response = await axios.post(DISCORD_TOKEN_ENDPOINT, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data.access_token) {
        user.discordAccessToken = response.data.access_token;
        if (response.data.refresh_token) {
          user.discordRefreshToken = response.data.refresh_token;
        }
        user.discordTokenExpires = new Date(
          Date.now() + response.data.expires_in * 1000
        );
        await user.save();
        logger.info(`Refreshed token for user ${user.discordId}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Failed to refresh token: ${error}`, { box: true });
      return false;
    }
  }

  static async getUserGuilds(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await User.findById(req.user.id);
      if (!user || !user.discordAccessToken) {
        return res
          .status(401)
          .json({ error: "Discord authentication required" });
      }

      const shouldRefresh = req.query.refresh === "true";
      const cacheKey = `guilds:${user.discordId}`;
      const cachedGuilds = !shouldRefresh ? await redis.get(cacheKey) : null;

      if (cachedGuilds) {
        logger.info(`Cache hit for user guilds: ${user.discordId}`);
        return res.json(JSON.parse(cachedGuilds));
      }

      if (shouldRefresh) {
        logger.info(`Force refreshing guilds for user: ${user.discordId}`);
      }

      if (user.discordTokenExpires && user.discordTokenExpires < new Date()) {
        logger.warning(
          `Token expired for user ${user.discordId}, attempting refresh`
        );
        const refreshed = await this.refreshToken(user);

        if (!refreshed) {
          return res
            .status(401)
            .json({ error: "Discord token expired and refresh failed" });
        }
      }

      const response = await axios.get<DiscordGuild[]>(
        DISCORD_GUILDS_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${user.discordAccessToken}`,
          },
        }
      );

      const adminGuilds = response.data.filter((guild) => {
        const permissions = BigInt(guild.permissions);
        return (
          (permissions & BigInt(ADMINISTRATOR_PERMISSION)) ===
          BigInt(ADMINISTRATOR_PERMISSION)
        );
      });

      const botToken = process.env.DISCORD_BOT_TOKEN;
      if (!botToken) {
        logger.error("Bot token not configured");
        return res.status(500).json({ error: "Bot token not configured" });
      }

      let botGuilds: string[] = [];
      try {
        const botGuildsResponse = await axios.get<DiscordGuild[]>(
          `${DISCORD_API_URL}/users/@me/guilds`,
          {
            headers: {
              Authorization: `Bot ${botToken}`,
            },
          }
        );
        botGuilds = botGuildsResponse.data.map((guild) => guild.id);
      } catch (error) {
        logger.error(`Failed to fetch bot guilds: ${error}`, { box: true });
      }

      const guildsWithBotStatus = adminGuilds.map((guild) => ({
        ...guild,
        in_server: botGuilds.includes(guild.id),
      }));

      const sortedGuilds = guildsWithBotStatus.sort((a, b) => {
        if (a.in_server && !b.in_server) return -1;
        if (!a.in_server && b.in_server) return 1;

        return a.name.localeCompare(b.name);
      });

      const result = {
        guilds: sortedGuilds,
        count: sortedGuilds.length,
      };

      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      logger.info(
        `Cached guilds for user ${user.discordId} for ${CACHE_TTL} seconds`
      );

      return res.json(result);
    } catch (error) {
      logger.error(`Error fetching guilds: ${error}`, { box: true });
      return res.status(500).json({ error: "Failed to fetch guilds" });
    }
  }

  static async getGuild(req: Request, res: Response) {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { id } = req.params;
      const user = await User.findById(req.user.id);

      if (!user || !user.discordAccessToken) {
        return res
          .status(401)
          .json({ error: "Discord authentication required" });
      }

      if (user.discordTokenExpires && user.discordTokenExpires < new Date()) {
        logger.warning(
          `Token expired for user ${user.discordId}, attempting refresh`
        );
        const refreshed = await this.refreshToken(user);

        if (!refreshed) {
          return res
            .status(401)
            .json({ error: "Discord token expired and refresh failed" });
        }
      }

      const cacheKey = `guild:${id}`;
      const cachedGuild = await redis.get(cacheKey);

      if (cachedGuild) {
        logger.info(`Cache hit for guild: ${id}`);
        return res.json(JSON.parse(cachedGuild));
      }

      const userGuildsResponse = await axios.get<DiscordGuild[]>(
        DISCORD_GUILDS_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${user.discordAccessToken}`,
          },
        }
      );

      const userGuild = userGuildsResponse.data.find((g) => g.id === id);

      if (!userGuild) {
        return res
          .status(404)
          .json({ error: "Guild not found or you don't have access" });
      }

      const permissions = BigInt(userGuild.permissions);
      const hasAdminPermission =
        (permissions & BigInt(ADMINISTRATOR_PERMISSION)) ===
        BigInt(ADMINISTRATOR_PERMISSION);

      if (!hasAdminPermission) {
        return res.status(403).json({
          error: "You don't have administrator permissions for this guild",
        });
      }

      try {
        const botToken = process.env.DISCORD_BOT_TOKEN;
        if (!botToken) {
          throw new Error("Bot token not configured");
        }

        const guildResponse = await axios.get<DetailedGuildData>(
          `${DISCORD_GUILD_ENDPOINT}/${id}?with_counts=true`,
          {
            headers: {
              Authorization: `Bot ${botToken}`,
            },
          }
        );

        const guildData = guildResponse.data;

        const formattedGuild = {
          id: guildData.id,
          name: guildData.name,
          icon: guildData.icon,
          features: guildData.features,
          memberCount: guildData.approximate_member_count || 0,
          owner: userGuild.owner,
          in_server: true,
          roles: guildData.roles
            .map((role) => ({
              id: role.id,
              name: role.name,
              color: role.color,
              position: role.position,
            }))
            .sort((a, b) => b.position - a.position),
        };

        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(formattedGuild));
        logger.info(`Cached guild ${id} for ${CACHE_TTL} seconds`);

        return res.json(formattedGuild);
      } catch (error) {
        logger.error(
          `Error fetching guild details from Discord API: ${error}`,
          { box: true }
        );

        const basicGuild = {
          id: userGuild.id,
          name: userGuild.name,
          icon: userGuild.icon,
          features: userGuild.features,
          owner: userGuild.owner,
          memberCount: 0,
          in_server: false,
        };

        return res.json(basicGuild);
      }
    } catch (error) {
      logger.error(`Error fetching guild: ${error}`, { box: true });
      return res.status(500).json({ error: "Failed to fetch guild details" });
    }
  }
}
