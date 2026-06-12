import { Schema, models, model } from "mongoose";

const communitySchema = new Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    description: String,
  },
  { timestamps: true },
);

export const CommunityModel = models.Community ?? model("Community", communitySchema);
