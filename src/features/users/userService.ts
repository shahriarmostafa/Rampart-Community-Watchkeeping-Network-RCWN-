import type { User } from "firebase/auth";
import type { Role } from "@/config/roles";
import { secureApi } from "@/lib/api/secureApi";
import type { AppUser } from "@/types/user";

export type UpdateUserProfilePayload = {
  firebaseUid: string;
  name: string;
  email: string;
  photoUrl?: string;
  address?: string;
  location?: AppUser["location"];
  block?: AppUser["block"];
};

export async function syncAuthenticatedUser(user: User) {
  const response = await secureApi.post<{ user: AppUser }>("/users", {
    firebaseUid: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "RCWN Citizen",
    email: user.email || `${user.uid}@rcwn.local`,
    photoUrl: user.photoURL || undefined,
  });

  return response.data.user;
}

export async function getUserProfile(firebaseUid: string) {
  const response = await secureApi.get<{ user: AppUser }>(`/users/${firebaseUid}`);
  return response.data.user;
}

export async function updateUserProfile(payload: UpdateUserProfilePayload) {
  const response = await secureApi.post<{ user: AppUser }>("/users", payload);
  return response.data.user;
}

export async function listUsers() {
  const response = await secureApi.get<{ users: AppUser[] }>("/users");
  return response.data.users;
}

export async function searchUsers(payload: { email?: string; role?: Role }) {
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

export async function updateUserRole(firebaseUid: string, role: Role) {
  const response = await secureApi.patch<{ user: AppUser }>(`/users/${firebaseUid}/role`, { role });
  return response.data.user;
}
