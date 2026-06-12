import { Schema, models, model } from "mongoose";

const circleMemberSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    memberEmail: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export const CircleMemberModel = models.CircleMember ?? model("CircleMember", circleMemberSchema);
