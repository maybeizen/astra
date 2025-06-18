export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

  DISCORD_AUTH_URL:
    process.env.NEXT_PUBLIC_DISCORD_AUTH_URL ||
    "http://localhost:3001/api/auth/discord",

  CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
};
