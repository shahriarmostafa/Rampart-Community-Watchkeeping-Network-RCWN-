import type { Role } from "@/config/roles";

export type CircleRelationship = "family" | "friend" | "authority";

export type CircleMember = {
  _id: string;
  ownerFirebaseUid: string;
  memberFirebaseUid: string;
  memberEmail: string;
  memberName: string;
  memberRole: Role;
  relationship: CircleRelationship;
  status: "active" | "pending";
};
