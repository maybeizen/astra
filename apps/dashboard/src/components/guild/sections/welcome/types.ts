export interface WelcomeData {
  _id?: string;
  id?: string;
  guildId: string;
  channelId: string;
  type: string;
  message: {
    enabled: boolean;
    content: string | null;
    embed: WelcomeEmbed | null;
  };
  dm: {
    enabled: boolean;
    content: string | null;
    embed: WelcomeEmbed | null;
  };
  card: {
    enabled: boolean;
    content: string | null;
    embed: WelcomeEmbed | null;
    imageUrl: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WelcomeEmbed {
  title: string | null;
  description: string | null;
  color: string | null;
  image: string | null;
}

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  owner: boolean;
  features: string[];
}
