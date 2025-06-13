import { ButtonInteraction, Client } from "discord.js";
import { CommandKit } from "commandkit";
import { errorHandler } from "../../utils/error-handler";
import Giveaway from "../../utils/giveaway";

export default async function (
  interaction: ButtonInteraction,
  client: Client,
  handler: CommandKit
) {
  if (!interaction.isButton() || !interaction.customId) return;

  if (!interaction.customId.startsWith("participate-giveaway-")) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    const giveawayId = parseInt(
      interaction.customId.replace("participate-giveaway-", ""),
      10
    );

    if (isNaN(giveawayId)) {
      return interaction.editReply({
        content: `400 Bad Request: \`Invalid giveaway ID.\``,
      });
    }

    const giveawayManager = new Giveaway();

    const giveawayInfo = await giveawayManager.info().execute(giveawayId);

    if (!giveawayInfo) {
      return interaction.editReply({
        content: `404 Not Found: \`This giveaway no longer exists.\``,
      });
    }

    const endTimeFormatted = `<t:${Math.floor(giveawayInfo.endTime / 1000)}:R>`;

    const result = await giveawayManager
      .participate()
      .execute(
        giveawayId,
        interaction.user.id,
        interaction.message.id,
        interaction,
        endTimeFormatted
      );

    if (result.success) {
      await interaction.editReply({
        content:
          result.action === "added"
            ? "You have successfully entered the giveaway! Good luck!"
            : "You have removed your entry from the giveaway.",
      });
    } else {
      await interaction.editReply({
        content: `400 Bad Request: \`${result.error || "Unknown error"}\``,
      });
    }
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
    errorHandler.execute(error);
    await interaction.editReply({
      content: `500 Internal Server Error: \`An error occurred while processing your request.\``,
    });
  }
}
