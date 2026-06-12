import { Schema, models, model } from "mongoose";

const safeWalkSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "idle" },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true },
);

export const SafeWalkSessionModel =
  models.SafeWalkSession ?? model("SafeWalkSession", safeWalkSessionSchema);
