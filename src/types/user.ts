import type { Role } from "@/config/roles";

export type AppUser = {
  _id?: string;
  id?: string;
  firebaseUid?: string;
  name: string;
  email: string;
  role: Role;
  photoUrl?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  block?: {
    blockCode: string;
    areaName: string;
    center: {
      lat: number;
      lng: number;
    };
  };
};
