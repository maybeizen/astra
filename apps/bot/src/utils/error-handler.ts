import { EmbedBuilder, WebhookClient } from "discord.js";

interface ErrorHandlerProps {
  webhookURL: string;
}

class ErrorHandler {
  private webhookClient: WebhookClient;

  constructor({ webhookURL }: ErrorHandlerProps) {
    this.webhookClient = new WebhookClient({ url: webhookURL });
  }

  private async sendError(error: Error) {
    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(`${error.message}\n\n\`\`\`${error.stack}\`\`\``)
      .setColor("Red")
      .setTimestamp();

    await this.webhookClient.send({
      embeds: [embed],
    });
  }

  public async execute(error: Error) {
    await this.sendError(error);
  }

  public getWebhookClient() {
    return this.webhookClient;
  }
}

export const errorHandler = new ErrorHandler({
  webhookURL: process.env.ERROR_WEBHOOK_URL!,
});
