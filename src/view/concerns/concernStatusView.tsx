import { ShieldCheck } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { StatusFlow } from "@/components/common/statusFlow";

export function ConcernStatusView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Report Status" subtitle="Tracking - identity protected." />
      <AppCard>
        <div className="flex justify-between gap-3">
          <AppChip tone="navy">Report #CR-2049</AppChip>
          <AppChip tone="amber">Under Review</AppChip>
        </div>
        <h2 className="mt-3 font-bold text-slate-950">Community Concern - Harassment</h2>
        <p className="mt-1 text-xs text-slate-500">Banani 11 - Submitted 2 hrs ago - Identity protected</p>
      </AppCard>
      <SectionLabel>Verification Progress</SectionLabel>
      <AppCard>
        <StatusFlow
          steps={[
            { title: "Submitted", description: "Report received securely", state: "done" },
            { title: "Under Review", description: "Platform triage complete", state: "done" },
            { title: "Watcher Verification", description: "Farzana N. is verifying facts", state: "active" },
            { title: "Guardian Review", description: "Senior guardian oversight" },
            { title: "Support Outreach", description: "Quietly reach person at risk" },
            { title: "Resolved", description: "Outcome recorded privately" },
          ]}
        />
      </AppCard>
      <NoticeBanner icon={ShieldCheck} tone="guardian">
        No public accusation has been made. Information stays with verified responders until facts are confirmed.
      </NoticeBanner>
    </div>
  );
}
