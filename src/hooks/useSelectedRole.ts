"use client";

import { useCallback, useEffect, useState } from "react";
import { roles, type Role } from "@/config/roles";

export const selectedRoleStorageKey = "rcwn:selected-role";

function isRole(value: string | null): value is Role {
  return Boolean(value && roles.includes(value as Role));
}

export function useSelectedRole() {
  const [role, setRoleState] = useState<Role>("citizen");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryRole = params.get("role");
    const storedRole = window.localStorage.getItem(selectedRoleStorageKey);
    const nextRole = isRole(queryRole) ? queryRole : isRole(storedRole) ? storedRole : "citizen";

    window.localStorage.setItem(selectedRoleStorageKey, nextRole);
    window.setTimeout(() => setRoleState(nextRole), 0);
  }, []);

  const setRole = useCallback((nextRole: Role) => {
    window.localStorage.setItem(selectedRoleStorageKey, nextRole);
    setRoleState(nextRole);
  }, []);

  return { role, setRole };
}
