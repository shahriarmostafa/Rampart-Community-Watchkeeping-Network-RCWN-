"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import type { Role } from "@/config/roles";
import { useAuth } from "@/features/auth/useAuth";

const roleRank: Record<Role, number> = {
  citizen: 1,
  watcher: 2,
  truth_keeper: 3,
  guardian: 4,
};

export function RoleGate({
  minimumRole,
  children,
}: {
  minimumRole: Role;
  children: ReactNode;
}) {
  const { role } = useAuth();

  if (roleRank[role] >= roleRank[minimumRole]) {
    return children;
  }

  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <ShieldAlert aria-hidden className="mx-auto h-10 w-10 text-amber-600" />
        <h1 className="mt-4 text-xl font-bold text-slate-950">Role access needed</h1>
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          This page is available for {minimumRole.replace("_", " ")} users and above.
        </p>
        <Link className="mt-5 inline-flex text-sm font-bold text-teal-700" href="/">
          Back to user selector
        </Link>
      </div>
    </div>
  );
}
