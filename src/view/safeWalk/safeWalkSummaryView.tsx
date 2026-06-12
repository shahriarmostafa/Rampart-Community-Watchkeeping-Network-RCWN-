"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Info, LifeBuoy, ShieldCheck } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SupportResourceCard } from "@/components/support/supportResourceCard";
import { Button } from "@/components/ui/button";

function formatDuration(minutesStr: string | null) {
  if (!minutesStr) return "Unknown";
  const m = parseInt(minutesStr, 10);
  if (Number.isNaN(m) || m <= 0) return "< 1 min";
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const peakRiskLabel: Record<string, string> = {
  safe: "Safe throughout",
  uncomfortable: "Briefly uncomfortable",
  scared: "Scared at peak",
  danger: "Danger — emergency activated",
};

export function SafeWalkSummaryView() {
  const router = useRouter();
  const params = useSearchParams();

  const duration = params.get("duration");
  const startAddress = params.get("start");
  const destination = params.get("destination");
  const peakRisk = params.get("peak") ?? "safe";

  const stats: [string, string][] = [
    ["Duration", formatDuration(duration)],
    ...(startAddress ? [["Starting from", startAddress] as [string, string]] : []),
    ...(destination ? [["Destination", destination] as [string, string]] : []),
    ["Status", peakRiskLabel[peakRisk] ?? peakRiskLabel["safe"]],
  ];

  return (
    <div className="grid gap-4">
      <RouteHeader title="Journey Complete" subtitle="Arrived safely." />

      <section className="rounded-lg bg-teal-700 p-5 text-center text-white">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-white/50">
          <ShieldCheck aria-hidden className="h-8 w-8" />
        </div>
        <h1 className="mt-3 text-2xl font-bold">You Arrived Safely</h1>
        {destination && (
          <p className="mt-2 text-sm text-teal-100">{destination}</p>
        )}
      </section>

      <AppCard>
        {stats.map(([label, value]) => (
          <div className="flex justify-between border-b border-slate-100 py-2 last:border-b-0" key={label}>
            <span className="text-sm text-slate-500">{label}</span>
            <strong className="text-sm text-slate-950">{value}</strong>
          </div>
        ))}
      </AppCard>

      <NoticeBanner icon={Info} tone="info">
        This journey is closed. Your live location is no longer visible to anyone. Journey data will be
        automatically deleted within 24 hours.
      </NoticeBanner>

      <SupportResourceCard
        description="Trauma counseling — no report required"
        icon={LifeBuoy}
        title="Talk to someone confidentially"
        tone="purple"
      />
      <SupportResourceCard
        description="Legal, medical, shelter, helplines"
        icon={ShieldCheck}
        title="See all support options"
        tone="teal"
      />

      <Button className="mb-4" onClick={() => router.replace("/home")} type="button">
        Back to Dashboard
      </Button>
    </div>
  );
}
