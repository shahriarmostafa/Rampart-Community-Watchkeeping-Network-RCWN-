import { CloudUpload, Info, MessageCircle, ShieldQuestion } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { ToggleRow } from "@/components/common/toggleRow";
import { Button } from "@/components/ui/button";
import { FieldLabel, TextArea } from "@/components/reports/reportFormFields";

export function AnonymousConcernView() {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-blue-950 p-5 text-center text-white">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-white/10 text-2xl font-bold">ID</div>
        <h1 className="mt-3 text-2xl font-bold">Anonymous Witness Mode</h1>
        <p className="mt-2 text-xs text-white/70">Your identity is hidden. Share what you saw safely.</p>
      </section>
      <RouteHeader title="Anonymous Report" subtitle="Witness protection mode." />
      <AppCard>
        <ToggleRow title="Hide my identity completely" description="Even from watchers" />
        <ToggleRow title="Hide from local public" description="Never appears in community feed" />
        <ToggleRow title="Share only with verified watchers & guardians" />
      </AppCard>
      <FieldLabel>What would you like to report?</FieldLabel>
      <TextArea placeholder="You are safe. Tell us what you witnessed; no personal details about you are stored." />
      <FieldLabel>Evidence (optional)</FieldLabel>
      <div className="grid min-h-36 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        <CloudUpload aria-hidden className="mb-2 h-8 w-8" />
        Tap to attach photo, audio or video
      </div>
      <NoticeBanner icon={MessageCircle} tone="safe">
        A verifier may send anonymous follow-up questions. You can reply without revealing who you are.
      </NoticeBanner>
      <NoticeBanner icon={Info} tone="warn">
        Your identity is hidden from community members and watchers, but a Bangladesh court order could compel disclosure.
      </NoticeBanner>
      <Button className="gap-2">
        <ShieldQuestion aria-hidden className="h-4 w-4" />
        Send Anonymously
      </Button>
    </div>
  );
}
