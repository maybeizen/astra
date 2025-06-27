import "dotenv/config";
import { Request, Response } from "express";
import passport from "passport";
import {
  Strategy as DiscordStrategy,
  Profile as DiscordProfile,
} from "passport-discord";
import { User } from "./UserModel";
import { Logger } from "@astra/logger";

const logger = Logger.getInstance({ title: "Discord Auth" });

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const DISCORD_CALLBACK_URL =
  process.env.DISCORD_CALLBACK_URL ||
  "http://localhost:3001/api/auth/discord/callback";

const DISCORD_SCOPES = ["identify", "email"];

export class DiscordController {
  static initialize() {
    passport.use(
      new DiscordStrategy(
        {
          clientID: DISCORD_CLIENT_ID,
          clientSecret: DISCORD_CLIENT_SECRET,
          callbackURL: DISCORD_CALLBACK_URL,
          scope: DISCORD_SCOPES,
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: DiscordProfile,
          done: (error: any, user?: any) => void
        ) => {
          try {
            let user = await User.findOne({ discordId: profile.id });

            if (!user) {
              user = await User.create({
                discordId: profile.id,
                email: profile.email || `${profile.id}@discord.user`,
                discordUsername: profile.username,
                discordAvatar: profile.avatar || undefined,
                discordEmail: profile.email,
                discordAccessToken: accessToken,
                discordRefreshToken: refreshToken,
                discordTokenExpires: new Date(Date.now() + 604800000), // 7 days
              });
              logger.info(
                `Created new user via Discord: ${profile.username} (${profile.id})`
              );
            } else {
              user.discordUsername = profile.username;
              user.discordAvatar = profile.avatar || undefined;
              user.discordEmail = profile.email;
              user.discordAccessToken = accessToken;
              user.discordRefreshToken = refreshToken;
              user.discordTokenExpires = new Date(Date.now() + 604800000); // 7 days
              await user.save();
              logger.info(
                `Updated existing user via Discord: ${profile.username} (${profile.id})`
              );
            }

            return done(null, user);
          } catch (error) {
            logger.error(`Discord authentication error: ${error}`, {
              box: true,
            });
            return done(error as Error);
          }
        }
      )
    );

    passport.serializeUser(
      (user: Express.User, done: (err: any, id?: any) => void) => {
        done(null, user.id);
      }
    );

    passport.deserializeUser(
      async (id: string, done: (err: any, user?: any) => void) => {
        try {
          const user = await User.findById(id);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    );
  }

  static async login(req: Request, res: Response) {
    passport.authenticate("discord")(req, res);
  }

  static async callback(req: Request, res: Response) {
    passport.authenticate("discord", {
      successRedirect: process.env.CLIENT_SUCCESS_REDIRECT || "/",
      failureRedirect: process.env.CLIENT_FAILURE_REDIRECT || "/login",
    })(req, res);
  }

  static async getCurrentUser(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    return res.json({ user: req.user });
  }

  static async logout(req: Request, res: Response) {
    req.logout((err: Error | null) => {
      if (err) {
        logger.error(`Error during logout: ${err}`, { box: true });
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  }
}
