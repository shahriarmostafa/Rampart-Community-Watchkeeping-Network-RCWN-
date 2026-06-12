"use client";

import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Role } from "@/config/roles";
import { useAuth } from "@/features/auth/useAuth";
import { addCircleMember, searchUsers } from "@/features/circle/circleService";
import type { CircleRelationship } from "@/types/circle";
import type { AppUser } from "@/types/user";

const roleOptions: Array<{ label: string; value: "" | Role }> = [
  { label: "All user types", value: "" },
  { label: "Citizens", value: "citizen" },
  { label: "Watchers", value: "watcher" },
  { label: "Truth Keepers", value: "truth_keeper" },
  { label: "Guardians", value: "guardian" },
];

const relationshipOptions: Array<{ label: string; value: CircleRelationship; detail: string }> = [
  { label: "Family", value: "family", detail: "Close relatives and household contacts." },
  { label: "Friend", value: "friend", detail: "Trusted personal contacts." },
  { label: "Authority", value: "authority", detail: "Watchers, truth keepers, guardians, or verified authority users." },
];

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function AddCircleMemberView() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"" | Role>("");
  const [relationship, setRelationship] = useState<CircleRelationship>("family");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch() {
    setIsSearching(true);
    try {
      setUsers(await searchUsers({ email, role: role || undefined }));
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not search users.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleAdd(member: AppUser) {
    if (!user || !member.firebaseUid) {
      return;
    }

    try {
      await addCircleMember({
        ownerFirebaseUid: user.uid,
        memberFirebaseUid: member.firebaseUid,
        memberEmail: member.email,
        memberName: member.name,
        memberRole: member.role,
        relationship,
      });
      setMessage(`${member.name} added as ${relationship}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add member.");
    }
  }

  return (
    <div className="grid gap-4">
      <RouteHeader title="Add Member" subtitle="Search by email or browse by user type, then choose how this person belongs in your circle." />
      <AppCard>
        <SectionLabel>Relationship type</SectionLabel>
        <div className="mt-3 grid gap-2">
          {relationshipOptions.map((option) => (
            <button
              className={`rounded-lg border p-3 text-left transition ${
                relationship === option.value ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white"
              }`}
              key={option.value}
              onClick={() => setRelationship(option.value)}
              type="button"
            >
              <div className="text-sm font-bold text-slate-950">{option.label}</div>
              <div className="mt-1 text-xs text-slate-500">{option.detail}</div>
            </button>
          ))}
        </div>
      </AppCard>
      <AppCard>
        <SectionLabel>Find user</SectionLabel>
        <div className="mt-3 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-slate-900">
            Email
            <Input onChange={(event) => setEmail(event.target.value)} placeholder="person@example.com" value={email} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-900">
            User type
            <select
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              onChange={(event) => setRole(event.target.value as "" | Role)}
              value={role}
            >
              {roleOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Button className="gap-2" disabled={isSearching} onClick={handleSearch} type="button">
            <Search aria-hidden className="h-4 w-4" />
            {isSearching ? "Searching..." : "Search users"}
          </Button>
        </div>
      </AppCard>
      {message ? <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}
      <SectionLabel>Search results</SectionLabel>
      <div className="grid gap-3">
        {users.map((member) => (
          <AppCard key={member.firebaseUid || member.email}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-blue-50 text-sm font-bold text-blue-800">
                {initialsFor(member.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">{member.name}</h2>
                    <p className="mt-1 text-xs text-slate-500">{member.email}</p>
                  </div>
                  <AppChip tone={member.role === "guardian" ? "purple" : member.role === "watcher" ? "teal" : "navy"}>
                    {member.role.replace("_", " ")}
                  </AppChip>
                </div>
                <Button className="mt-3 h-10 w-full gap-2" onClick={() => void handleAdd(member)} type="button" variant="secondary">
                  <UserPlus aria-hidden className="h-4 w-4" />
                  Add as {relationship}
                </Button>
              </div>
            </div>
          </AppCard>
        ))}
        {!users.length ? (
          <AppCard>
            <p className="text-sm text-slate-500">Search by email or choose a user type to find members.</p>
          </AppCard>
        ) : null}
      </div>
    </div>
  );
}
