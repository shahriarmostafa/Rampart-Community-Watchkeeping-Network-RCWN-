import { z } from "zod";

export const locationUpdateSchema = z.object({
  sessionId: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
