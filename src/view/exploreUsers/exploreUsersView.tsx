"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { RoleBadge } from "@/components/common/roleBadge";
import { selectedRoleStorageKey } from "@/hooks/useSelectedRole";
import type { Role } from "@/config/roles";

const users = [
  { name: "Nadia Anjum", role: "citizen", href: "/home?role=citizen", label: "Citizen" },
  { name: "Farzana Naznin", role: "watcher", href: "/nearby-walks?role=watcher", label: "Watcher" },
  { name: "Tania Karim", role: "truth_keeper", href: "/verification-center?role=truth_keeper", label: "Truth Keeper" },
  { name: "Shahnaz Begum", role: "guardian", href: "/oversight?role=guardian", label: "Community Guardian" },
] satisfies Array<{ name: string; role: Role; href: string; label: string }>;

export function ExploreUsersView() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-8">
        <section>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-700 text-white">
              <ShieldCheck aria-hidden className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold text-slate-950">RCWN</p>
              <p className="text-sm text-slate-500">Community Safety Network</p>
            </div>
          </div>
          <h1 className="mt-8 max-w-xl text-4xl font-bold text-slate-950 md:text-5xl">Explore role-based app views</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Routes stay feature-based. Roles unlock capabilities, menus, and actions inside those shared routes.
          </p>
        </section>
        <section className="grid gap-3 sm:grid-cols-2">
          {users.map((user) => (
            <Link href={user.href} key={user.name}>
              <AppCard
                className="min-h-36 transition hover:border-teal-300 hover:shadow-md"
                onClick={() => window.localStorage.setItem(selectedRoleStorageKey, user.role)}
              >
                <div className="text-lg font-bold text-slate-950">{user.name}</div>
                <p className="mt-2 text-sm text-slate-500">Preview allowed pages and capabilities.</p>
                <RoleBadge className="mt-4" role={user.role} />
              </AppCard>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
