import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
  TextChannel,
} from "discord.js";
import Tickets from "../../models/Tickets";
import Ticket from "./index";
import TicketSettings from "../../models/TicketSettings";
import config from "../../config";
import { errorHandler } from "../error-handler";
import cache from "../cache";

interface TicketStaffProps {
  interaction: ButtonInteraction;
  client: Client;
}

class TicketStaff {
  constructor() {}

  public async openStaffPanel({ interaction }: TicketStaffProps) {
    try {
      const member = interaction.member as GuildMember;
      const hasStaffRole = config.staff.staffRoleIds.some((roleId) =>
        member.roles.cache.has(roleId)
      );

      if (!hasStaffRole)
        return interaction.reply({
          content:
            "403 Forbidden: `You do not have permission to perform this action.`",
          flags: [MessageFlags.Ephemeral],
        });

      const buttons = [
        {
          label: "Claim",
          customId: "ticket-staff-claim-button",
          disabled: false,
        },
        {
          label: "Transcript",
          customId: "ticket-staff-transcript-button",
          disabled: false,
        },
        {
          label: "Stats",
          customId: "ticket-staff-stats-button",
          disabled: false,
        },
        {
          label: "Lock",
          customId: "ticket-staff-lock-button",
          disabled: true,
        },
        {
          label: "Elevate",
          customId: "ticket-staff-elevate-button",
          disabled: true,
        },
      ];

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        buttons.map((button) =>
          new ButtonBuilder()
            .setLabel(button.label)
            .setCustomId(button.customId)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(button.disabled)
        )
      );

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Manage Support Ticket")
            .setDescription("Manage the current support ticket here.")
            .setColor("Red")
            .addFields(
              {
                name: `Claim`,
                value: `Indicate that you're managing this ticket. Press again to unclaim.`,
              },
              {
                name: `Transcript`,
                value: `Force a transcipt to be generated, even if the user didn't request one.`,
              },
              {
                name: `Stats`,
                value: `View average response time statistics for tickets.`,
              },
              {
                name: `Lock`,
                value: `Temporarily locks this ticket. This is different from closing it.`,
              },
              {
                name: `Elevate`,
                value: `Send this ticket to higher/senior support. **For advanced issues**.`,
              }
            ),
        ],
        flags: [MessageFlags.Ephemeral],
        components: [row],
      });
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
    }
  }

  public async claimTicket({ interaction, client }: TicketStaffProps) {
    try {
      const ticketSettings = await getTicketSettings();
      const ticket = await Tickets.findOne({
        ticketId: interaction.channel?.id,
      });
      const channel = interaction.channel as TextChannel;

      if (!ticketSettings) {
        errorHandler.execute(
          new Error(`TicketSettings document not found in remote database.`)
        );
        return interaction.reply({
          content: `500 Internal Server Error: \`A new TicketSetttings document was created. Please press the button again.\``,
          flags: [MessageFlags.Ephemeral],
        });
      }
      if (!ticket) {
        errorHandler.execute(
          new Error(`TicketsDocument not found in remote database.`)
        );
        return interaction.reply({
          content: `404 Not Found: \`TicketsDocument not found in remote database.\``,
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (ticketSettings.claims.onlyOneClaimer) {
        if (ticket?.claim.status) {
          return interaction.reply({
            content: `409 Conflict: \`This ticket is already claimed by \`<@${ticket.claim.claimedBy}>`,
            flags: [MessageFlags.Ephemeral],
          });
        }
        ticket.claim = {
          status: true,
          claimedBy: interaction.user.id,
          claimedAt: Date.now(),
        };
      } else {
        ticket.claim = {
          status: true,
          claimedBy: interaction.user.id,
          claimedAt: Date.now(),
        };

        if (ticket.claim.status)
          console.log(
            `Overwriting previous claimer for ticket ${ticket.ticketId}`
          );
      }
      let authorUsername = "unknown";
      if (ticket.userId) {
        try {
          const authorUser = await client.users.fetch(ticket.userId);
          authorUsername = authorUser.username;
        } catch {}
      }

      const newChannelName =
        `ticket-${interaction.user.username}-${authorUsername}`
          .toLowerCase()
          .replace(/[^a-z0-9\-]/g, "");
      await channel.setName(newChannelName);

      await ticket.save();

      await channel.send({
        content: `This ticket has been claimed by <@${interaction.user.id}>.`,
      });

      return await interaction.reply({
        content: `You have successfully claimed this ticket.`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
    }
  }

  public async transcriptTicket({ interaction, client }: TicketStaffProps) {
    try {
      const ticket = new Ticket();
      const transcriptHandler = ticket.transcript();
      const channel = interaction.channel as TextChannel;
      const messages = await transcriptHandler.getMessages({ channel });
      const content = transcriptHandler.formatMessages(messages);

      const transcript = await transcriptHandler.saveTranscript({
        content,
        channel,
      });

      const files =
        transcript !== null ? [new AttachmentBuilder(transcript)] : [];

      await interaction.reply({
        content: "Here is the ticket transcript.",
        files,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
    }
  }

  public async getResponseTimeStats({ interaction, client }: TicketStaffProps) {
    try {
      const ticketSettings = await getTicketSettings();

      if (!ticketSettings) {
        errorHandler.execute(
          new Error(`TicketSettings document not found in remote database.`)
        );
        return interaction.reply({
          content: `500 Internal Server Error: \`No ticket settings found. Please try again later.\``,
          flags: [MessageFlags.Ephemeral],
        });
      }

      const averageMs = ticketSettings.stats.averageResponseTime;
      let formattedTime = "";

      if (averageMs < 1000) {
        formattedTime = `${Math.round(averageMs)} milliseconds`;
      } else if (averageMs < 60000) {
        formattedTime = `${Math.round(averageMs / 1000)} seconds`;
      } else {
        const minutes = Math.floor(averageMs / 60000);
        const seconds = Math.round((averageMs % 60000) / 1000);

        if (seconds === 0) {
          formattedTime = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
        } else {
          formattedTime = `${minutes} minute${
            minutes !== 1 ? "s" : ""
          } ${seconds} second${seconds !== 1 ? "s" : ""}`;
        }
      }

      const lastUpdated = ticketSettings.stats.responseTimeLastUpdated
        ? `<t:${Math.floor(
            ticketSettings.stats.responseTimeLastUpdated.getTime() / 1000
          )}:R>`
        : "Never";

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Statistics")
            .setDescription("Current statistics for the ticket system")
            .setColor("Red")
            .addFields(
              {
                name: "Average Response Time",
                value: formattedTime,
                inline: true,
              },
              {
                name: "Total Tickets Analyzed",
                value: `${ticketSettings.stats.totalTicketsWithResponse}`,
                inline: true,
              },
              {
                name: "Total Tickets Resolved",
                value: `${ticketSettings.stats.totalResolved}`,
                inline: true,
              },
              {
                name: "Last Updated",
                value: lastUpdated,
              }
            ),
        ],
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
    }
  }
}

async function getActiveTickets() {
  try {
    const cacheKey = "active_tickets";
    let tickets = cache.get(cacheKey);

    if (!tickets) {
      tickets = await Tickets.find({ status: "open" });
      cache.set(cacheKey, tickets, 60000);
    }

    return tickets;
  } catch (error: any) {
    errorHandler.execute(error);
    return [];
  }
}

async function getTicketSettings() {
  const cacheKey = "ticket_settings";
  let settings = cache.get(cacheKey);

  if (!settings) {
    settings = await TicketSettings.findOne();
    if (settings) {
      cache.set(cacheKey, settings, 300000);
    }
  }

  return settings;
}

export default TicketStaff;
