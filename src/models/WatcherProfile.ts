import { Schema, models, model } from "mongoose";

const watcherProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    communityId: { type: Schema.Types.ObjectId, ref: "Community" },
    bio: String,
    verifiedAt: Date,
  },
  { timestamps: true },
);

export const WatcherProfileModel = models.WatcherProfile ?? model("WatcherProfile", watcherProfileSchema);
