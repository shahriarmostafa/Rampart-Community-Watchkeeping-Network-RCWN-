"use client";

import { CheckCircle2, HeartHandshake, ShieldCheck, UsersRound } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { PageSection } from "@/components/common/pageSection";
import { PublicFeatureCard } from "@/components/public/publicFeatureCard";

const missionCards = [
  { icon: ShieldCheck, title: "No public accusations", description: "Reports are handled as private safety signals, not social posts or verdicts." },
  { icon: HeartHandshake, title: "Survivor-controlled support", description: "Outreach happens through safe channels and with consent except in immediate life-threatening danger." },
  { icon: UsersRound, title: "Community responsibility", description: "Citizens, watchers, truth keepers, guardians, and support partners share bounded responsibilities." },
  { icon: CheckCircle2, title: "Human-centered verification", description: "The goal is to determine whether support is needed, not to decide guilt or shame anyone publicly." },
];

export function MissionView() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />
      <PageSection className="py-14">
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Mission</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">Close the gap between â€œI am in dangerâ€ and â€œsomeone is helping.â€</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          RCWN exists because many people never report harassment, stalking, domestic violence, assault risk, or unsafe travel situations. The platform creates private, structured, abuse-resistant pathways for help before harm escalates.
        </p>
      </PageSection>
      <PageSection className="pt-0">
        <div className="grid gap-4 md:grid-cols-2">{missionCards.map((card) => <PublicFeatureCard key={card.title} {...card} />)}</div>
      </PageSection>
    </main>
  );
}

