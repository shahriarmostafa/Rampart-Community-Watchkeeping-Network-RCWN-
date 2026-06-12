import { Schema, models, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    readAt: Date,
  },
  { timestamps: true },
);

export const NotificationModel = models.Notification ?? model("Notification", notificationSchema);
