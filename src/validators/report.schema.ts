import { z } from "zod";
import { riskLevels } from "@/config/riskLevels";

export const reportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  riskLevel: z.enum(riskLevels),
});

export type ReportInput = z.infer<typeof reportSchema>;
