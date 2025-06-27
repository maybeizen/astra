import axios from "axios";
import { Logger } from "@astra/logger";
import { User } from "../auth/UserModel";
import redis from "../../utils/Cache";

const logger = Logger.getInstance({ title: "Guild Access Service" });

const DISCORD_API_URL = "https://discord.com/api/v10";
const DISCORD_GUILDS_ENDPOINT = `${DISCORD_API_URL}/users/@me/guilds`;
const DISCORD_GUILD_ENDPOINT = `${DISCORD_API_URL}/guilds`;

const ADMINISTRATOR_PERMISSION = 0x8;
const MANAGE_GUILD_PERMISSION = 0x20;
const CACHE_TTL = 60 * 10; // 10 minutes cache

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface GuildAccessResult {
  hasAccess: boolean;
  reason?: string;
  permissions?: string[];
  isOwner?: boolean;
  botPresent?: boolean;
}

export class GuildAccessService {
  static async checkUserGuildAccess(
    user: any,
    guildId: string
  ): Promise<boolean> {
    try {
      const result = await this.getDetailedGuildAccess(user, guildId);
      return result.hasAccess;
    } catch (error) {
      logger.error(`Error checking guild access: ${error}`, { box: true });
      return false;
    }
  }

  static async getDetailedGuildAccess(
    user: any,
    guildId: string
  ): Promise<GuildAccessResult> {
    try {
      // Check if user has Discord authentication
      if (!user.discordAccessToken || !user.discordId) {
        return {
          hasAccess: false,
          reason: "Discord authentication required",
        };
      }

      // Check cache first
      const cacheKey = `guild_access:${user.discordId}:${guildId}`;
      const cachedResult = await redis.get(cacheKey);

      if (cachedResult) {
        logger.debug(
          `Cache hit for guild access: ${user.discordId}:${guildId}`
        );
        return JSON.parse(cachedResult);
      }

      // Check if token is expired and refresh if needed
      if (user.discordTokenExpires && user.discordTokenExpires < new Date()) {
        logger.warning(
          `Token expired for user ${user.discordId}, attempting refresh`
        );
        const refreshed = await this.refreshUserToken(user);

        if (!refreshed) {
          return {
            hasAccess: false,
            reason: "Discord token expired and refresh failed",
          };
        }
      }

      // Fetch user's guilds from Discord
      const userGuilds = await this.fetchUserGuilds(user.discordAccessToken);
      const targetGuild = userGuilds.find((guild) => guild.id === guildId);

      if (!targetGuild) {
        return {
          hasAccess: false,
          reason: "User is not a member of this guild",
        };
      }

      // Check permissions
      const permissions = BigInt(targetGuild.permissions);
      const hasAdminPermission =
        (permissions & BigInt(ADMINISTRATOR_PERMISSION)) ===
        BigInt(ADMINISTRATOR_PERMISSION);
      const hasManageGuildPermission =
        (permissions & BigInt(MANAGE_GUILD_PERMISSION)) ===
        BigInt(MANAGE_GUILD_PERMISSION);

      if (
        !hasAdminPermission &&
        !hasManageGuildPermission &&
        !targetGuild.owner
      ) {
        return {
          hasAccess: false,
          reason:
            "Insufficient permissions (requires Administrator, Manage Guild, or Owner)",
          permissions: [targetGuild.permissions],
          isOwner: targetGuild.owner,
        };
      }

      // Check if bot is present in the guild
      const botPresent = await this.checkBotPresence(guildId);

      if (!botPresent) {
        return {
          hasAccess: false,
          reason: "Bot is not present in this guild",
          permissions: [targetGuild.permissions],
          isOwner: targetGuild.owner,
          botPresent: false,
        };
      }

      const result: GuildAccessResult = {
        hasAccess: true,
        permissions: [targetGuild.permissions],
        isOwner: targetGuild.owner,
        botPresent: true,
      };

      // Cache the result
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

      return result;
    } catch (error) {
      logger.error(`Error getting detailed guild access: ${error}`, {
        box: true,
      });
      return {
        hasAccess: false,
        reason: "Error checking guild access",
      };
    }
  }

  private static async fetchUserGuilds(
    accessToken: string
  ): Promise<DiscordGuild[]> {
    try {
      const response = await axios.get<DiscordGuild[]>(
        DISCORD_GUILDS_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch user guilds: ${error}`, { box: true });
      throw new Error("Failed to fetch user guilds from Discord");
    }
  }

  private static async checkBotPresence(guildId: string): Promise<boolean> {
    try {
      const botToken = process.env.DISCORD_BOT_TOKEN;
      if (!botToken) {
        logger.error("Bot token not configured");
        return false;
      }

      const response = await axios.get(`${DISCORD_GUILD_ENDPOINT}/${guildId}`, {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      });

      return response.status === 200;
    } catch (error) {
      logger.debug(`Bot not present in guild ${guildId}: ${error}`);
      return false;
    }
  }

  private static async refreshUserToken(user: any): Promise<boolean> {
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

      const response = await axios.post(
        `${DISCORD_API_URL}/oauth2/token`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

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

  static async getUserGuildsWithAccess(user: any): Promise<DiscordGuild[]> {
    try {
      if (!user.discordAccessToken) {
        return [];
      }

      const userGuilds = await this.fetchUserGuilds(user.discordAccessToken);

      // Filter guilds where user has admin permissions
      const adminGuilds = userGuilds.filter((guild) => {
        const permissions = BigInt(guild.permissions);
        return (
          (permissions & BigInt(ADMINISTRATOR_PERMISSION)) ===
            BigInt(ADMINISTRATOR_PERMISSION) ||
          (permissions & BigInt(MANAGE_GUILD_PERMISSION)) ===
            BigInt(MANAGE_GUILD_PERMISSION) ||
          guild.owner
        );
      });

      return adminGuilds;
    } catch (error) {
      logger.error(`Error getting user guilds with access: ${error}`, {
        box: true,
      });
      return [];
    }
  }

  static async clearUserGuildAccessCache(userId: string, guildId?: string) {
    try {
      if (guildId) {
        await redis.del(`guild_access:${userId}:${guildId}`);
      } else {
        // Clear all guild access cache for this user
        const pattern = `guild_access:${userId}:*`;
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } catch (error) {
      logger.error(`Error clearing guild access cache: ${error}`, {
        box: true,
      });
    }
  }
}
