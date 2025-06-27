export enum WelcomeType {
  MESSAGE = "message",
  CARD = "card",
  DM = "dm",
}

export interface Embed {
  title?: string;
  description?: string;
  image?: string;
  color?: string;
}

export interface WelcomeContent {
  enabled: boolean;
  content: string | null;
  embed: Embed | null;
}

export interface WelcomeCardContent extends WelcomeContent {
  imageUrl?: string;
  showCount: boolean;
  cardMessage: string | null;
}

export interface Welcome {
  _id?: string;
  guildId: string;
  channelId: string;
  type: WelcomeType;
  message: WelcomeContent;
  dm: WelcomeContent;
  card: WelcomeCardContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWelcomeDto {
  guildId: string;
  channelId: string;
  type: WelcomeType;
  message?: WelcomeContent;
  dm?: WelcomeContent;
  card?: WelcomeCardContent;
}

export interface UpdateWelcomeDto {
  guildId?: string;
  channelId?: string;
  type?: WelcomeType;
  message?: WelcomeContent;
  dm?: WelcomeContent;
  card?: WelcomeCardContent;
}

export interface ToggleWelcomeDto {
  type: "message" | "dm" | "card";
  enabled: boolean;
}

export interface WelcomeQueryDto {
  guildId?: string;
  channelId?: string;
  type?: WelcomeType;
}
