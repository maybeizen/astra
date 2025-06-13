import type { CommandData, SlashCommandProps } from "commandkit";
import {
  ApplicationCommandOptionType,
  PermissionsBitField,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import TicketSettings from "../models/TicketSettings";
import GiveawaySettings from "../models/GiveawaySettings";
import { errorHandler } from "../utils/error-handler";
import cache from "../utils/cache";

export const data: CommandData = {
  name: "settings",
  description: "Manage the bot's settings",
  default_member_permissions:
    PermissionsBitField.Flags.Administrator.toString(),
  options: [
    {
      name: "ticket",
      description: "Manage ticket settings",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "access",
          description: "Set who can create tickets",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "level",
              description: "Access level for ticket creation",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Everyone", value: "EVERYONE" },
                { name: "Clients Only", value: "CLIENTS_ONLY" },
                { name: "Disabled", value: "CLOSED" },
              ],
            },
          ],
        },
        {
          name: "claims",
          description: "Configure ticket claiming settings",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "action",
              description: "Action to perform",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Toggle Claiming", value: "toggle" },
                { name: "Toggle Auto-Claim On Message", value: "auto_claim" },
                { name: "Toggle One Claimer Only", value: "one_claimer" },
              ],
            },
          ],
        },
        {
          name: "autoclose",
          description: "Configure auto-close settings",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "action",
              description: "Action to perform",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Toggle Auto-Close", value: "toggle" },
                { name: "Set Interval (minutes)", value: "interval" },
              ],
            },
            {
              name: "value",
              description: "Value for the setting (if applicable)",
              type: ApplicationCommandOptionType.Integer,
              required: false,
              min_value: 1,
              max_value: 10080,
            },
          ],
        },
        {
          name: "banlist",
          description: "Manage ticket ban list",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "action",
              description: "Action to perform",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Add User", value: "add" },
                { name: "Remove User", value: "remove" },
                { name: "View Ban List", value: "view" },
              ],
            },
            {
              name: "user",
              description: "User to add or remove from ban list",
              type: ApplicationCommandOptionType.User,
              required: false,
            },
            {
              name: "reason",
              description: "Reason for ban (if adding)",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
        {
          name: "view",
          description: "View all ticket settings",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
  ],
};

export async function run({ interaction }: SlashCommandProps) {
  try {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === "ticket") {
      await handleTicketSettings(interaction, subcommand);
    } else if (subcommandGroup === "giveaway") {
      await handleGiveawaySettings(interaction, subcommand);
    }
  } catch (error: any) {
    console.error(error);
    errorHandler.execute(error);
    interaction.reply({
      content: `500 Internal Server Error: \`An error occurred while running the command.\``,
      flags: [MessageFlags.Ephemeral],
    });
  }
}

async function handleTicketSettings(interaction: any, subcommand: string) {
  const cacheKey = "ticket_settings";
  let settings = cache.get(cacheKey);

  if (!settings) {
    settings = (await TicketSettings.findOne()) || new TicketSettings();
    cache.set(cacheKey, settings, 300000);
  }

  switch (subcommand) {
    case "access": {
      const level = interaction.options.getString("level");
      settings.access = level;
      await settings.save();
      cache.delete(cacheKey);

      return interaction.reply({
        content: `Ticket access level set to \`${level}\``,
        flags: [MessageFlags.Ephemeral],
      });
    }

    case "claims": {
      const action = interaction.options.getString("action");

      switch (action) {
        case "toggle":
          settings.claims.enabled = !settings.claims.enabled;
          await settings.save();
          return interaction.reply({
            content: `Ticket claiming is now ${
              settings.claims.enabled ? "enabled" : "disabled"
            }`,
            flags: [MessageFlags.Ephemeral],
          });

        case "auto_claim":
          settings.claims.autoClaimOnMessage =
            !settings.claims.autoClaimOnMessage;
          await settings.save();
          return interaction.reply({
            content: `Auto-claim on message is now ${
              settings.claims.autoClaimOnMessage ? "enabled" : "disabled"
            }`,
            flags: [MessageFlags.Ephemeral],
          });

        case "one_claimer":
          settings.claims.onlyOneClaimer = !settings.claims.onlyOneClaimer;
          await settings.save();
          return interaction.reply({
            content: `One claimer only is now ${
              settings.claims.onlyOneClaimer ? "enabled" : "disabled"
            }`,
            flags: [MessageFlags.Ephemeral],
          });
      }
      break;
    }

    case "autoclose": {
      const action = interaction.options.getString("action");
      const value = interaction.options.getInteger("value");

      if (action === "toggle") {
        settings.autoClose.enabled = !settings.autoClose.enabled;
        await settings.save();
        return interaction.reply({
          content: `Auto-close is now ${
            settings.autoClose.enabled ? "enabled" : "disabled"
          }`,
          flags: [MessageFlags.Ephemeral],
        });
      } else if (action === "interval" && value) {
        settings.autoClose.interval = value * 60;
        await settings.save();
        return interaction.reply({
          content: `Auto-close interval set to ${value} minutes`,
          flags: [MessageFlags.Ephemeral],
        });
      }
      break;
    }

    case "banlist": {
      const action = interaction.options.getString("action");
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      if (action === "view") {
        const banList = settings.ticketBanList || [];

        if (banList.length === 0) {
          return interaction.reply({
            content: "No users are currently banned from creating tickets.",
            flags: [MessageFlags.Ephemeral],
          });
        }

        const embed = new EmbedBuilder()
          .setTitle("Ticket Ban List")
          .setColor("Red")
          .setDescription(
            banList
              .map(
                (ban: any) =>
                  `<@${ban.userId}> - Banned by <@${ban.moderator}> - ${
                    ban.reason || "No reason provided"
                  }`
              )
              .join("\n")
          );

        return interaction.reply({
          embeds: [embed],
          flags: [MessageFlags.Ephemeral],
        });
      } else if (action === "add" && user) {
        if (!settings.ticketBanList) {
          settings.ticketBanList = [];
        }

        const existingBan = settings.ticketBanList.find(
          (ban: any) => ban.userId === user.id
        );
        if (existingBan) {
          return interaction.reply({
            content: `409 Conflict: \`User ${user.tag} is already banned from creating tickets.\``,
            flags: [MessageFlags.Ephemeral],
          });
        }

        settings.ticketBanList.push({
          userId: user.id,
          moderator: interaction.user.id,
          reason: reason || undefined,
          bannedAt: new Date(),
        });

        await settings.save();
        return interaction.reply({
          content: `User ${user.tag} has been banned from creating tickets.`,
          flags: [MessageFlags.Ephemeral],
        });
      } else if (action === "remove" && user) {
        if (!settings.ticketBanList) {
          return interaction.reply({
            content: `404 Not Found: \`User ${user.tag} is not banned from creating tickets.\``,
            flags: [MessageFlags.Ephemeral],
          });
        }

        const initialLength = settings.ticketBanList.length;
        settings.ticketBanList = settings.ticketBanList.filter(
          (ban: any) => ban.userId !== user.id
        );

        if (settings.ticketBanList.length === initialLength) {
          return interaction.reply({
            content: `404 Not Found: \`User ${user.tag} is not banned from creating tickets.\``,
            flags: [MessageFlags.Ephemeral],
          });
        }

        await settings.save();
        return interaction.reply({
          content: `User ${user.tag} has been unbanned from creating tickets.`,
          flags: [MessageFlags.Ephemeral],
        });
      }
      break;
    }

    case "view": {
      const totalTickets = settings.totalTickets || 0;
      const averageResponseTime = settings.stats?.averageResponseTime || 0;

      let formattedResponseTime = "N/A";
      if (averageResponseTime > 0) {
        if (averageResponseTime < 1000) {
          formattedResponseTime = `${Math.round(averageResponseTime)}ms`;
        } else if (averageResponseTime < 60000) {
          formattedResponseTime = `${Math.round(averageResponseTime / 1000)}s`;
        } else {
          formattedResponseTime = `${Math.round(averageResponseTime / 60000)}m`;
        }
      }

      const embed = new EmbedBuilder()
        .setTitle("Ticket Settings")
        .setColor("Red")
        .addFields(
          { name: "Access", value: settings.access, inline: true },
          {
            name: "Claims",
            value: `Enabled: ${
              settings.claims?.enabled ? "Yes" : "No"
            }\nAuto-claim: ${
              settings.claims?.autoClaimOnMessage ? "Yes" : "No"
            }\nOne claimer: ${settings.claims?.onlyOneClaimer ? "Yes" : "No"}`,
            inline: true,
          },
          {
            name: "Auto-Close",
            value: `Enabled: ${
              settings.autoClose?.enabled ? "Yes" : "No"
            }\nInterval: ${
              settings.autoClose?.interval
                ? `${Math.round(settings.autoClose.interval / 60)} min`
                : "N/A"
            }`,
            inline: true,
          },
          {
            name: "Stats",
            value: `Total tickets: ${totalTickets}\nResolved: ${
              settings.stats?.totalResolved || 0
            }\nAvg. response: ${formattedResponseTime}`,
            inline: true,
          },
          {
            name: "Ban List",
            value: `${settings.ticketBanList?.length || 0} user(s) banned`,
            inline: true,
          }
        );

      return interaction.reply({
        embeds: [embed],
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
}

async function handleGiveawaySettings(interaction: any, subcommand: string) {
  const cacheKey = "giveaway_settings";
  let settings = cache.get(cacheKey);

  if (!settings) {
    settings = (await GiveawaySettings.findOne()) || new GiveawaySettings();
    cache.set(cacheKey, settings, 300000);
  }

  switch (subcommand) {
    case "access": {
      const status = interaction.options.getString("status");
      settings.access = status;
      await settings.save();

      return interaction.reply({
        content: `Giveaways are now ${
          status === "ENABLED" ? "enabled" : "disabled"
        }`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    case "defaults": {
      const setting = interaction.options.getString("setting");
      const value = interaction.options.getInteger("value");

      if (setting === "duration") {
        settings.defaultDuration = value * 60;
        await settings.save();
        return interaction.reply({
          content: `Default giveaway duration set to ${value} minutes`,
          flags: [MessageFlags.Ephemeral],
        });
      } else if (setting === "winners") {
        settings.defaultWinnerCount = value;
        await settings.save();
        return interaction.reply({
          content: `Default winner count set to ${value}`,
          flags: [MessageFlags.Ephemeral],
        });
      }
      break;
    }

    case "autoreroll": {
      settings.autoReroll = !settings.autoReroll;
      await settings.save();
      return interaction.reply({
        content: `Auto-reroll is now ${
          settings.autoReroll ? "enabled" : "disabled"
        }`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    case "banlist": {
      const action = interaction.options.getString("action");
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      if (action === "view") {
        const banList = settings.bannedUsers || [];

        if (banList.length === 0) {
          return interaction.reply({
            content:
              "No users are currently banned from participating in giveaways.",
            flags: [MessageFlags.Ephemeral],
          });
        }

        const embed = new EmbedBuilder()
          .setTitle("Giveaway Ban List")
          .setColor("Red")
          .setDescription(
            banList
              .map(
                (ban: any) =>
                  `<@${ban.userId}> - Banned by <@${ban.moderator}> - ${
                    ban.reason || "No reason provided"
                  }`
              )
              .join("\n")
          );

        return interaction.reply({
          embeds: [embed],
          flags: [MessageFlags.Ephemeral],
        });
      } else if (action === "add" && user) {
        if (!settings.bannedUsers) {
          settings.bannedUsers = [];
        }

        const existingBan = settings.bannedUsers.find(
          (ban: any) => ban.userId === user.id
        );
        if (existingBan) {
          return interaction.reply({
            content: `409 Conflict: \`User ${user.tag} is already banned from participating in giveaways.\``,
            flags: [MessageFlags.Ephemeral],
          });
        }

        settings.bannedUsers.push({
          userId: user.id,
          moderator: interaction.user.id,
          reason: reason || undefined,
          bannedAt: new Date(),
        });

        await settings.save();
        return interaction.reply({
          content: `User ${user.tag} has been banned from participating in giveaways.`,
          flags: [MessageFlags.Ephemeral],
        });
      } else if (action === "remove" && user) {
        if (!settings.bannedUsers) {
          return interaction.reply({
            content: `404 Not Found: \`User ${user.tag} is not banned from participating in giveaways.\``,
            flags: [MessageFlags.Ephemeral],
          });
        }

        const initialLength = settings.bannedUsers.length;
        settings.bannedUsers = settings.bannedUsers.filter(
          (ban: any) => ban.userId !== user.id
        );

        if (settings.bannedUsers.length === initialLength) {
          return interaction.reply({
            content: `404 Not Found: \`User ${user.tag} is not banned from participating in giveaways.\``,
            flags: [MessageFlags.Ephemeral],
          });
        }

        await settings.save();
        return interaction.reply({
          content: `User ${user.tag} has been unbanned from participating in giveaways.`,
          flags: [MessageFlags.Ephemeral],
        });
      }
      break;
    }

    case "view": {
      const embed = new EmbedBuilder()
        .setTitle("Giveaway Settings")
        .setColor("Red")
        .addFields(
          { name: "Status", value: settings.access, inline: true },
          {
            name: "Total Giveaways",
            value: `${settings.totalGiveaways}`,
            inline: true,
          },
          {
            name: "Default Duration",
            value: `${Math.round(settings.defaultDuration / 60)} minutes`,
            inline: true,
          },
          {
            name: "Default Winners",
            value: `${settings.defaultWinnerCount}`,
            inline: true,
          },
          {
            name: "Auto-Reroll",
            value: settings.autoReroll ? "Enabled" : "Disabled",
            inline: true,
          },
          {
            name: "Ban List",
            value: `${settings.bannedUsers?.length || 0} user(s) banned`,
            inline: true,
          }
        );

      return interaction.reply({
        embeds: [embed],
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
}
