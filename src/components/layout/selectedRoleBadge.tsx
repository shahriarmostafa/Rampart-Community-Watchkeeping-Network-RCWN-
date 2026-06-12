"use client";

import { useAuth } from "@/features/auth/useAuth";

export function SelectedRoleBadge() {
  const { role } = useAuth();

  return <span>{role.replace("_", " ")}</span>;
}
