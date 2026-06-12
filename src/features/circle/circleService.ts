import { secureApi } from "@/lib/api/secureApi";
import type { CircleMember, CircleRelationship } from "@/types/circle";
import type { AppUser } from "@/types/user";

export async function inviteCircleMember(email: string) {
  const response = await secureApi.post("/circle/invitations", { email });
  return response.data;
}

export async function listCircleMembers(ownerFirebaseUid: string) {
  const response = await secureApi.get<{ members: CircleMember[]; count: number; max: number }>(
    `/circle/${ownerFirebaseUid}`,
  );
  return response.data;
}

export async function listBlockSupport(ownerFirebaseUid: string) {
  const response = await secureApi.get<{ users: AppUser[] }>(`/circle/${ownerFirebaseUid}/block-support`);
  return response.data.users;
}

export async function addCircleMember(payload: {
  ownerFirebaseUid: string;
  memberFirebaseUid: string;
  memberEmail: string;
  memberName: string;
  memberRole: AppUser["role"];
  relationship: CircleRelationship;
}) {
  const response = await secureApi.post<{ member: CircleMember }>("/circle", payload);
  return response.data.member;
}

export async function searchUsers(payload: { email?: string; role?: AppUser["role"] }) {
  const params = new URLSearchParams();

  if (payload.email) {
    params.set("email", payload.email);
  }

  if (payload.role) {
    params.set("role", payload.role);
  }

  const response = await secureApi.get<{ users: AppUser[] }>(`/users/search/list?${params.toString()}`);
  return response.data.users;
}
