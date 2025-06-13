import {
  type ButtonInteraction,
  type Client,
  type CacheType,
  type Interaction,
  TextChannel,
  MessageFlags,
  AttachmentBuilder,
} from "discord.js";
import type { CommandKit } from "commandkit";
import Ticket from "../../utils/tickets";
import { errorHandler } from "../../utils/error-handler";

export default async function (
  interaction: Interaction<CacheType>,
  client: Client<true>,
  handler: CommandKit
) {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "ticket-transcript-button") return;

  const channel = interaction.channel as TextChannel;
  const tickets = new Ticket();
  const transcriptHandler = tickets.transcript();

  try {
    await interaction.reply({
      content: "Saving your ticket transcript...",
      flags: [MessageFlags.Ephemeral],
    });

    const messages = await transcriptHandler.getMessages({ channel });
    const content = transcriptHandler.formatMessages(messages);

    const transcript = await transcriptHandler.saveTranscript({
      content,
      channel,
    });

    await interaction.editReply({
      content: "Transcript saved. Sending...",
    });

    const sent = await transcriptHandler.sendTranscript(
      interaction.user,
      transcript,
      client
    );

    await interaction.editReply({
      content: sent
        ? "Transcript sent to your DMs."
        : "Failed to send transcript to your DMs. Are they disabled?",
    });
  } catch (error: any) {
    console.error("Transcript handling failed:", error);
    errorHandler.execute(error);
    await interaction.editReply({
      content:
        "500 Server Error: `An unexpected error occurred while saving the transcript.`",
    });
  }
}
