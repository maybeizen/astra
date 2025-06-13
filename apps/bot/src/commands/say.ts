import type { CommandData, SlashCommandProps } from "commandkit";
import {
  ApplicationCommandOptionType,
  PermissionsBitField,
  TextChannel,
  NewsChannel,
  ThreadChannel,
  DMChannel,
  MessageFlags,
} from "discord.js";
import { errorHandler } from "../utils/error-handler";

export const data: CommandData = {
  name: "say",
  description: "Say something as NetherCore.",
  default_member_permissions:
    PermissionsBitField.Flags.Administrator.toString(),
  options: [
    {
      name: "message",
      description: "The message to send as NetherCore.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "anonymous",
      description: "Send this message anonymously?",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};

export async function run({ interaction }: SlashCommandProps) {
  const message = interaction.options.getString("message", true);
  const anonymous = interaction.options.getBoolean("anonymous") ?? true;

  const channel = interaction.channel;
  if (!channel?.isTextBased() || !("send" in channel)) {
    return interaction.reply({
      content:
        "400 Bad Request: `The current channel does not accept messages.`",
      flags: [MessageFlags.Ephemeral],
    });
  }

  try {
    if (anonymous) {
      await (
        channel as TextChannel | NewsChannel | ThreadChannel | DMChannel
      ).send(message);

      return interaction.reply({
        content: "Message sent anonymously.",
        flags: [MessageFlags.Ephemeral],
      });
    }

    return interaction.reply({
      content: `${message}`,
      flags: [],
    });
  } catch (error: any) {
    console.error(`Error in /say command: ${error}`);
    errorHandler.execute(error);
    return interaction.reply({
      content:
        "500 Internal Server Error: `An unexpected error occurred while executing this command.`",
      flags: [MessageFlags.Ephemeral],
    });
  }
}
