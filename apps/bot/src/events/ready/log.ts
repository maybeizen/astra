import "dotenv/config";

import type { Client } from "discord.js";
import { ActivityType } from "discord.js";
import type { CommandKit } from "commandkit";
import cache from "../../utils/cache";
import { initPterodactylStatsFetching } from "../../utils/pterodactyl";

export default async function (
  c: Client<true>,
  client: Client<true>,
  handler: CommandKit
) {
  console.log(`${client.user.username} is online!`);
  cache.set("ready", true);

  await initPterodactylStatsFetching();

  const getStatusMessages = () => {
    const serverCount = cache.get("server_count") ?? 0;
    const userCount = cache.get("user_count") ?? 0;

    return [
      {
        text: `🖥️ ${serverCount} Servers Online`,
        type: ActivityType.Custom,
      },
      {
        text: `👥 Serving ${userCount} Users`,
        type: ActivityType.Custom,
      },
      {
        text: `🌐 netherhost.cc`,
        type: ActivityType.Custom,
      },
    ];
  };

  let index = 0;

  const updateStatus = async () => {
    const statuses = getStatusMessages();
    const { text, type } = statuses[index % statuses.length];

    client.user.setActivity(text, { type });

    index++;
  };

  await updateStatus();

  setInterval(updateStatus, 10_000);

  setInterval(() => {
    cache.cleanUp();
  }, Number(process.env.CACHE_CLEANUP_INTERVAL));
}
