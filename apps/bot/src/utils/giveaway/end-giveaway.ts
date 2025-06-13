import { EmbedBuilder, TextChannel, Client } from "discord.js";
import Giveaway from "../../models/Giveaway";

class EndGiveaway {
  constructor() {}

  private getRandomWinners(participants: string[], count: number): string[] {
    const winners = [];
    const participantsCopy = [...participants];

    for (let i = 0; i < count && participantsCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * participantsCopy.length);
      winners.push(participantsCopy[randomIndex]);
      participantsCopy.splice(randomIndex, 1);
    }

    return winners;
  }

  public async execute(
    giveawayId: number,
    client: Client
  ): Promise<{ success: boolean; winners: string[] | null; error?: string }> {
    try {
      const giveaway = await Giveaway.findOne({ id: giveawayId });

      if (!giveaway) {
        return { success: false, winners: null, error: "Giveaway not found" };
      }

      if (giveaway.ended) {
        return {
          success: false,
          winners: null,
          error: "Giveaway already ended",
        };
      }

      const winners = this.getRandomWinners(
        giveaway.participants,
        Math.min(giveaway.winnerCount, giveaway.participants.length)
      );

      giveaway.winners = winners;
      giveaway.ended = true;
      await giveaway.save();

      try {
        const channel = (await client.channels.fetch(
          giveaway.channelId
        )) as TextChannel;
        if (!channel) return { success: true, winners };

        const winnerMentions =
          winners.length > 0
            ? winners.map((id) => `<@${id}>`).join(", ")
            : "No valid participants";

        const embed = new EmbedBuilder()
          .setTitle("Giveaway Ended 🎉")
          .setDescription(`The giveaway for **${giveaway.prize}** has ended!`)
          .setColor("Red")
          .addFields(
            {
              name: "Winner(s)",
              value: winnerMentions || "No winners",
              inline: false,
            },
            {
              name: "Total Participants",
              value: `${giveaway.participants.length}`,
              inline: false,
            }
          );

        await channel.send({
          content:
            winners.length > 0
              ? `Congratulations ${winnerMentions}! You won: **${giveaway.prize}**`
              : "No winners for this giveaway.",
          embeds: [embed],
          allowedMentions: {
            parse: ["users"],
          },
        });

        try {
          const message = await channel.messages.fetch(giveaway.messageId);
          if (message) {
            const originalEmbed = message.embeds[0];
            const updatedEmbed = EmbedBuilder.from(originalEmbed)
              .setTitle("Giveaway Ended 🎉")
              .setFields(
                { name: "Prize", value: `${giveaway.prize}`, inline: false },
                {
                  name: "Winners",
                  value: winnerMentions || "No winners",
                  inline: false,
                },
                {
                  name: "Entries",
                  value: `${giveaway.participants.length}`,
                  inline: false,
                }
              );

            await message.edit({
              embeds: [updatedEmbed],
              components: [],
            });
          }
        } catch (error) {
          console.error("Failed to update original giveaway message", error);
        }
      } catch (error) {
        console.error("Error sending giveaway end message:", error);
      }

      return { success: true, winners };
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      return {
        success: false,
        winners: null,
        error: "An error occurred while ending the giveaway",
      };
    }
  }
}

export default EndGiveaway;
