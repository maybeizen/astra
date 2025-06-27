import { WelcomeModel } from "./WelcomeModel";
import { User } from "../auth/UserModel";
import { Logger } from "@astra/logger";
import { GuildAccessService } from "../guild/GuildAccessService";
import { CreateWelcomeDto, UpdateWelcomeDto, WelcomeType } from "./types";

const logger = Logger.getInstance({ title: "Welcome Service" });

export class WelcomeService {
  static replaceVariables(
    content: string,
    guild: any,
    member: any,
    memberCount?: number
  ): string {
    if (!content) return content;

    return content
      .replace(/{SERVER_NAME}/g, guild?.name || "Unknown Server")
      .replace(/{USER}/g, `<@${member?.id}>`)
      .replace(/{USERNAME}/g, member?.user?.username || "Unknown User")
      .replace(
        /{DISPLAY_NAME}/g,
        member?.displayName || member?.user?.username || "Unknown User"
      )
      .replace(/{MEMBER_COUNT}/g, memberCount?.toString() || "0")
      .replace(/{USER_COUNT}/g, memberCount?.toString() || "0");
  }

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
        showCount: false,
        cardMessage: null,
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
    type: "message" | "dm" | "card",
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

  static async testVariableReplacement(
    content: string,
    guildId: string,
    userId: string
  ) {
    // Mock data for testing
    const mockGuild = { name: "Test Server" };
    const mockMember = {
      id: userId,
      user: { username: "TestUser" },
      displayName: "TestUser",
    };
    const mockMemberCount = 100;

    const replacedContent = this.replaceVariables(
      content,
      mockGuild,
      mockMember,
      mockMemberCount
    );

    return {
      original: content,
      replaced: replacedContent,
      variables: {
        "{SERVER_NAME}": mockGuild.name,
        "{USER}": `<@${userId}>`,
        "{USERNAME}": mockMember.user.username,
        "{DISPLAY_NAME}": mockMember.displayName,
        "{MEMBER_COUNT}": mockMemberCount.toString(),
        "{USER_COUNT}": mockMemberCount.toString(),
      },
    };
  }
}
