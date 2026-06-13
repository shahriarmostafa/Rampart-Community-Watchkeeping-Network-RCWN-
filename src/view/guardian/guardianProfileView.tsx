"use client";

import { Award, Building, ClipboardCheck, ShieldCheck, Star, Users } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { PersonRow } from "@/components/common/personRow";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { StatusFlow } from "@/components/common/statusFlow";
import { ProfileHero } from "@/components/profile/profileHero";

export function GuardianProfileView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Community Guardian" subtitle="Reliability layer." />
      <ProfileHero initials="SB" label="Community Guardian" name="Shahnaz Begum" detail="Pallabi, Mirpur - Guardian since 2022" tone="purple" />
      <NoticeBanner icon={Award} tone="guardian">
        Community Guardians guide watchers, review serious reports, and protect the platform from misuse.
      </NoticeBanner>
      <SectionLabel>Role & Responsibilities</SectionLabel>
      <AppCard>
        <PersonRow initials="12" name="Guides 12 watchers" detail="Mentorship and oversight in Mirpur zone" meta={<Users className="h-5 w-5 text-violet-700" />} />
        <div className="my-3 border-t border-slate-100" />
        <PersonRow initials="R" name="Reviews serious reports" detail="Adds reliability before escalation" meta={<ClipboardCheck className="h-5 w-5 text-blue-800" />} />
        <div className="my-3 border-t border-slate-100" />
        <PersonRow initials="M" name="Prevents misuse" detail="Protects against false accusations and bad-faith reports" meta={<ShieldCheck className="h-5 w-5 text-yellow-700" />} />
      </AppCard>
      <SectionLabel>How Watchers Are Vetted</SectionLabel>
      <AppCard>
        <StatusFlow
          steps={[
            { title: "Background check", description: "Official channels plus NGO and community references", state: "done" },
            { title: "In-person verification", description: "A Guardian meets the candidate before approval", state: "done" },
            { title: "Guardian reference", description: "At least one senior Guardian vouches for character", state: "done" },
            { title: "6-month supervised probation", description: "Limited data access and audited first cases", state: "done" },
            { title: "Ongoing access audits", description: "Unusual access patterns are flagged", state: "active" },
          ]}
        />
      </AppCard>
      <SectionLabel>Endorsements</SectionLabel>
      <AppCard className="flex flex-wrap gap-2">
        <AppChip tone="navy">
          <Building aria-hidden className="h-3 w-3" />
          NGO Verified
        </AppChip>
        <AppChip tone="teal">Ain o Salish Kendra</AppChip>
        <AppChip tone="gold">
          <Star aria-hidden className="h-3 w-3" />
          Senior Trusted
        </AppChip>
      </AppCard>
    </div>
  );
}

