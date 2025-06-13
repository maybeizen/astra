import { Client, TextChannel } from "discord.js";
import Giveaway from "../../models/Giveaway";
import { errorHandler } from "../error-handler";

class RerollGiveaway {
  constructor() {}

  private getRandomWinners(
    participants: string[],
    excludeIds: string[],
    count: number
  ): string[] {
    const filteredParticipants = participants.filter(
      (id) => !excludeIds.includes(id)
    );

    const winners = [];
    const participantsCopy = [...filteredParticipants];

    for (let i = 0; i < count && participantsCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * participantsCopy.length);
      winners.push(participantsCopy[randomIndex]);
      participantsCopy.splice(randomIndex, 1);
    }

    return winners;
  }

  public async execute(
    giveawayId: number,
    client: Client,
    count: number = 1
  ): Promise<{
    success: boolean;
    newWinners: string[] | null;
    error?: string;
  }> {
    try {
      const giveaway = await Giveaway.findOne({ id: giveawayId });

      if (!giveaway) {
        errorHandler.execute(new Error(`Giveaway ${giveawayId} not found.`));
        return {
          success: false,
          newWinners: null,
          error: "Giveaway not found",
        };
      }

      if (!giveaway.ended) {
        errorHandler.execute(
          new Error(`Cannot reroll an active giveaway: ${giveawayId}`)
        );
        return {
          success: false,
          newWinners: null,
          error: "Cannot reroll an active giveaway",
        };
      }

      if (giveaway.participants.length <= giveaway.winners.length) {
        errorHandler.execute(
          new Error(
            `No more eligible participants to select as winners: ${giveawayId}`
          )
        );
        return {
          success: false,
          newWinners: null,
          error: "No more eligible participants to select as winners",
        };
      }

      // Select new winners excluding previous winners
      const newWinners = this.getRandomWinners(
        giveaway.participants,
        giveaway.winners,
        Math.min(count, giveaway.participants.length - giveaway.winners.length)
      );

      if (newWinners.length === 0) {
        errorHandler.execute(
          new Error(`No eligible participants for reroll: ${giveawayId}`)
        );
        return {
          success: false,
          newWinners: null,
          error: "No eligible participants for reroll",
        };
      }

      // Add new winners to the winners list
      giveaway.winners = [...giveaway.winners, ...newWinners];
      await giveaway.save();

      // Send message to channel about reroll
      try {
        const channel = (await client.channels.fetch(
          giveaway.channelId
        )) as TextChannel;
        if (channel) {
          const winnerMentions = newWinners.map((id) => `<@${id}>`).join(", ");
          await channel.send(
            `🎉 **GIVEAWAY REROLL** 🎉\n\nNew winner(s) for **${giveaway.prize}**: ${winnerMentions}\nCongratulations!`
          );
        }
      } catch (error) {
        console.error("Error sending reroll notification:", error);
        errorHandler.execute(
          new Error(`Error sending reroll notification: ${giveawayId}`)
        );
      }

      return { success: true, newWinners };
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
      return {
        success: false,
        newWinners: null,
        error: "An error occurred while rerolling the giveaway",
      };
    }
  }
}

export default RerollGiveaway;
