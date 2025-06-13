import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  TextChannel,
  NewsChannel,
  ApplicationCommandOptionType,
  MessageFlags,
} from "discord.js";
import type { CommandData, SlashCommandProps } from "commandkit";
import { errorHandler } from "../utils/error-handler";
import cache from "../utils/cache";
import Tickets from "../models/Tickets";

export const data: CommandData = {
  name: "ticket",
  description: "Manage the ticket system.",
  default_member_permissions:
    PermissionsBitField.Flags.Administrator.toString(),
  options: [
    {
      name: "setup",
      description: "Setup the ticket system.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel to send the ticket panel to.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
          channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        },
        {
          name: "content",
          description: "The message inside the ticket panel embed.",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 1000,
        },
      ],
    },
    {
      name: "add",
      description: "Add a user to the current ticket.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to add to the ticket.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a user from the current ticket.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to remove from the ticket.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const subcommand = interaction.options.getSubcommand();
  if (subcommand === "setup") {
    const channel = interaction.options.getChannel("channel") as
      | TextChannel
      | NewsChannel;
    const message = interaction.options.getString("content");

    if (!channel || !channel.isTextBased()) {
      return interaction.reply({
        content:
          "400 Bad Request: `The current channel does not accept messages.`",
        flags: [MessageFlags.Ephemeral],
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Nether Host Support")
      .setDescription(message!)
      .setColor("Red")
      .setFooter({
        text: "Nether Host | netherhost.cc",
        iconURL: client.user.avatarURL({ extension: "webp" }) ?? undefined,
      });

    const button = new ButtonBuilder()
      .setCustomId("ticket-open-button")
      .setLabel("New")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await channel.send({
      embeds: [embed],
      components: [row],
    });

    await interaction.reply({
      content: `Ticket panel successfully sent to ${channel}.`,
      flags: [MessageFlags.Ephemeral],
    });
  } else if (subcommand === "add" || subcommand === "remove") {
    try {
      const user = interaction.options.getUser("user");
      const member = interaction.guild?.members.cache.get(user?.id!);
      const channel = interaction.channel as TextChannel;

      const channelId = channel.id;
      const cacheKey = `ticket_channel_${channelId}`;
      let isTicketChannel = cache.get(cacheKey);

      if (isTicketChannel === null) {
        const ticket = await Tickets.findOne({ ticketId: channelId });
        isTicketChannel = !!ticket;
        cache.set(cacheKey, isTicketChannel, 300000);
      }

      if (!channel.isTextBased() || !isTicketChannel)
        return interaction.reply({
          content:
            "400 Bad Request: `The current channel is not a ticket channel.`",
          flags: [MessageFlags.Ephemeral],
        });

      if (!member)
        return interaction.reply({
          content: "400 Bad Request: `The user is not in the server.`",
          flags: [MessageFlags.Ephemeral],
        });

      if (subcommand === "add") {
        await channel.permissionOverwrites.edit(member, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });
      } else if (subcommand === "remove") {
        await channel.permissionOverwrites.edit(member, {
          ViewChannel: false,
          SendMessages: false,
          ReadMessageHistory: false,
        });
      }

      await interaction.reply({
        content: `Successfully ${
          subcommand === "add" ? "added" : "removed"
        } ${member} from the ticket.`,
      });
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
      return interaction.reply({
        content:
          "500 Internal Server Error: `An error occurred while adding the user to the ticket.`",
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
}
