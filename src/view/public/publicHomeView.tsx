"use client";

import Link from "next/link";
import { FileCheck2, HeartHandshake, LockKeyhole, MapPinned, RadioTower, ShieldCheck, Siren, UsersRound } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { PageSection } from "@/components/common/pageSection";
import { PublicFeatureCard } from "@/components/public/publicFeatureCard";
import { PwaInstallPanel } from "@/components/public/pwaInstallPanel";
import { PwaInstallButton } from "@/components/public/pwaInstallButton";
import { RoleExplorer } from "@/components/public/roleExplorer";

const features = [
  {
    icon: MapPinned,
    title: "Safe Walk",
    description: "Share a live journey with trusted people and nearby watchers, with risk levels from Safe to Danger.",
  },
  {
    icon: FileCheck2,
    title: "Protected Reports",
    description: "File safety reports without creating public accusations. Verification happens before any escalation.",
  },
  {
    icon: RadioTower,
    title: "Watcher Support",
    description: "Watchers support nearby Safe Walk requests, observe safely, and call for help without confrontation.",
  },
  {
    icon: ShieldCheck,
    title: "Truth Keeper Verification",
    description: "Truth Keepers review missing reports, assault reports, evidence, and sensitive case consistency.",
  },
  {
    icon: HeartHandshake,
    title: "Support Partners",
    description: "Legal aid, counseling, medical help, shelter, and police referral are coordinated with survivor consent.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy Controls",
    description: "Location trails, evidence, identity, and case details are treated as sensitive safety data.",
  },
];

export function PublicHomeView() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />
      <PageSection className="grid gap-10 py-14 md:grid-cols-[1fr_0.92fr] md:items-center">
        <section>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">RCWN Community Safety Network</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-slate-950 md:text-6xl">
            Safety infrastructure for people, witnesses, and communities.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            RCWN helps someone ask for help before danger escalates. It combines Safe Walk monitoring, protected reports, truth-focused verification, and support referrals without turning the platform into social media or vigilantism.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PwaInstallButton />
            <Link className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900" href="/mission">
              Read Mission
            </Link>
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3">
            {[
              ["Protect First", "Immediate safety support before bureaucracy."],
              ["Verify Before Publicity", "No report becomes a public accusation."],
              ["Support Before Escalation", "Survivor consent shapes the next step."],
              ["Coverage Honesty", "Fallback to 999, 109, and trusted contacts."],
            ].map(([title, detail]) => (
              <div className="rounded-md bg-slate-50 p-4" key={title}>
                <div className="font-bold text-slate-950">{title}</div>
                <div className="mt-1 text-sm text-slate-500">{detail}</div>
              </div>
            ))}
          </div>
        </section>
      </PageSection>

      <PageSection className="pt-0" id="download">
        <PwaInstallPanel />
      </PageSection>

      <PageSection className="pt-0">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-950">Built from the safety model outward</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The public website explains the mission. Once installed, the PWA opens role-based app screens for citizens, watchers, truth keepers, and community guardians.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">{features.map((feature) => <PublicFeatureCard key={feature.title} {...feature} />)}</div>
      </PageSection>

      <PageSection>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Siren aria-hidden className="h-6 w-6 text-rose-700" />
            <h3 className="mt-4 font-bold text-slate-950">Emergency-aware</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">RCWN does not replace emergency services. It guides users to 999 and 109 when the situation or coverage requires it.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <UsersRound aria-hidden className="h-6 w-6 text-blue-800" />
            <h3 className="mt-4 font-bold text-slate-950">Human network</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Citizens, watchers, truth keepers, guardians, support partners, and platform authority each have bounded responsibilities.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <ShieldCheck aria-hidden className="h-6 w-6 text-teal-700" />
            <h3 className="mt-4 font-bold text-slate-950">Abuse-resistant</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Lifestyle complaints, public shaming, doxxing, and private-life policing are outside the product mission.</p>
          </div>
        </div>
      </PageSection>

      <PageSection className="py-14" id="explore">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-950">Preview installed app roles</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            These buttons simulate users for now. Later, the backend will provide the authenticated user role.
          </p>
        </div>
        <RoleExplorer />
      </PageSection>
    </main>
  );
}

