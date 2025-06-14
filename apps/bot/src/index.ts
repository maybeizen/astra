import "dotenv/config";
import { CommandKit } from "commandkit";
import { Client, GatewayIntentBits } from "discord.js";
import Database from "./utils/database";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
  ],
  allowedMentions: {
    parse: [],
    roles: [],
    repliedUser: true,
  },
});

new CommandKit({
  client,
  bulkRegister: true,
  commandsPath: `${__dirname}/commands`,
  eventsPath: `${__dirname}/events`,
});

(async () => {
  const db = new Database({ uri: process.env.MONGODB_URI! });

  try {
    console.log("Connecting to MongoDB...");
    await db.connect();
    console.log("MongoDB connection established successfully");

    console.log("Logging in to Discord...");
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.error("Startup sequence failed:", error);
    process.exit(1);
  }
})();
