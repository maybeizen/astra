export interface User {
  id: string;
  email: string;
  discordId: string;
  discordUsername: string;
  discordAvatar?: string;
  discordEmail?: string;
  discordAccessToken?: string;
  discordRefreshToken?: string;
  discordTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
}
