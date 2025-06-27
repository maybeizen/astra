import { Request } from "express";
import { User } from "../auth/UserModel";
import { GuildAccessService } from "../guild/GuildAccessService";
import { Document } from "mongoose";

export class WelcomeAuthService {
  static async authenticateUser(req: Request): Promise<Document | null> {
    if (!req.isAuthenticated() || !req.user) {
      return null;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return null;
    }

    return user;
  }

  static async checkGuildAccess(
    user: Document,
    guildId: string
  ): Promise<boolean> {
    try {
      return await GuildAccessService.checkUserGuildAccess(user, guildId);
    } catch (error) {
      return false;
    }
  }
}
