import type {
  Client,
  ButtonInteraction,
  CacheType,
  Interaction,
} from "discord.js";
import type { CommandKit } from "commandkit";
import Ticket from "../../utils/tickets";

export default async function (
  interaction: Interaction<CacheType>,
  client: Client<true>,
  handler: CommandKit
) {
  if (!interaction.isButton()) return;

  const ticket = new Ticket();

  if (interaction.customId === "ticket-staff-panel-button") {
    await ticket.staff().openStaffPanel({ interaction, client });
  } else if (interaction.customId === "ticket-staff-claim-button") {
    await ticket.staff().claimTicket({ interaction, client });
  } else if (interaction.customId === "ticket-staff-transcript-button") {
    await ticket.staff().transcriptTicket({ interaction, client });
  } else if (interaction.customId === "ticket-staff-stats-button") {
    await ticket.staff().getResponseTimeStats({ interaction, client });
  }
}
