import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  PermissionsBitField,
} from "discord.js";
import type { CommandData, SlashCommandProps } from "commandkit";
import Giveaway from "../utils/giveaway";
import { errorHandler } from "../utils/error-handler";

export const data: CommandData = {
  name: "giveaway",
  description: "Manage giveaways in the server.",
  default_member_permissions: PermissionsBitField.Flags.ManageEvents.toString(),
  options: [
    {
      name: "create",
      description: "Create a new giveaway.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "prize",
          description: "The prize for the giveaway.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "duration",
          description: "Duration in minutes (default: 24 hours).",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
          max_value: 20160, // 2 weeks in minutes
        },
        {
          name: "winners",
          description: "Number of winners (default: 1).",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
          max_value: 10,
        },
        {
          name: "channel",
          description:
            "Channel to post the giveaway in (default: current channel).",
          type: ApplicationCommandOptionType.Channel,
          required: false,
        },
        {
          name: "required_role",
          description: "Role required to participate in the giveaway.",
          type: ApplicationCommandOptionType.Role,
          required: false,
        },
        {
          name: "ping_role",
          description: "Role to ping when the giveaway starts.",
          type: ApplicationCommandOptionType.Role,
          required: false,
        },
      ],
    },
    {
      name: "end",
      description: "End a giveaway early.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "giveaway_id",
          description: "The ID of the giveaway to end.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
      ],
    },
    {
      name: "reroll",
      description: "Reroll the winners for a giveaway.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "giveaway_id",
          description: "The ID of the giveaway to reroll.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
        {
          name: "count",
          description: "Number of new winners to select (default: 1).",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
          max_value: 10,
        },
      ],
    },
    {
      name: "list",
      description: "List active giveaways.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "status",
          description: "Filter giveaways by status (default: active).",
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            { name: "Active", value: "active" },
            { name: "Ended", value: "ended" },
            { name: "All", value: "all" },
          ],
        },
        {
          name: "limit",
          description: "Number of giveaways to list (default: 5).",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
          max_value: 25,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const subcommand = interaction.options.getSubcommand();
  const giveawayManager = new Giveaway();

  if (subcommand === "create") {
    await handleCreateGiveaway(interaction, client, giveawayManager);
  } else if (subcommand === "end") {
    await handleEndGiveaway(interaction, client, giveawayManager);
  } else if (subcommand === "reroll") {
    await handleRerollGiveaway(interaction, client, giveawayManager);
  } else if (subcommand === "list") {
    await handleListGiveaways(interaction, giveawayManager);
  }
}

async function handleCreateGiveaway(
  interaction: any,
  client: any,
  giveawayManager: Giveaway
) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const prize = interaction.options.getString("prize");
    const durationMinutes = interaction.options.getInteger("duration") || 1440;
    const winnerCount = interaction.options.getInteger("winners") || 1;
    const targetChannel =
      interaction.options.getChannel("channel") || interaction.channel;
    const requiredRole = interaction.options.getRole("required_role");
    const pingRole = interaction.options.getRole("ping_role");

    const durationSeconds = durationMinutes * 60;
    const endTime = Date.now() + durationSeconds * 1000;
    const endTimeFormatted = `<t:${Math.floor(endTime / 1000)}:R>`;

    const giveawayEmbed = new EmbedBuilder()
      .setTitle("New Giveaway 🎉")
      .setDescription("A new giveaway has been started!")
      .setColor("Red")
      .addFields(
        { name: "Prize", value: prize, inline: false },
        {
          name: "Duration",
          value: `The giveaway will end ${endTimeFormatted}`,
          inline: false,
        },
        { name: "Entries", value: "0", inline: false },
        {
          name: "Required Role",
          value: requiredRole ? `<@&${requiredRole.id}>` : "None",
          inline: false,
        }
      )
      .setTimestamp();

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`participate-giveaway-placeholder`)
        .setLabel("Participate")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`participants-button-placeholder`)
        .setLabel("0")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );

    let pingMessage = "";
    if (pingRole) {
      pingMessage = `<@&${pingRole.id}> `;
    }

    const giveawayMessage = await targetChannel.send({
      content: pingMessage
        ? `${pingMessage}A new giveaway has started!`
        : undefined,
      embeds: [giveawayEmbed],
      components: [buttonRow],
    });

    const newGiveaway = await giveawayManager
      .start()
      .execute(
        prize,
        durationSeconds,
        winnerCount,
        requiredRole,
        pingRole,
        giveawayMessage.id,
        targetChannel.id
      );

    if (!newGiveaway) {
      await interaction.editReply({
        content: `500 Internal Server Error: \`Failed to create the giveaway. Please try again.\``,
      });
      return;
    }

    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`participate-giveaway-${newGiveaway.id}`)
        .setLabel("Participate")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`participants-button-${newGiveaway.id}`)
        .setLabel("0")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );

    await giveawayMessage.edit({
      components: [updatedRow],
    });

    await interaction.editReply({
      content: `Successfully created a giveaway for **${prize}**! ID: ${newGiveaway.id}`,
    });
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
    errorHandler.execute(error);
    await interaction.editReply({
      content: `500 Internal Server Error: \`An error occurred while creating the giveaway.\``,
    });
  }
}

async function handleEndGiveaway(
  interaction: any,
  client: any,
  giveawayManager: Giveaway
) {
  await interaction.deferReply();

  try {
    const giveawayId = interaction.options.getInteger("giveaway_id");

    const giveawayInfo = await giveawayManager.info().execute(giveawayId);
    if (!giveawayInfo) {
      return interaction.editReply({
        content: `404 Not Found: \`Giveaway with ID ${giveawayId} not found.\``,
      });
    }

    const result = await giveawayManager.end().execute(giveawayId, client);

    if (result.success) {
      const winnerMentions =
        result.winners && result.winners.length > 0
          ? result.winners.map((id) => `<@${id}>`).join(", ")
          : "No winners";

      await interaction.editReply({
        content: `Successfully ended giveaway #${giveawayId}.\nWinners: ${winnerMentions}`,
      });
    } else {
      await interaction.editReply({
        content: `400 Bad Request: \`Failed to end giveaway: ${
          result.error || "Unknown error"
        }\``,
      });
    }
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
    errorHandler.execute(error);
    await interaction.editReply({
      content: `500 Internal Server Error: \`An error occurred while ending the giveaway.\``,
    });
  }
}

async function handleRerollGiveaway(
  interaction: any,
  client: any,
  giveawayManager: Giveaway
) {
  await interaction.deferReply();

  try {
    const giveawayId = interaction.options.getInteger("giveaway_id");
    const count = interaction.options.getInteger("count") || 1;

    const result = await giveawayManager
      .reroll()
      .execute(giveawayId, client, count);

    if (result.success) {
      const winnerMentions =
        result.newWinners && result.newWinners.length > 0
          ? result.newWinners.map((id) => `<@${id}>`).join(", ")
          : "No new winners selected";

      await interaction.editReply({
        content: `Successfully rerolled giveaway #${giveawayId}.\nNew Winners: ${winnerMentions}`,
      });
    } else {
      await interaction.editReply({
        content: `400 Bad Request: \`Failed to reroll giveaway: ${
          result.error || "Unknown error"
        }\``,
      });
    }
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
    errorHandler.execute(error);
    await interaction.editReply({
      content: `500 Internal Server Error: \`An error occurred while rerolling the giveaway.\``,
    });
  }
}

async function handleListGiveaways(
  interaction: any,
  giveawayManager: Giveaway
) {
  await interaction.deferReply();

  try {
    const status = interaction.options.getString("status") || "active";
    const limit = interaction.options.getInteger("limit") || 5;

    let giveaways;
    if (status === "active") {
      giveaways = await giveawayManager.list().getActive();
    } else if (status === "ended") {
      giveaways = await giveawayManager.list().getEnded();
    } else {
      giveaways = await giveawayManager.list().execute({ limit });
    }

    if (!giveaways || giveaways.length === 0) {
      return interaction.editReply({
        content: `404 Not Found: \`No ${status} giveaways found.\``,
      });
    }

    const giveawaysToShow = giveaways.slice(0, limit);

    const embed = new EmbedBuilder()
      .setTitle(`${status.charAt(0).toUpperCase() + status.slice(1)} Giveaways`)
      .setColor("Red")
      .setDescription(
        giveawaysToShow
          .map(
            (g) =>
              `**ID ${g.id}**: ${g.prize}\n` +
              `Ends: <t:${Math.floor(g.endTime / 1000)}:R>\n` +
              `Participants: ${g.participants.length}\n` +
              `Winners: ${g.winnerCount}\n`
          )
          .join("\n\n")
      )
      .setFooter({
        text: `Showing ${giveawaysToShow.length} out of ${giveaways.length} giveaways`,
      });

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
    errorHandler.execute(error);
    await interaction.editReply({
      content: `500 Internal Server Error: \`An error occurred while listing giveaways.\``,
    });
  }
}
