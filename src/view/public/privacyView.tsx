"use client";

import { DatabaseZap, EyeOff, FileLock2, ListChecks, LockKeyhole, ShieldAlert } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { PageSection } from "@/components/common/pageSection";
import { PublicFeatureCard } from "@/components/public/publicFeatureCard";

const privacyCards = [
  { icon: LockKeyhole, title: "Data minimization", description: "Collect only what each safety feature requires, especially for location and evidence." },
  { icon: DatabaseZap, title: "Automatic deletion", description: "Safe Walk location trails are designed to disappear shortly after journey completion." },
  { icon: EyeOff, title: "Restricted visibility", description: "Watchers and guardians should see only the information needed for the specific case." },
  { icon: ListChecks, title: "Auditable access", description: "Every sensitive data access should be logged and reviewable once backend systems are added." },
  { icon: FileLock2, title: "Evidence ownership", description: "The Evidence Vault belongs to the user; sharing should be explicit and controlled." },
  { icon: ShieldAlert, title: "Honest limits", description: "RCWN should explain lawful disclosure limits rather than overpromising absolute anonymity." },
];

export function PrivacyView() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />
      <PageSection className="py-14">
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Privacy</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">Sensitive safety data deserves stronger boundaries.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          A safety app can expose location, fear, witnesses, evidence, and vulnerable relationships. RCWN treats privacy as a core safety feature, not a policy page afterthought.
        </p>
      </PageSection>
      <PageSection className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">{privacyCards.map((card) => <PublicFeatureCard key={card.title} {...card} />)}</div>
      </PageSection>
    </main>
  );
}

