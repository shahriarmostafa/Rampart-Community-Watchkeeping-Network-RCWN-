import { Schema, models, model } from "mongoose";

const locationUpdateSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "SafeWalkSession", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true },
);

export const LocationUpdateModel =
  models.LocationUpdate ?? model("LocationUpdate", locationUpdateSchema);
