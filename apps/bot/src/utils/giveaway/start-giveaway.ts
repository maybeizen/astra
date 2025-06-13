import Giveaway from "../../models/Giveaway";
import GiveawaySettings from "../../models/GiveawaySettings";

class StartGiveaway {
  constructor() {}

  public async execute(
    prize: string,
    duration: number,
    winners: number,
    requiredRole: { id: string } | null,
    pingRole: { id: string } | null,
    messageId: string,
    channelId: string
  ): Promise<{ id: number } | null> {
    try {
      let settings = await GiveawaySettings.findOne();
      if (!settings) {
        settings = new GiveawaySettings({
          totalGiveaways: 0,
        });
      }

      settings.totalGiveaways += 1;
      await settings.save();

      const giveaway = new Giveaway({
        id: settings.totalGiveaways,
        prize,
        duration,
        messageId,
        channelId,
        winnerCount: winners,
        requiredRole: requiredRole ? requiredRole.id : null,
        pingRole: pingRole ? pingRole.id : null,
        startTime: Date.now(),
        endTime: Date.now() + duration * 1000,
        participants: [],
        winners: [],
        ended: false,
      });

      await giveaway.save();

      return { id: giveaway.id };
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      return null;
    }
  }
}

export default StartGiveaway;
