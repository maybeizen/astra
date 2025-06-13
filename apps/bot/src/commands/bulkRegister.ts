import type { CommandData, SlashCommandProps } from "commandkit";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { bulkRegisterUsers } from "../utils/register";

export const data: CommandData = {
  name: "bulk-register",
  description: "Run the bulk user registration utility",
  default_member_permissions:
    PermissionsBitField.Flags.Administrator.toString(),
};

export async function run({ interaction, client }: SlashCommandProps) {
  if (!interaction.guild?.id) return;

  await interaction.deferReply();

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setTitle("Bulk Registration")
        .setDescription("Started user bulk registration...")
        .setColor("Yellow"),
    ],
  });
  const newUsers = await bulkRegisterUsers(client, interaction.guild.id);
  if (newUsers && newUsers.length > 0) {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Bulk Registration")
          .setDescription(`Successfully registered ${newUsers.length} users!`)
          .setColor("Green"),
      ],
    });
  } else {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Bulk Registration")
          .setDescription("No new users to register.")
          .setColor("Red"),
      ],
    });
  }
}
