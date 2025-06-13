import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ActionRowBuilder,
  MessageFlags,
} from "discord.js";
import type { CommandData, SlashCommandProps } from "commandkit";
import os from "node:os";
import { version } from "../../package.json";
import { execSync } from "child_process";
import { errorHandler } from "../utils/error-handler";
const commit = execSync("git rev-parse --short HEAD").toString().trim();

export const data: CommandData = {
  name: "health",
  description: "Replies with bot status and information.",
};

export async function run({ interaction, client }: SlashCommandProps) {
  await interaction.deferReply();

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const createEmbed = async () => {
    const apiPing = Math.round(client.ws.ping);

    const memoryUsage = process.memoryUsage();

    const cpuLoad = os.loadavg()[0]; // load avg over 60s

    return new EmbedBuilder()
      .setTitle("Bot Health")
      .setColor("Red")
      .setFields(
        {
          name: "API Ping",
          value: `\`\`\`${apiPing}ms\`\`\``,
          inline: true,
        },
        {
          name: "Uptime",
          value: `\`\`\`${formatUptime(client.uptime)}\`\`\``,
          inline: true,
        },
        {
          name: "Memory (RSS)",
          value: `\`\`\`${formatBytes(memoryUsage.rss)}\`\`\``,
          inline: true,
        },
        {
          name: "Memory (Heap Used)",
          value: `\`\`\`${formatBytes(memoryUsage.heapUsed)}\`\`\``,
          inline: true,
        },
        {
          name: "CPU Load (1m avg)",
          value: `\`\`\`${cpuLoad.toFixed(2)}\`\`\``,
          inline: true,
        }
      )
      .setFooter({
        text: `NetherCore ${version} (${commit})`,
        iconURL: client.user.avatarURL({ extension: "webp" }) ?? undefined,
      });
  };

  const recheckButton = new ButtonBuilder()
    .setCustomId("health-recheck")
    .setLabel("Refresh")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(recheckButton);

  const embed = await createEmbed();
  const message = await interaction.editReply({
    embeds: [embed],
    components: [row.toJSON()],
  });

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60_000,
  });

  collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
    if (buttonInteraction.user.id !== interaction.user.id)
      return buttonInteraction.reply({
        content:
          "403 Forbidden: `Only the command author is permitted to use this.`",
        flags: [MessageFlags.Ephemeral],
      });

    await buttonInteraction.deferUpdate();
    const updatedEmbed = await createEmbed();
    await interaction.editReply({ embeds: [updatedEmbed] });
  });

  collector.on("end", async () => {
    const disabledRow = new ActionRowBuilder().addComponents(
      recheckButton.setDisabled(true)
    );

    await interaction.editReply({ components: [disabledRow.toJSON()] });
  });
}
