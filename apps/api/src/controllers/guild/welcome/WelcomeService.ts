import { WelcomeModel } from "../../../models/WelcomeModel";
import { User } from "../../../models/UserModel";
import { Logger } from "@astra/logger";
import { CreateWelcomeDto, UpdateWelcomeDto } from "../../../dto/WelcomeDto";
import { GuildAccessService } from "../GuildAccessService";

const logger = Logger.getInstance({ title: "Welcome Service" });

export class WelcomeService {
  static async createWelcome(data: CreateWelcomeDto, user: any) {
    const existingWelcome = await WelcomeModel.findOne({
      guildId: data.guildId,
      channelId: data.channelId,
    });

    if (existingWelcome) {
      throw new Error(
        "Welcome configuration already exists for this guild and channel"
      );
    }

    const welcomeData = {
      ...data,
      message: data.message || { enabled: false, content: null, embed: null },
      dm: data.dm || { enabled: false, content: null, embed: null },
      card: data.card || {
        enabled: false,
        content: null,
        embed: null,
        imageUrl: null,
      },
    };

    const welcome = new WelcomeModel(welcomeData);
    await welcome.save();

    return welcome;
  }

  static async updateWelcome(id: string, data: UpdateWelcomeDto, user: any) {
    const welcome = await WelcomeModel.findById(id);
    if (!welcome) {
      throw new Error("Welcome configuration not found");
    }

    const hasAccess = await GuildAccessService.checkUserGuildAccess(
      user,
      welcome.guildId
    );
    if (!hasAccess) {
      throw new Error("Access denied to this guild");
    }

    Object.assign(welcome, data);
    welcome.updatedAt = new Date();
    await welcome.save();

    return welcome;
  }

  static async deleteWelcome(id: string, user: any): Promise<string> {
    const welcome = await WelcomeModel.findById(id);
    if (!welcome) {
      throw new Error("Welcome configuration not found");
    }

    const hasAccess = await GuildAccessService.checkUserGuildAccess(
      user,
      welcome.guildId
    );
    if (!hasAccess) {
      throw new Error("Access denied to this guild");
    }

    const guildId = welcome.guildId;
    await WelcomeModel.findByIdAndDelete(id);

    return guildId;
  }

  static async toggleWelcome(
    id: string,
    type: string,
    enabled: boolean,
    user: any
  ) {
    const welcome = await WelcomeModel.findById(id);
    if (!welcome) {
      throw new Error("Welcome configuration not found");
    }

    const hasAccess = await GuildAccessService.checkUserGuildAccess(
      user,
      welcome.guildId
    );
    if (!hasAccess) {
      throw new Error("Access denied to this guild");
    }

    if (type === "message") {
      welcome.message.enabled = enabled;
    } else if (type === "dm") {
      welcome.dm.enabled = enabled;
    } else if (type === "card") {
      welcome.card.enabled = enabled;
    }

    welcome.updatedAt = new Date();
    await welcome.save();

    return welcome;
  }

  static async getWelcomeById(id: string) {
    const welcome = await WelcomeModel.findById(id);
    if (!welcome) {
      throw new Error("Welcome configuration not found");
    }
    return welcome;
  }

  static async getWelcomesByGuildId(guildId: string) {
    return await WelcomeModel.find({ guildId }).sort({ createdAt: -1 });
  }

  static async getWelcomeByGuildAndChannel(guildId: string, channelId: string) {
    return await WelcomeModel.findOne({ guildId, channelId });
  }
}
