import { WelcomeType } from "../types";

export interface EmbedDto {
  title?: string;
  description?: string;
  image?: string;
  color?: string;
}

export interface WelcomeContentDto {
  enabled: boolean;
  content?: string | null;
  embed?: EmbedDto | null;
}

export interface WelcomeCardDto extends WelcomeContentDto {
  imageUrl?: string;
}

export interface CreateWelcomeDto {
  guildId: string;
  channelId: string;
  type: WelcomeType;
  message?: WelcomeContentDto;
  dm?: WelcomeContentDto;
  card?: WelcomeCardDto;
}

export interface UpdateWelcomeDto {
  channelId?: string;
  type?: WelcomeType;
  message?: WelcomeContentDto;
  dm?: WelcomeContentDto;
  card?: WelcomeCardDto;
}

export interface WelcomeQueryDto {
  guildId?: string;
  channelId?: string;
  type?: WelcomeType;
}

export class WelcomeValidation {
  static validateEmbed(embed: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (
      embed.title !== undefined &&
      (typeof embed.title !== "string" || embed.title.trim() === "")
    ) {
      errors.push("Title cannot be empty if provided");
    }

    if (
      embed.description !== undefined &&
      (typeof embed.description !== "string" || embed.description.trim() === "")
    ) {
      errors.push("Description cannot be empty if provided");
    }

    if (embed.image !== undefined && embed.image !== null) {
      try {
        new URL(embed.image);
      } catch {
        errors.push("Image must be a valid URL");
      }
    }

    if (embed.color !== undefined && embed.color !== null) {
      if (!/^#[0-9A-F]{6}$/i.test(embed.color)) {
        errors.push("Color must be a valid hex color");
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateWelcomeContent(content: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (typeof content.enabled !== "boolean") {
      errors.push("Enabled must be a boolean");
    }

    if (
      content.content !== undefined &&
      content.content !== null &&
      typeof content.content !== "string"
    ) {
      errors.push("Content must be a string");
    }

    if (content.embed !== undefined && content.embed !== null) {
      const embedValidation = this.validateEmbed(content.embed);
      errors.push(...embedValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateCreateWelcome(data: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (
      !data.guildId ||
      typeof data.guildId !== "string" ||
      data.guildId.trim() === ""
    ) {
      errors.push("Guild ID is required");
    }

    if (
      !data.channelId ||
      typeof data.channelId !== "string" ||
      data.channelId.trim() === ""
    ) {
      errors.push("Channel ID is required");
    }

    if (!data.type || !Object.values(WelcomeType).includes(data.type)) {
      errors.push("Type must be a valid welcome type");
    }

    if (data.message) {
      const messageValidation = this.validateWelcomeContent(data.message);
      errors.push(...messageValidation.errors);
    }

    if (data.dm) {
      const dmValidation = this.validateWelcomeContent(data.dm);
      errors.push(...dmValidation.errors);
    }

    if (data.card) {
      const cardValidation = this.validateWelcomeContent(data.card);
      if (data.card.imageUrl !== undefined && data.card.imageUrl !== null) {
        try {
          new URL(data.card.imageUrl);
        } catch {
          errors.push("Card image URL must be a valid URL");
        }
      }
      errors.push(...cardValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateUpdateWelcome(data: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (
      data.channelId !== undefined &&
      (typeof data.channelId !== "string" || data.channelId.trim() === "")
    ) {
      errors.push("Channel ID cannot be empty if provided");
    }

    if (
      data.type !== undefined &&
      !Object.values(WelcomeType).includes(data.type)
    ) {
      errors.push("Type must be a valid welcome type");
    }

    if (data.message) {
      const messageValidation = this.validateWelcomeContent(data.message);
      errors.push(...messageValidation.errors);
    }

    if (data.dm) {
      const dmValidation = this.validateWelcomeContent(data.dm);
      errors.push(...dmValidation.errors);
    }

    if (data.card) {
      const cardValidation = this.validateWelcomeContent(data.card);
      if (data.card.imageUrl !== undefined && data.card.imageUrl !== null) {
        try {
          new URL(data.card.imageUrl);
        } catch {
          errors.push("Card image URL must be a valid URL");
        }
      }
      errors.push(...cardValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }
}
