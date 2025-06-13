import Giveaway from "../../models/Giveaway";
import { GiveawayDocument } from "../../models/Giveaway";
import { errorHandler } from "../error-handler";
import cache from "../cache";

class GetGiveawayInfo {
  constructor() {}

  public async execute(giveawayId: number): Promise<GiveawayDocument | null> {
    try {
      const cacheKey = `giveaway_${giveawayId}`;
      let giveaway = cache.get(cacheKey);

      if (!giveaway) {
        giveaway = await Giveaway.findOne({ id: giveawayId });
        if (giveaway) {
          cache.set(cacheKey, giveaway, 120000);
        }
      }

      if (!giveaway) {
        console.log(`Giveaway ${giveawayId} not found.`);
        errorHandler.execute(new Error(`Giveaway ${giveawayId} not found.`));
        return null;
      }

      return giveaway;
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
      return null;
    }
  }

  public async getByMessageId(
    messageId: string
  ): Promise<GiveawayDocument | null> {
    try {
      const giveaway = await Giveaway.findOne({ messageId });

      if (!giveaway) {
        console.log(`Giveaway with message ID ${messageId} not found.`);
        errorHandler.execute(
          new Error(`Giveaway with message ID ${messageId} not found.`)
        );
        return null;
      }

      return giveaway;
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
      return null;
    }
  }

  async active() {
    const cacheKey = "active_giveaways";
    let activeGiveaways = cache.get(cacheKey);

    if (!activeGiveaways) {
      activeGiveaways = await Giveaway.find({ isActive: true });
      cache.set(cacheKey, activeGiveaways, 120000);
    }

    return activeGiveaways;
  }
}

export default GetGiveawayInfo;
