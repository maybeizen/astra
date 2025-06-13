import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Message,
  TextChannel,
  User,
} from "discord.js";
import fs from "fs";
import path from "path";
import { errorHandler } from "../error-handler";
import cache from "../cache";

class TicketTranscripts {
  constructor() {}

  public async getMessages({
    channel,
  }: {
    channel: TextChannel;
  }): Promise<Message<true>[]> {
    const cacheKey = `transcript_messages_${channel.id}`;
    let messages = cache.get(cacheKey);

    if (!messages) {
      messages = [];
      let lastMessageId: string | undefined;

      while (true) {
        const fetched = await channel.messages.fetch({
          limit: 100,
          before: lastMessageId,
        });

        if (fetched.size === 0) break;

        messages.push(...fetched.values());
        lastMessageId = fetched.last()?.id;
        if (!lastMessageId) break;
      }

      cache.set(cacheKey, messages, 300000);
    }

    return messages;
  }

  public formatMessages(messages: Message<true>[]): string {
    const messagesString = JSON.stringify(messages.map((m) => m.id));
    const cacheKey = `formatted_messages_${messagesString.substring(0, 100)}`;
    let formattedContent = cache.get(cacheKey);

    if (!formattedContent) {
      let lastDate = "";

      formattedContent = messages
        .slice()
        .reverse()
        .reduce((log, msg) => {
          if (msg.author.bot) return log;

          const createdAt = new Date(msg.createdAt);

          const currentDate = createdAt.toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });

          if (currentDate !== lastDate) {
            log += `\n=== ${currentDate} ===\n`;
            lastDate = currentDate;
          }

          const time = createdAt.toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const attachments = [...msg.attachments.values()]
            .map((a) => a.url)
            .join("\n");

          log += `[${time}] ${msg.author.username}: ${msg.content}\n${
            attachments ? `${attachments}\n` : ""
          }`;

          return log;
        }, "");

      cache.set(cacheKey, formattedContent, 300000);
    }

    return formattedContent;
  }

  public async saveTranscript({
    content,
    channel,
  }: {
    content: string;
    channel: TextChannel;
  }): Promise<string | null> {
    try {
      const cacheKey = `saved_transcript_${channel.id}`;
      let filePath = cache.get(cacheKey);

      if (!filePath) {
        const dir = path.resolve("./data/transcripts");
        await fs.promises.mkdir(dir, { recursive: true });

        filePath = path.join(dir, `${channel.name}-${channel.id}.txt`);
        await fs.promises.writeFile(filePath, content);

        cache.set(cacheKey, filePath, 300000);
      }

      return filePath;
    } catch (error: any) {
      console.error("Failed to save transcript:", error);
      errorHandler.execute(error);
      return null;
    }
  }

  public async sendTranscript(
    user: User,
    transcript: string | null,
    client: Client
  ): Promise<boolean> {
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Trustpilot")
          .setURL("https://trustpilot.com/evaluate/nether.host")
          .setStyle(ButtonStyle.Link)
      );

      const files =
        transcript !== null ? [new AttachmentBuilder(transcript)] : [];

      await user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Your Ticket Transcript")
            .setDescription(
              "Here is a copy of your support ticket transcript for your records."
            )
            .setColor("Red"),
        ],
        files,
        components: [row.toJSON()],
      });

      return true;
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
      return false;
    }
  }
}

export default TicketTranscripts;
