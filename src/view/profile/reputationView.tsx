import type { LucideIcon } from "lucide-react";
import { Award, ShieldCheck, Star, ThumbsUp } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { ProfileHero } from "@/components/profile/profileHero";

const badges: Array<{ title: string; detail: string; icon: LucideIcon }> = [
  { title: "Community Protector", detail: "50+ verified assists", icon: ShieldCheck },
  { title: "Safe Walk Guardian", detail: "100 walks watched", icon: ShieldCheck },
  { title: "Reliable Responder", detail: "High survivor satisfaction", icon: ThumbsUp },
  { title: "Trusted Verifier", detail: "120+ careful verifications", icon: ShieldCheck },
  { title: "Guardian Endorsed", detail: "3 Guardian endorsements", icon: Award },
  { title: "Senior Watcher", detail: "Top tier reached", icon: Star },
];

export function ReputationView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Watcher Profile" subtitle="Reputation and badges." />
      <ProfileHero initials="FN" label="Senior Watcher" name="Farzana Naznin" detail="Mirpur Zone - Endorsed by 3 Guardians" tone="purple" />
      <AppCard className="text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[conic-gradient(#d4a13a_94%,#ece3fd_0)]">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
            <div>
              <div className="text-2xl font-bold text-slate-950">94</div>
              <div className="text-[10px] font-bold text-slate-500">TRUST</div>
            </div>
          </div>
        </div>
      </AppCard>
      <NoticeBanner icon={Award} tone="guardian">
        Reputation is quality-based, not volume-based. Scores reflect feedback, endorsements, and verified outcomes.
      </NoticeBanner>
      <SectionLabel>Badges & Achievements</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
          <AppCard className="text-center" key={badge.title}>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-teal-50 text-teal-700">
              <Icon aria-hidden className="h-6 w-6" />
            </span>
            <div className="mt-3 text-sm font-bold text-slate-950">{badge.title}</div>
            <div className="mt-1 text-xs text-slate-500">{badge.detail}</div>
          </AppCard>
          );
        })}
      </div>
    </div>
  );
}
