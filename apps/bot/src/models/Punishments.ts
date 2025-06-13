const { Schema, model } = require("mongoose");

const punishmentSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["BAN", "MUTE", "WARNING"], required: true },
  reason: { type: String, required: true },
  moderatorId: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  durationMs: { type: Number, default: null },
  expiresAt: { type: Date, default: null },
  revoked: { type: Boolean, default: false },
});

module.exports = model("Punishment", punishmentSchema);
