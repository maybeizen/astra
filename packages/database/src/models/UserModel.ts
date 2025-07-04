import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  discordUsername: {
    type: String,
    required: true,
  },
  discordAvatar: {
    type: String,
    required: false,
  },
  discordEmail: {
    type: String,
    required: false,
  },
  discordAccessToken: {
    type: String,
    required: false,
  },
  discordRefreshToken: {
    type: String,
    required: false,
  },
  discordTokenExpires: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const UserModel = mongoose.model("User", userSchema);
