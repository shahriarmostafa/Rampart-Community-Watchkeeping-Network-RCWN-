import type { Role } from "@/config/roles";

export type AppUser = {
  _id?: string;
  id?: string;
  firebaseUid?: string;
  name: string;
  email: string;
  role: Role;
  dutyStatus?: "on_duty" | "off_duty";
  photoUrl?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  block?: {
    blockCode: string;
    areaName: string;
    displayAddress?: string;
    placeName?: string;
    neighbourhood?: string;
    city?: string;
    postcode?: string;
    center: {
      lat: number;
      lng: number;
    };
  };
};
