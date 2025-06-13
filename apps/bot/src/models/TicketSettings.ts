import { Schema, model, Document, Model } from "mongoose";

export interface TicketSettingsProps {
  access: "EVERYONE" | "CLIENTS_ONLY" | "CLOSED";
  autoClose: {
    enabled: boolean;
    interval?: number;
  };
  claims: {
    enabled: boolean;
    autoClaimOnMessage: boolean;
    onlyOneClaimer: boolean;
  };
  stats: {
    totalResolved: number;
    averageResponseTime: number; // in milliseconds
    responseTimeLastUpdated?: Date;
    totalTicketsWithResponse: number;
  };
  totalTickets?: number;
  ticketBanList?: Array<{
    userId: string;
    moderator: string;
    reason?: string;
    bannedAt: Date;
  }>;
}

export interface TicketSettingsDocument extends TicketSettingsProps, Document {}

const ticketSettingsSchema = new Schema<TicketSettingsDocument>({
  access: {
    type: String,
    enum: ["EVERYONE", "CLIENTS_ONLY", "CLOSED"],
    default: "EVERYONE",
  },
  autoClose: {
    enabled: { type: Boolean, default: false },
    interval: { type: Number },
  },
  claims: {
    enabled: { type: Boolean },
    autoClaimOnMessage: { type: Boolean, default: false },
    onlyOneClaimer: { type: Boolean, default: true },
  },
  stats: {
    totalResolved: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 }, // in milliseconds
    responseTimeLastUpdated: { type: Date },
    totalTicketsWithResponse: { type: Number, default: 0 },
  },
  totalTickets: { type: Number, default: 0 },
  ticketBanList: [
    {
      userId: { type: String },
      moderator: { type: String },
      reason: { type: String },
      bannedAt: { type: Date, default: Date.now },
    },
  ],
});

const TicketSettingsModel: Model<TicketSettingsDocument> =
  model<TicketSettingsDocument>("TicketSettings", ticketSettingsSchema);

export default TicketSettingsModel;
