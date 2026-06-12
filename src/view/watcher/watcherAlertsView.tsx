import { Info, RadioTower, ShieldAlert, Venus } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { PersonRow } from "@/components/common/personRow";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { ToggleRow } from "@/components/common/toggleRow";
import { Button } from "@/components/ui/button";

export function WatcherAlertsView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Alerts" subtitle="Watcher alerts nearby." />
      <NoticeBanner icon={Info} tone="warn">
        Watcher mandate: observe, support, and call for help only. Never confront, physically intervene, or attend active danger alone.
      </NoticeBanner>
      <AppCard>
        <ToggleRow description="Filter to journeys where user requested female responders" title="Show only female-preference alerts" />
      </AppCard>
      <AppCard className="border-l-4 border-l-rose-600">
        <div className="flex items-center justify-between">
          <AppChip tone="red">Danger</AppChip>
          <span className="text-xs text-slate-500">0.5 km - now</span>
        </div>
        <div className="mt-3">
          <PersonRow initials="!" name="Safe Walk Emergency" detail="Kazipara main road - live location active" toneIndex={4} />
        </div>
        <NoticeBanner icon={ShieldAlert} tone="warn">
          Go nearby, call 999, and make yourself visible. Do not confront or enter premises alone.
        </NoticeBanner>
        <Button className="mt-3 w-full bg-rose-700 hover:bg-rose-800">Respond Safely</Button>
      </AppCard>
      <AppCard className="border-l-4 border-l-orange-500">
        <div className="flex items-center justify-between">
          <AppChip tone="amber">Scared</AppChip>
          <span className="text-xs text-slate-500">1.2 km - 3 min</span>
        </div>
        <div className="mt-3">
          <PersonRow initials="U" name="Safe Walk - Uttara 7" detail="Walking alone - requested watch" toneIndex={3} />
        </div>
      </AppCard>
      <NoticeBanner icon={RadioTower} tone="info">
        If you cannot respond to a Danger alert and no other watcher is available, connect the person directly to 999.
      </NoticeBanner>
      <SectionLabel>Reports Awaiting Verification</SectionLabel>
      <AppCard>
        <PersonRow
          initials="CR"
          name="Safety Report #CR-2049"
          detail="Harassment - Banani - needs verification"
          meta={<AppChip tone="navy">Open</AppChip>}
        />
      </AppCard>
      <p className="text-center text-xs text-slate-500">
        <Venus aria-hidden className="mr-1 inline h-3 w-3" />
        Female-preference requests are prioritized for verified female responders.
      </p>
    </div>
  );
}
