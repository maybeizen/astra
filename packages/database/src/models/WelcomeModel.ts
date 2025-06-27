import mongoose, { Schema } from "mongoose";

const embedSchema = new Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  image: { type: String, required: false },
  color: { type: String, required: false },
});

const welcomeContentSchema = new Schema({
  enabled: { type: Boolean, required: true, default: false },
  content: { type: String, default: null },
  embed: { type: embedSchema, default: null },
});

const welcomeSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    type: {
      type: String,
      enum: ["message", "embed", "card"],
      required: true,
    },
    message: { type: welcomeContentSchema, required: true },
    dm: { type: welcomeContentSchema, required: true },
    card: {
      type: new Schema({
        ...welcomeContentSchema.obj,
        imageUrl: { type: String, required: false },
        showCount: { type: Boolean, required: false, default: false },
        cardMessage: { type: String, required: false },
      }),
      required: true,
    },
    createdAt: { type: Date, required: true, default: () => new Date() },
    updatedAt: { type: Date, required: true, default: () => new Date() },
  },
  {
    collection: "welcomes",
  }
);

welcomeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const WelcomeModel = mongoose.model("Welcome", welcomeSchema);
