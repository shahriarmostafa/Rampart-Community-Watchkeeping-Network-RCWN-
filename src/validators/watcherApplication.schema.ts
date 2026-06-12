import { z } from "zod";

export const watcherApplicationSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  gender: z.enum(["female", "male", "other", "prefer_not_to_say"]),
  phone: z.string().min(6, "Enter a reachable phone number."),
  area: z.string().min(2, "Enter your area."),
  address: z.string().optional(),
  blockCode: z.string().optional(),
  blockAreaName: z.string().optional(),
  blockCenter: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  availability: z.string().min(3, "Tell us when you are available."),
  reason: z.string().min(20, "Please share at least 20 characters."),
  experience: z.string().optional(),
  userPhoto: z.custom<File | null>().nullable(),
  idCardPhoto: z.custom<File | null>().nullable(),
});

export type WatcherApplicationInput = z.infer<typeof watcherApplicationSchema>;
