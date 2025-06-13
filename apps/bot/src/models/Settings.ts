const { Schema, model } = require("mongoose");

const settingsSchema = new Schema({
  guildId: { type: String },
  commandsCount: { type: Number, default: 0 },
});
