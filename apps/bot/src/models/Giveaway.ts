import { Schema, model, Document, Model } from "mongoose";

export interface GiveawayDocument extends Document {
  id: number;
  prize: string;
  duration: number;
  messageId: string;
  channelId: string;
  winnerCount: number;
  requiredRole: string | null;
  pingRole: string | null;
  startTime: number;
  endTime: number;
  participants: string[];
  winners: string[];
  ended: boolean;
}

const giveawaySchema = new Schema<GiveawayDocument>({
  id: { type: Number, required: true, unique: true },
  prize: { type: String, required: true },
  duration: { type: Number, required: true },
  messageId: { type: String, required: true },
  channelId: { type: String, required: true },
  winnerCount: { type: Number, required: true },
  requiredRole: { type: String, default: null },
  pingRole: { type: String, default: null },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  participants: { type: [String], default: [] },
  winners: { type: [String], default: [] },
  ended: { type: Boolean, default: false },
});

const GiveawayModel: Model<GiveawayDocument> = model<GiveawayDocument>(
  "Giveaway",
  giveawaySchema
);

export default GiveawayModel;
