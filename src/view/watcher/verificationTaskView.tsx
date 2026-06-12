import { Award, Heart, House, ShieldAlert, TriangleAlert } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { ToggleRow } from "@/components/common/toggleRow";
import { FieldLabel, TextArea } from "@/components/reports/reportFormFields";
import { Button } from "@/components/ui/button";

export function VerificationTaskView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Verification Task" subtitle="Help, verify, escalate." />
      <NoticeBanner icon={TriangleAlert} tone="warn">
        Do not confront suspects, publish accusations, or contact anyone&apos;s household without consent.
      </NoticeBanner>
      <AppCard>
        <div className="flex justify-between">
          <AppChip tone="navy">Task #CR-2049</AppChip>
          <AppChip tone="amber">Needs Verification</AppChip>
        </div>
        <h2 className="mt-3 text-sm font-bold text-slate-950">Safety Report - Harassment</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A witness reported repeated harassment near a bus stop in Banani 11. Reporter identity is protected.
        </p>
      </AppCard>
      <NoticeBanner icon={House} tone="danger">
        Domestic violence protocol: do not contact the household. Outreach must happen only through channels the survivor controls.
      </NoticeBanner>
      <SectionLabel>Verification Checklist</SectionLabel>
      <AppCard>
        <ToggleRow title="Confirmed location is real & active" />
        <ToggleRow title="Cross-checked with other reports" />
        <ToggleRow enabled={false} title="Person at risk has consented to outreach" description="Required before any contact" />
        <ToggleRow enabled={false} title="Person at risk reached safely" description="Only after consent above" />
      </AppCard>
      <FieldLabel>Verification notes (private)</FieldLabel>
      <TextArea placeholder="Record only verified facts. No judgement, no public detail." rows={3} />
      <SectionLabel>Decide next step</SectionLabel>
      <Button variant="secondary">
        <Award aria-hidden className="mr-2 h-4 w-4" />
        Send for Guardian Review
      </Button>
      <Button variant="secondary">
        <Heart aria-hidden className="mr-2 h-4 w-4" />
        Request Support Outreach
      </Button>
      <Button className="bg-rose-700 hover:bg-rose-800">
        <ShieldAlert aria-hidden className="mr-2 h-4 w-4" />
        Escalate to Platform Authority
      </Button>
    </div>
  );
}
