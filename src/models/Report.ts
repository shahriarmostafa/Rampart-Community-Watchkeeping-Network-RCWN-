import { Schema, models, model } from "mongoose";

const reportSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    riskLevel: { type: String, required: true },
    reporterId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const ReportModel = models.Report ?? model("Report", reportSchema);
