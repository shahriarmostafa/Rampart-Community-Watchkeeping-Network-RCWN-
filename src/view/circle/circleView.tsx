"use client";

import Link from "next/link";
import { Plus, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { listBlockSupport, listCircleMembers } from "@/features/circle/circleService";
import type { CircleMember, CircleRelationship } from "@/types/circle";
import type { AppUser } from "@/types/user";

const relationshipLabels: Record<CircleRelationship, string> = {
  family: "Family",
  friend: "Friends",
  authority: "Authorities",
};

const relationshipDescriptions: Record<CircleRelationship, string> = {
  family: "People closest to you who can respond quickly.",
  friend: "Trusted peers and contacts you choose.",
  authority: "Watchers, truth keepers, guardians, or verified authority users.",
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function CircleView() {
  const { user } = useAuth();
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [blockSupport, setBlockSupport] = useState<AppUser[]>([]);
  const [max, setMax] = useState(15);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    window.setTimeout(() => {
      void listCircleMembers(user.uid)
        .then((data) => {
          setMembers(data.members);
          setMax(data.max);
        })
        .catch((error: unknown) => {
          setMessage(error instanceof Error ? error.message : "Could not load circle members.");
        });
      void listBlockSupport(user.uid)
        .then(setBlockSupport)
        .catch(() => undefined);
    }, 0);
  }, [user]);

  const groupedMembers = useMemo(() => {
    return {
      family: members.filter((member) => member.relationship === "family"),
      friend: members.filter((member) => member.relationship === "friend"),
      authority: members.filter((member) => member.relationship === "authority"),
    };
  }, [members]);

  return (
    <div className="circle-page grid gap-4">
      <RouteHeader
        title="My Circle"
        subtitle="Family, friends, and trusted authority users who can receive alerts or support your safety workflows."
        action={
          <Link href="/circle/add">
            <Button className="h-10 gap-2 px-3">
              <Plus aria-hidden className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
        }
      />
      <NoticeBanner icon={UsersRound} tone="guardian">
        <span className="font-bold">{members.length}</span> of <span className="font-bold">{max}</span> circle members added.
      </NoticeBanner>
      {message ? <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}
      {(Object.keys(groupedMembers) as CircleRelationship[]).map((relationship) => (
        <section className="grid gap-3" key={relationship}>
          <SectionLabel>{relationshipLabels[relationship]}</SectionLabel>
          <p className="px-1 text-xs leading-5 text-slate-500">{relationshipDescriptions[relationship]}</p>
          {groupedMembers[relationship].length ? (
            <div className="grid gap-3">
              {groupedMembers[relationship].map((member) => (
                <AppCard className="circle-member-box" key={member._id}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-blue-50 text-sm font-bold text-blue-800">
                      {initialsFor(member.memberName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-sm font-bold text-slate-950">{member.memberName}</h2>
                          <p className="mt-1 text-xs text-slate-500">{member.memberEmail}</p>
                        </div>
                        <AppChip tone={member.memberRole === "guardian" ? "purple" : member.memberRole === "watcher" ? "teal" : "navy"}>
                          {member.memberRole.replace("_", " ")}
                        </AppChip>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <ShieldCheck aria-hidden className="h-4 w-4 text-teal-700" />
                        {member.status}
                      </div>
                    </div>
                  </div>
                </AppCard>
              ))}
            </div>
          ) : (
            <AppCard>
              <p className="text-sm text-slate-500">No {relationshipLabels[relationship].toLowerCase()} added yet.</p>
            </AppCard>
          )}
        </section>
      ))}
      <section className="grid gap-3">
        <SectionLabel>Block Support</SectionLabel>
        <p className="px-1 text-xs leading-5 text-slate-500">
          Watchers, truth keepers, and guardians from your saved block appear automatically and do not count toward your 15 personal circle members.
        </p>
        {blockSupport.length ? (
          <div className="grid gap-3">
            {blockSupport.map((member) => (
              <AppCard className="circle-member-box" key={member.firebaseUid || member.email}>
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-teal-50 text-sm font-bold text-teal-800">
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
                    <p className="mt-3 text-xs font-semibold text-slate-600">
                      Block {member.block?.blockCode || "not set"}
                    </p>
                  </div>
                </div>
              </AppCard>
            ))}
          </div>
        ) : (
          <AppCard>
            <p className="text-sm text-slate-500">No approved block support users are available in your block yet.</p>
          </AppCard>
        )}
      </section>
    </div>
  );
}
