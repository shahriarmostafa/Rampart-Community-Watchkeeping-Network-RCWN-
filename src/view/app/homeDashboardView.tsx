"use client";

import { Bell, ClipboardList, FileText, MapPinned, SearchCheck, ShieldCheck, UserCircle } from "lucide-react";
import { QuickActionGrid } from "@/components/common/quickActionGrid";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { useAuth } from "@/features/auth/useAuth";

const citizenActions = [
  { label: "Safe Walk", detail: "Share live journey", href: "/safe-walk", icon: MapPinned, tone: "teal" as const },
  { label: "File Report", detail: "Concern or missing case", href: "/concerns", icon: FileText, tone: "blue" as const },
  { label: "Community Feed", detail: "Verified updates", href: "/feed", icon: ClipboardList, tone: "purple" as const },
  { label: "My Profile", detail: "Privacy and settings", href: "/profile", icon: UserCircle, tone: "amber" as const },
];

export function HomeDashboardView() {
  const { role } = useAuth();
  const watcherActions = [{ label: "Nearby Walks", detail: "Respond in your block", href: "/nearby-walks", icon: Bell, tone: "red" as const }];
  const truthKeeperActions = [{ label: "Verification", detail: "Review reports and evidence", href: "/verification-center", icon: SearchCheck, tone: "blue" as const }];
  const guardianActions = [{ label: "Oversight", detail: "Guardian workspace", href: "/oversight", icon: ShieldCheck, tone: "purple" as const }];

  return (
    <div className="grid gap-4">
      <RouteHeader title="Home" subtitle={`Signed in as ${role.replace("_", " ")}.`} />
      <SectionLabel>Citizen tools</SectionLabel>
      <QuickActionGrid actions={citizenActions} />
      {(role === "watcher" || role === "truth_keeper" || role === "guardian") ? (
        <>
          <SectionLabel>Watcher tools</SectionLabel>
          <QuickActionGrid actions={watcherActions} />
        </>
      ) : null}
      {(role === "truth_keeper" || role === "guardian") ? (
        <>
          <SectionLabel>Truth keeper tools</SectionLabel>
          <QuickActionGrid actions={truthKeeperActions} />
        </>
      ) : null}
      {role === "guardian" ? (
        <>
          <SectionLabel>Guardian tools</SectionLabel>
          <QuickActionGrid actions={guardianActions} />
        </>
      ) : null}
    </div>
  );
}
