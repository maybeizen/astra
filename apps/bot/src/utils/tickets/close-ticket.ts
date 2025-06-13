import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  EmbedBuilder,
  MessageFlags,
  NewsChannel,
  TextChannel,
} from "discord.js";
import config from "../../config";
import TicketSettings from "../../models/TicketSettings";
import Tickets from "../../models/Tickets";
import User from "../../models/User";
import { errorHandler } from "../error-handler";
import cache from "../cache";

interface CloseTicketProps {
  interaction: ButtonInteraction;
  client: Client;
}

class CloseTicket {
  constructor() {}

  public async close({
    interaction,
    client,
  }: CloseTicketProps): Promise<unknown> {
    try {
      const channel = interaction.channel as TextChannel | NewsChannel;

      const userCacheKey = `user_${interaction.user.id}`;
      let userData = cache.get(userCacheKey);

      if (!userData) {
        userData = await User.findOne({ userId: interaction.user.id });
        if (userData) {
          cache.set(userCacheKey, userData, 300000);
        }
      }

      if (!userData) {
        errorHandler.execute(
          new Error(
            `UserDocument for ${interaction.user.id} not found in remote database.`
          )
        );
        return interaction.reply({
          content: `404 Not Found: \`UserDocument for ${interaction.user.id} not found in remote database.\``,
          flags: [MessageFlags.Ephemeral],
        });
      }

      const ticketCacheKey = `ticket_${channel.id}`;
      let ticketData = cache.get(ticketCacheKey);

      if (!ticketData) {
        ticketData = await Tickets.findOne({
          ticketId: channel.id,
        });
        if (ticketData) {
          cache.set(ticketCacheKey, ticketData, 300000);
        }
      }

      if (!ticketData) {
        errorHandler.execute(
          new Error(`TicketsDocument not found in remote database.`)
        );
        return interaction.reply({
          content: `404 Not Found: \`TicketsDocument not found in remote database.\``,
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (["closed", "deleted"].includes(ticketData.status)) {
        return interaction.reply({
          content: `409 Conflict: \`This ticket is already ${ticketData.status}\`.`,
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (channel) {
        try {
          await channel.permissionOverwrites.edit(ticketData.userId, {
            SendMessages: false,
            AddReactions: false,
          });
        } catch (error: any) {
          console.error(error);
          errorHandler.execute(error);
        }
      } else {
        errorHandler.execute(
          new Error("Channel not found or not a guild text-based channel.")
        );
        return interaction.reply({
          content:
            "500 Internal Server Error: `Channel not found or not a guild text-based channel.`",
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (!ticketData.timestamps.firstResponseAt) {
        ticketData.timestamps.firstResponseAt = Date.now();

        const createdAt = ticketData.timestamps.createdAt;
        const respondedAt = Date.now();
        const responseTime = respondedAt - createdAt;

        ticketData.responseTime = responseTime;

        const settingsCacheKey = "ticket_settings";
        let ticketSettings = cache.get(settingsCacheKey);

        if (!ticketSettings) {
          ticketSettings =
            (await TicketSettings.findOne()) || new TicketSettings();

          cache.set(settingsCacheKey, ticketSettings, 300000);
        }

        const currentTotal =
          ticketSettings.stats.averageResponseTime *
          ticketSettings.stats.totalTicketsWithResponse;
        const newTotal = currentTotal + responseTime;
        const newCount = ticketSettings.stats.totalTicketsWithResponse + 1;
        const newAverage = newTotal / newCount;

        ticketSettings.stats.averageResponseTime = newAverage;
        ticketSettings.stats.totalTicketsWithResponse = newCount;
        ticketSettings.stats.responseTimeLastUpdated = new Date();

        await ticketSettings.save();
        cache.delete(settingsCacheKey);
      }

      ticketData.status = "closed";
      ticketData.timestamps.closedAt = Date.now();
      await ticketData.save();
      cache.delete(ticketCacheKey);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Delete")
          .setCustomId("ticket-delete-button")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setLabel("Transcript")
          .setCustomId("ticket-transcript-button")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("Re-open")
          .setCustomId("ticket-reopen-button")
          .setStyle(ButtonStyle.Secondary)
      );

      await channel.edit({
        parent: config?.tickets?.closedCategoryId,
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Ticket Closed`)
            .setDescription(
              "This ticket has been closed. Below, there are some actions that the creator or a staff member can perform."
            )
            .setColor("Red")
            .setFields(
              {
                name: "Delete",
                value: `A staff member can delete if it is no longer being used. This will delete the channel and all of its messages.`,
                inline: true,
              },
              {
                name: "Transcript",
                value: `A file containing all messages in this ticket. Transcripts are not saved by Nether Host.`,
                inline: true,
              },
              {
                name: "Re-Open",
                value: `You or a staff member can re-open this ticket if you weren't finished using it.`,
                inline: true,
              }
            ),
        ],
        components: [row.toJSON()],
      });
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
    }
  }
}

export default CloseTicket;
