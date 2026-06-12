"use client";

import Link from "next/link";
import type { Role } from "@/config/roles";
import { selectedRoleStorageKey } from "@/hooks/useSelectedRole";

const users = [
  { name: "Nadia Anjum", role: "citizen", href: "/home?role=citizen", label: "Citizen" },
  { name: "Farzana Naznin", role: "watcher", href: "/nearby-walks?role=watcher", label: "Watcher" },
  { name: "Tania Karim", role: "truth_keeper", href: "/verification-center?role=truth_keeper", label: "Truth Keeper" },
  { name: "Shahnaz Begum", role: "guardian", href: "/oversight?role=guardian", label: "Community Guardian" },
] satisfies Array<{ name: string; role: Role; href: string; label: string }>;

export function RoleExplorer() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {users.map((user) => (
        <Link href={user.href} key={user.name}>
          <div
            className="min-h-36 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            onClick={() => window.localStorage.setItem(selectedRoleStorageKey, user.role)}
          >
            <div className="text-lg font-bold text-slate-950">{user.name}</div>
            <p className="mt-2 text-sm text-slate-500">Explore the app as a {user.label.toLowerCase()}.</p>
            <span className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
              {user.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
