export type WatcherApplicationStatus = "pending" | "approved" | "rejected";

export type WatcherApplication = {
  _id: string;
  userId: string;
  firebaseUid: string;
  fullName: string;
  gender: "female" | "male" | "other" | "prefer_not_to_say";
  phone: string;
  area: string;
  address?: string;
  blockCode?: string;
  blockAreaName?: string;
  blockCenter?: {
    lat: number;
    lng: number;
  };
  reason: string;
  availability: string;
  experience?: string;
  userPhotoUrl?: string;
  idCardPhotoUrl?: string;
  userPhotoFileName?: string;
  idCardPhotoFileName?: string;
  status: WatcherApplicationStatus;
  reviewNote?: string;
  createdAt?: string;
};
