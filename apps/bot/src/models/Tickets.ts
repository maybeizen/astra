import { Schema, model, Document, Model } from "mongoose";
import { type Ticket as TicketProps } from "../../types/global";

interface TicketDocument extends TicketProps, Document {}

const ticketSchema = new Schema<TicketDocument>({
  userId: { type: String, required: true },
  ticketId: { type: String, required: true },
  name: { type: String },

  status: {
    type: String,
    enum: ["open", "closed", "deleted"],
    default: "open",
  },

  department: {
    type: String,
    enum: ["general", "billing", "technical", "advertising", "other"],
    required: true,
  },

  claim: {
    status: { type: Boolean, default: false },
    claimedBy: { type: String },
    claimedAt: { type: Date },
  },

  timestamps: {
    createdAt: { type: Date, default: Date.now },
    attendedToAt: { type: Date },
    closedAt: { type: Date },
    deletedAt: { type: Date },
    firstResponseAt: { type: Date },
    reopenedAt: { type: Date },
  },

  responseTime: { type: Number },
});

const TicketModel: Model<TicketDocument> = model<TicketDocument>(
  "Tickets",
  ticketSchema
);

export default TicketModel;
