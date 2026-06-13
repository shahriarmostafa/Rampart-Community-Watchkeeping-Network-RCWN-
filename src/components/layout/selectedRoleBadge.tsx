"use client";

import { RoleBadge } from "@/components/common/roleBadge";
import { useAuth } from "@/features/auth/useAuth";

export function SelectedRoleBadge() {
  const { role } = useAuth();

  return <RoleBadge role={role} size="xs" />;
}
