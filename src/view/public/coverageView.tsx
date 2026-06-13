"use client";

import { BatteryLow, Map, RadioTower, Siren, Smartphone, TimerReset } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { PageSection } from "@/components/common/pageSection";
import { PublicFeatureCard } from "@/components/public/publicFeatureCard";

const coverageCards = [
  { icon: Map, title: "Coverage honesty", description: "Users should know when watchers are nearby and when emergency fallback is the safer path." },
  { icon: RadioTower, title: "Risk-based updates", description: "Safe Walk tracking should become more frequent as risk rises from Safe to Danger." },
  { icon: TimerReset, title: "Scheduled check-ins", description: "Conditional alerts cover situations where someone cannot actively start a full Safe Walk." },
  { icon: BatteryLow, title: "Low-battery behavior", description: "The app should send a final location ping before reducing activity." },
  { icon: Smartphone, title: "PWA-first mobile use", description: "Install-to-home-screen keeps the app easy to open quickly during stressful moments." },
  { icon: Siren, title: "Emergency fallback", description: "999, 109, and trusted contacts remain critical when community coverage is unavailable." },
];

export function CoverageView() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />
      <PageSection className="py-14">
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Coverage Model</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">A safety platform must never create false confidence.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          RCWN should clearly show where watcher coverage exists, when the user is relying only on their trusted circle, and when emergency services are the primary fallback.
        </p>
      </PageSection>
      <PageSection className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">{coverageCards.map((card) => <PublicFeatureCard key={card.title} {...card} />)}</div>
      </PageSection>
    </main>
  );
}

