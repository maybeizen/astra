import { Schema, model, Document, Model } from "mongoose";

export interface GiveawaySettingsDocument extends Document {
  totalGiveaways: number;
  access: "ENABLED" | "DISABLED";
  defaultDuration: number;
  defaultWinnerCount: number;
  autoReroll: boolean;
  requiredRoleId?: string;
  allowedRoles?: string[];
  bannedUsers?: Array<{
    userId: string;
    moderator: string;
    reason?: string;
    bannedAt: Date;
  }>;
}

const giveawaySettingsSchema = new Schema<GiveawaySettingsDocument>({
  totalGiveaways: { type: Number, default: 0 },
  access: {
    type: String,
    enum: ["ENABLED", "DISABLED"],
    default: "ENABLED",
  },
  defaultDuration: { type: Number, default: 86400 }, // 24 hours in seconds
  defaultWinnerCount: { type: Number, default: 1 },
  autoReroll: { type: Boolean, default: false },
  requiredRoleId: { type: String },
  allowedRoles: { type: [String], default: [] },
  bannedUsers: [
    {
      userId: { type: String },
      moderator: { type: String },
      reason: { type: String },
      bannedAt: { type: Date, default: Date.now },
    },
  ],
});

const GiveawaySettingsModel: Model<GiveawaySettingsDocument> =
  model<GiveawaySettingsDocument>("GiveawaySettings", giveawaySettingsSchema);

export default GiveawaySettingsModel;
