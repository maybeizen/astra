import type { Client } from "discord.js";
import type { CommandKit } from "commandkit";
import Giveaway from "../../utils/giveaway";

export default async function (
  c: Client<true>,
  client: Client<true>,
  handler: CommandKit
) {
  const giveawayManager = new Giveaway();

  const endedCount = await giveawayManager.check().execute(client);

  if (endedCount > 0) {
    console.log(`Ended ${endedCount} giveaways on startup.`);
  }

  setInterval(async () => {
    try {
      const count = await giveawayManager.check().execute(client);
      if (count > 0) {
        console.log(`Ended ${count} giveaways.`);
      }
    } catch (error) {
      console.error("Error in giveaway check interval:", error);
    }
  }, 30 * 1000); // Check every 30 seconds
}
