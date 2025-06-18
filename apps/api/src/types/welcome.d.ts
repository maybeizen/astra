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

export interface Welcome {
  guildId: string;
  channelId: string;
  type: WelcomeType;
  message: WelcomeContent;
  dm: WelcomeContent;
  card: WelcomeContent & {
    imageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
