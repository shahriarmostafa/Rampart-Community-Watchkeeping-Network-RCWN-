"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Search, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Role } from "@/config/roles";
import { listUsers, searchUsers, updateUserRole } from "@/features/users/userService";
import type { AppUser } from "@/types/user";

const roleOptions: Array<{ label: string; value: Role }> = [
  { label: "Citizen", value: "citizen" },
  { label: "Watcher", value: "watcher" },
  { label: "Truth Keeper", value: "truth_keeper" },
  { label: "Guardian", value: "guardian" },
];

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function UserRolesAdminView() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"" | Role>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadUsers() {
    setIsLoading(true);
    try {
      setUsers(await listUsers());
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load users.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch() {
    setIsLoading(true);
    try {
      setUsers(await searchUsers({ email, role: role || undefined }));
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not search users.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRoleChange(user: AppUser, nextRole: Role) {
    if (!user.firebaseUid) {
      setMessage("This user does not have a Firebase UID.");
      return;
    }

    try {
      const updated = await updateUserRole(user.firebaseUid, nextRole);
      setUsers((current) => current.map((item) => (item.firebaseUid === updated.firebaseUid ? updated : item)));
      setMessage(`${updated.name} is now ${updated.role.replace("_", " ")}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update user role.");
    }
  }

  useEffect(() => {
    window.setTimeout(() => {
      void loadUsers();
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Admin roles</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">User role management</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Search users and set their app role. The installed app navigation and permissions update from this backend role.
            </p>
          </div>
          <Button className="gap-2" onClick={loadUsers} type="button" variant="secondary">
            <RefreshCcw aria-hidden className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <Input onChange={(event) => setEmail(event.target.value)} placeholder="Search by email" value={email} />
            <select
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              onChange={(event) => setRole(event.target.value as "" | Role)}
              value={role}
            >
              <option value="">All roles</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button className="gap-2" disabled={isLoading} onClick={handleSearch} type="button">
              <Search aria-hidden className="h-4 w-4" />
              Search
            </Button>
          </div>
        </section>

        {message ? <p className="mt-5 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}

        <section className="mt-6 grid gap-3">
          {isLoading ? <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading users...</div> : null}
          {!isLoading && !users.length ? <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No users found.</div> : null}
          {users.map((user) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={user.firebaseUid || user.email}>
              <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-teal-50 text-sm font-bold text-teal-800">
                    {initialsFor(user.name)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-950">{user.name}</h2>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <ShieldCheck aria-hidden className="h-3 w-3 text-teal-700" />
                      Current role: {user.role.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Set role
                  <select
                    className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold capitalize text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    onChange={(event) => void handleRoleChange(user, event.target.value as Role)}
                    value={user.role}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
