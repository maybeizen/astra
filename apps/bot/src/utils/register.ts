import User from "../models/User";
import {
  User as DiscordUser,
  Client,
  Collection,
  GuildMember,
} from "discord.js";
import { errorHandler } from "./error-handler";

export async function registerUser(user: DiscordUser) {
  try {
    const existingUser = await User.findOne({ userId: user.id });

    if (existingUser) return;

    const newUser = new User({
      userId: user.id,
      isStaff: false,
      timestamps: {
        joinedAt: Date.now(),
      },
    });

    await newUser.save();

    console.log(`Registered user ${user.id}`);
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
    errorHandler.execute(error);
  }
}

export async function bulkRegisterUsers(client: Client, guildId: string) {
  try {
    console.log("Starting bulk user registration...");
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      console.error(`Guild with ID ${guildId} not found!`);
      return;
    }

    const CHUNK_SIZE = 1000;
    let allMembers: GuildMember[] = [];
    let lastId: string | undefined = undefined;

    console.log(`Fetching members from guild ${guild.name} (${guild.id})...`);

    while (true) {
      const options: { limit: number; after?: string } = { limit: CHUNK_SIZE };
      if (lastId) {
        options.after = lastId;
      }

      const members = await guild.members.list(options);
      if (members.size === 0) break;

      allMembers = [...allMembers, ...Array.from(members.values())];
      console.log(`Fetched ${allMembers.length} members so far...`);

      lastId = members.lastKey();
      if (members.size < CHUNK_SIZE) break;
    }

    const existingUserIds = new Set(
      (await User.find({}, { userId: 1 })).map((user) => user.userId)
    );

    const newUsers = allMembers.filter(
      (member) => !existingUserIds.has(member.user.id) && !member.user.bot
    );

    console.log(
      `Found ${newUsers.length} new users to register (excluding bots)...`
    );

    if (newUsers.length === 0) {
      console.log("No new users to register.");
      return;
    }

    const userDocs = newUsers.map((member) => ({
      userId: member.user.id,
      isStaff: false,
      timestamps: {
        joinedAt: Date.now(),
      },
    }));

    const BATCH_SIZE = 500;
    for (let i = 0; i < userDocs.length; i += BATCH_SIZE) {
      const batch = userDocs.slice(i, i + BATCH_SIZE);
      await User.insertMany(batch);
      console.log(
        `Registered batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          userDocs.length / BATCH_SIZE
        )}`
      );
    }

    console.log(`Successfully registered ${newUsers.length} users!`);

    return newUsers;
  } catch (error: any) {
    console.error("Error during bulk registration:", error);
    console.error(error.stack);
    errorHandler.execute(error);
  }
}
