import type { CommandData, SlashCommandProps } from "commandkit";
import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";

export const data: CommandData = {
  name: "ping",
  description: "Replies with pong",
};

export function run({ interaction }: SlashCommandProps) {
  interaction.reply({ content: "Pong!" });
}
