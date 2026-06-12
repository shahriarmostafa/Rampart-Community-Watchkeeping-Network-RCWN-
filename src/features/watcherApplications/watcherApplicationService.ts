import { publicApi } from "@/lib/api/publicApi";
import { secureApi } from "@/lib/api/secureApi";
import type { WatcherApplication, WatcherApplicationStatus } from "@/types/watcherApplication";

export type CreateWatcherApplicationPayload = {
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
  userPhotoFileName?: string;
  idCardPhotoFileName?: string;
};

export async function submitWatcherApplication(payload: CreateWatcherApplicationPayload) {
  const response = await secureApi.post<{ application: WatcherApplication }>("/watcher-applications", payload);
  return response.data.application;
}

export async function listWatcherApplications() {
  const response = await publicApi.get<{ applications: WatcherApplication[] }>("/watcher-applications");
  return response.data.applications;
}

export async function reviewWatcherApplication(
  applicationId: string,
  status: Exclude<WatcherApplicationStatus, "pending">,
  reviewNote?: string,
) {
  const response = await publicApi.patch<{ application: WatcherApplication }>(
    `/watcher-applications/${applicationId}/review`,
    { status, reviewNote },
  );
  return response.data.application;
}
