import { Request, Response } from "express";
import axios from "axios";
import { User } from "../models/UserModel";
import { Logger } from "@astra/logger";

const logger = Logger.getInstance({ title: "Guild Controller" });

const DISCORD_API_URL = "https://discord.com/api/v10";
const DISCORD_GUILDS_ENDPOINT = `${DISCORD_API_URL}/users/@me/guilds`;

const ADMINISTRATOR_PERMISSION = 0x8;

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export class GuildController {
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

      if (user.discordTokenExpires && user.discordTokenExpires < new Date()) {
        logger.warning(`Token expired for user ${user.discordId}`);
        return res.status(401).json({ error: "Discord token expired" });
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

      const sortedGuilds = adminGuilds.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return res.json({
        guilds: sortedGuilds,
        count: sortedGuilds.length,
      });
    } catch (error) {
      logger.error(`Error fetching guilds: ${error}`, { box: true });
      return res.status(500).json({ error: "Failed to fetch guilds" });
    }
  }
}
