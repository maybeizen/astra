import "dotenv/config";
import { CommandKit } from "commandkit";
import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import Database from "./utils/database";
import { errorHandler } from "./utils/error-handler";
import { initPterodactylStatsFetching } from "./utils/pterodactyl";

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

process.on("unhandledRejection", (error: Error) => {
  errorHandler.execute(error);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  errorHandler.execute(error);
  process.exit(1);
});

client.on("error", (error: Error) => {
  errorHandler.execute(error);
});

(async () => {
  const db = new Database({ uri: process.env.MONGODB_URI! });

  try {
    console.log("Connecting to MongoDB...");
    await db.connect();
    console.log("MongoDB connection established successfully");

    console.log("Initializing Pterodactyl stats fetching...");
    await initPterodactylStatsFetching();
    console.log("Pterodactyl stats fetching initialized successfully");

    console.log("Logging in to Discord...");
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.error("Startup sequence failed:", error);
    process.exit(1);
  }
})();
