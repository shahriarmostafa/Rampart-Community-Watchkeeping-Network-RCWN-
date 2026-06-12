import { secureApi } from "@/lib/api/secureApi";
import type { RiskLevel, SafeWalkSession, SafeWalkSessionPublic, SafeWalkShareWith } from "@/types/safeWalk";

type StartPayload = {
  firebaseUid: string;
  userName?: string;
  startAddress?: string;
  destinationAddress?: string;
  blockCode?: string;
  location?: { lat: number; lng: number };
  shareWith: SafeWalkShareWith;
};

export async function startSafeWalk(payload: StartPayload) {
  const response = await secureApi.post<{ session: SafeWalkSession }>("/safe-walk/sessions", payload);
  return response.data.session;
}

export async function updateSessionLocation(
  sessionId: string,
  location: { lat: number; lng: number },
  blockCode?: string,
) {
  const response = await secureApi.patch<{ session: SafeWalkSession }>(
    `/safe-walk/${sessionId}/location`,
    { ...location, blockCode },
  );
  return response.data.session;
}

export async function updateSessionRisk(sessionId: string, riskLevel: RiskLevel) {
  const response = await secureApi.patch<{ session: SafeWalkSession }>(
    `/safe-walk/${sessionId}/risk`,
    { riskLevel },
  );
  return response.data.session;
}

export async function completeSession(sessionId: string) {
  const response = await secureApi.patch<{ session: SafeWalkSession }>(
    `/safe-walk/${sessionId}/complete`,
    {},
  );
  return response.data.session;
}

export async function getActiveSession(firebaseUid: string) {
  const response = await secureApi.get<{ session: SafeWalkSession | null }>(
    `/safe-walk/active?firebaseUid=${encodeURIComponent(firebaseUid)}`,
  );
  return response.data.session;
}

export async function getBlockSessions(blockCode: string) {
  const response = await secureApi.get<{ sessions: SafeWalkSessionPublic[] }>(
    `/safe-walk/block/${encodeURIComponent(blockCode)}`,
  );
  return response.data.sessions;
}

export async function getSessionDetail(sessionId: string) {
  const response = await secureApi.get<{ session: SafeWalkSession }>(`/safe-walk/${sessionId}`);
  return response.data.session;
}
