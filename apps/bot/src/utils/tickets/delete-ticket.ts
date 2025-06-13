import {
  ButtonInteraction,
  Client,
  GuildMember,
  MessageFlags,
  TextChannel,
  NewsChannel,
} from "discord.js";
import config from "../../config";
import TicketSettings from "../../models/TicketSettings";
import Tickets from "../../models/Tickets";
import User from "../../models/User";
import { errorHandler } from "../error-handler";
import cache from "../cache";

interface DeleteTicketProps {
  interaction: ButtonInteraction;
  client: Client;
}

class DeleteTicket {
  constructor() {}

  public async delete({
    interaction,
    client,
  }: DeleteTicketProps): Promise<unknown> {
    try {
      const member = interaction.member as GuildMember;
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

      if (ticketData.status === "open" || ticketData.status === "deleted")
        return interaction.reply({
          content:
            "409 Conflict: `This ticket cannot be deleted right now.`\n\n" +
            "- If it's still **open**, it must be closed first.\n" +
            "- If it's already **deleted**, the channel may have failed to delete. Please contact a staff member.",
          flags: [MessageFlags.Ephemeral],
        });

      const hasStaffRole = config.staff.staffRoleIds.some((roleId) =>
        member.roles.cache.has(roleId)
      );

      if (!hasStaffRole)
        return interaction.reply({
          content:
            "403 Forbidden: `You do not have permission to perform this action.`",
          flags: [MessageFlags.Ephemeral],
        });

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

      ticketData.status = "deleted";
      ticketData.timestamps.deletedAt = Date.now();
      await ticketData.save();
      cache.delete(ticketCacheKey);

      const settingsCacheKey = "ticket_settings";
      let ticketSettings = cache.get(settingsCacheKey);

      if (!ticketSettings) {
        ticketSettings =
          (await TicketSettings.findOne()) || new TicketSettings();
        cache.set(settingsCacheKey, ticketSettings, 300000);
      }

      ticketSettings.stats.totalResolved += 1;
      await ticketSettings.save();
      cache.delete(settingsCacheKey);

      await channel.delete();
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
    }
  }
}

export default DeleteTicket;
