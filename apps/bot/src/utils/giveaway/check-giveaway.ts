import { Client } from "discord.js";
import Giveaway from "../../models/Giveaway";
import { errorHandler } from "../error-handler";
import EndGiveaway from "./end-giveaway";

class CheckGiveaway {
  private endGiveaway: EndGiveaway;

  constructor() {
    this.endGiveaway = new EndGiveaway();
  }

  public async execute(client: Client): Promise<number> {
    try {
      const now = Date.now();

      const endedGiveaways = await Giveaway.find({
        ended: false,
        endTime: { $lte: now },
      });

      if (!endedGiveaways || endedGiveaways.length === 0) {
        return 0;
      }

      console.log(`Found ${endedGiveaways.length} giveaways to end.`);

      let endedCount = 0;
      for (const giveaway of endedGiveaways) {
        const result = await this.endGiveaway.execute(giveaway.id, client);

        if (result.success) {
          endedCount++;
          console.log(`Successfully ended giveaway #${giveaway.id}`);

          if (result.winners && result.winners.length) {
            console.log(`Winners: ${result.winners.join(", ")}`);
          } else {
            console.log(
              "No winners selected due to insufficient participants."
            );
          }
        } else {
          console.error(
            `Failed to end giveaway #${giveaway.id}: ${result.error}`
          );
          errorHandler.execute(
            new Error(`Failed to end giveaway #${giveaway.id}: ${result.error}`)
          );
        }
      }

      return endedCount;
    } catch (error: any) {
      console.error("Error checking giveaways:", error);
      console.error(error.stack);
      errorHandler.execute(error);
      return 0;
    }
  }

  public async checkById(giveawayId: number, client: Client): Promise<boolean> {
    try {
      const giveaway = await Giveaway.findOne({ id: giveawayId });

      if (!giveaway) {
        console.log(`Giveaway #${giveawayId} not found.`);
        return false;
      }

      if (giveaway.ended) {
        console.log(`Giveaway #${giveawayId} already ended.`);
        return false;
      }

      const now = Date.now();
      if (giveaway.endTime > now) {
        console.log(`Giveaway #${giveawayId} has not ended yet.`);
        console.log(
          `Time remaining: ${Math.floor(
            (giveaway.endTime - now) / 1000
          )} seconds.`
        );
        return false;
      }

      const result = await this.endGiveaway.execute(giveaway.id, client);
      return result.success;
    } catch (error: any) {
      console.error(`Error checking giveaway #${giveawayId}:`, error);
      console.error(error.stack);
      errorHandler.execute(error);
      return false;
    }
  }
}

export default CheckGiveaway;
