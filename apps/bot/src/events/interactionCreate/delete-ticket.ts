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
  if (interaction.customId !== "ticket-delete-button") return;

  const ticket = new Ticket();

  await ticket.delete().delete({ interaction, client });
}
