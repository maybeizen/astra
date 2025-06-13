import { Schema, model, Document, Model } from "mongoose";
import { type User as UserProps } from "../../types/global";

export interface UserDocument extends UserProps, Document {}

const userSchema = new Schema<UserDocument>({
  userId: { type: String, required: true, unique: true },
  isStaff: { type: Boolean, default: false },
  timestamps: {
    joinedAt: { type: Date },
    leftAt: { type: Date },
    createdAt: { type: Date },
  },
});

const UserModel: Model<UserDocument> = model<UserDocument>("Users", userSchema);

export default UserModel;
