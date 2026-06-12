import { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
    photoUrl: String,
  },
  { timestamps: true },
);

export const UserModel = models.User ?? model("User", userSchema);
