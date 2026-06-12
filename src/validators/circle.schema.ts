import { z } from "zod";

export const circleInviteSchema = z.object({
  email: z.email(),
});

export type CircleInviteInput = z.infer<typeof circleInviteSchema>;
