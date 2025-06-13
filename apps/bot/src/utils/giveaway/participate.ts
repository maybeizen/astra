import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonInteraction,
  GuildMember,
} from "discord.js";
import Giveaway from "../../models/Giveaway";
import { errorHandler } from "../error-handler";
import cache from "../cache";
import User from "../../models/User";

interface ParticipationResult {
  success: boolean;
  error?: string;
  action?: "added" | "removed";
}

class Participate {
  constructor() {}

  public async execute(
    giveawayId: number,
    userId: string,
    messageId: string,
    interaction: ButtonInteraction,
    durationTimestamp: string
  ): Promise<ParticipationResult> {
    try {
      const userCacheKey = `user_${userId}`;
      let userData = cache.get(userCacheKey);

      if (!userData) {
        userData = await User.findOne({ userId });
        if (userData) {
          cache.set(userCacheKey, userData, 300000);
        }
      }

      const giveawayCacheKey = `giveaway_${giveawayId}`;
      let giveaway = cache.get(giveawayCacheKey);

      if (!giveaway) {
        giveaway = await Giveaway.findOne({ id: giveawayId });
        if (giveaway) {
          cache.set(giveawayCacheKey, giveaway, 120000);
        }
      }

      if (!giveaway) {
        console.error("Giveaway not found in the database.");
        errorHandler.execute(new Error(`Giveaway ${giveawayId} not found.`));
        return { success: false, error: "That giveaway does not exist." };
      }

      if (giveaway.ended) {
        console.log(`Giveaway ${giveawayId} already ended.`);
        errorHandler.execute(
          new Error(`Giveaway ${giveawayId} already ended.`)
        );
        return { success: false, error: "That giveaway has already ended." };
      }

      const member = interaction.member as GuildMember;
      const userRoles = member.roles
        ? member.roles.cache.map((role) => role.id)
        : [];
      const giveawayRequiresRole = Boolean(giveaway.requiredRole);

      if (
        giveawayRequiresRole &&
        !userRoles.includes(giveaway.requiredRole as string)
      ) {
        console.log(
          `User ${userId} does not have the required role: ${giveaway.requiredRole}.`
        );
        errorHandler.execute(
          new Error(
            `User ${userId} does not have the required role: ${giveaway.requiredRole}.`
          )
        );
        return {
          success: false,
          error:
            "You do not have the required role to participate in this giveaway.",
        };
      }

      if (giveaway.participants.includes(userId)) {
        giveaway.participants = giveaway.participants.filter(
          (id: string) => id !== userId
        );
        console.log(`User ${userId} removed from participation.`);
      } else {
        giveaway.participants.push(userId);
        console.log(`User ${userId} added to participation.`);
      }

      await giveaway.save();

      let giveawayMessage;
      try {
        giveawayMessage = await interaction.channel?.messages.fetch(messageId);
        if (!giveawayMessage) {
          console.error("Unable to fetch giveaway message.");
          errorHandler.execute(new Error("Unable to fetch giveaway message."));
          return { success: false, error: "Unable to fetch giveaway message." };
        }
      } catch (error) {
        console.error("Unable to fetch giveaway message.");
        errorHandler.execute(new Error("Unable to fetch giveaway message."));
        return { success: false, error: "Unable to fetch giveaway message." };
      }

      const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Participate")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(`participate-giveaway-${giveaway.id}`),
        new ButtonBuilder()
          .setLabel(`${giveaway.participants.length}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
          .setCustomId(`participants-button-${giveaway.id}`)
      );

      await giveawayMessage.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle("New Giveaway 🎉")
            .setDescription("A new giveaway has been started!")
            .setColor("Red")
            .addFields(
              { name: "Prize", value: `${giveaway.prize}`, inline: false },
              {
                name: "Duration",
                value: `The giveaway will end ${durationTimestamp}`,
                inline: false,
              },
              {
                name: "Entries",
                value: `${giveaway.participants.length}`,
                inline: false,
              },
              {
                name: "Required Role",
                value: `${
                  giveaway.requiredRole
                    ? `<@&${giveaway.requiredRole}>`
                    : "None"
                }`,
                inline: false,
              }
            ),
        ],
        components: [updatedRow],
      });

      // After updating giveaway data, invalidate cache
      cache.delete(giveawayCacheKey);

      return {
        success: true,
        action: giveaway.participants.includes(userId) ? "added" : "removed",
      };
    } catch (error: any) {
      console.error(error);
      console.error(error.stack);
      errorHandler.execute(error);
      return {
        success: false,
        error: "An error occurred processing your request.",
      };
    }
  }
}

export default Participate;
