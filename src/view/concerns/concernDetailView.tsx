"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, TrendingUp, UserRound } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { getReportDetail } from "@/features/reports/reportService";
import type { ChipTone } from "@/components/common/appChip";
import type { Report, ReportStatus } from "@/types/report";

const STATUS_LABELS: Record<ReportStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  verified_true: "Verified True",
  verified_false: "Not Verified",
  archived: "Archived",
};

const STATUS_TONES: Record<ReportStatus, ChipTone> = {
  submitted: "slate",
  under_review: "amber",
  verified_true: "teal",
  verified_false: "red",
  archived: "slate",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ConcernDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getReportDetail(id)
      .then(setReport)
      .catch(() => setError("Could not load this report."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 aria-hidden className="h-7 w-7 animate-spin text-teal-700" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="grid gap-4 py-8 text-center">
        <p className="text-sm font-semibold text-red-600">{error ?? "Report not found."}</p>
        <Button onClick={() => router.back()} variant="secondary">Go back</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <button
        className="flex items-center gap-1.5 text-sm font-semibold text-teal-700"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" /> Back
      </button>

      <div className="flex items-start justify-between gap-2">
        <h1 className="text-lg font-bold text-slate-950 leading-tight">{report.title}</h1>
        <AppChip tone={STATUS_TONES[report.status]}>{STATUS_LABELS[report.status]}</AppChip>
      </div>

      <div className="flex flex-wrap gap-2">
        {report.category && <AppChip tone="navy">{report.category}</AppChip>}
        <AppChip tone="slate">{report.type}</AppChip>
        <span className="text-xs text-slate-400">{timeAgo(report.createdAt)}</span>
      </div>

      {report.location && (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin aria-hidden className="h-4 w-4 flex-none text-slate-400" />
          {report.location}
        </div>
      )}

      <AppCard>
        <p className="text-sm leading-6 text-slate-700">{report.description}</p>
      </AppCard>

      {report.type === "missing" && (
        <AppCard className="border-rose-100">
          <SectionLabel>Missing Person Details</SectionLabel>
          <div className="mt-3 grid gap-1.5 text-sm text-slate-700">
            {report.missingPersonName && (
              <div className="flex gap-2">
                <UserRound aria-hidden className="h-4 w-4 flex-none text-slate-400 mt-0.5" />
                <span>
                  <span className="font-semibold">{report.missingPersonName}</span>
                  {report.missingPersonAge ? `, ${report.missingPersonAge} yrs` : ""}
                </span>
              </div>
            )}
            {report.missingLastSeen && (
              <div className="flex gap-2">
                <MapPin aria-hidden className="h-4 w-4 flex-none text-slate-400 mt-0.5" />
                Last seen: {report.missingLastSeen}
              </div>
            )}
            {report.missingRelationship && (
              <div className="text-slate-500 text-xs mt-1">Reporter relationship: {report.missingRelationship}</div>
            )}
          </div>
        </AppCard>
      )}

      <SectionLabel>Verification</SectionLabel>
      <AppCard>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            <span className="font-semibold text-teal-700">{report.trueVotes}</span> confirmed true
          </span>
          <span className="text-slate-600">
            <span className="font-semibold text-red-600">{report.falseVotes}</span> marked false
          </span>
          <span className="text-slate-600">
            {report.verifications.length} verifier{report.verifications.length !== 1 ? "s" : ""}
          </span>
        </div>
        {report.verifications.length > 0 && (
          <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
            {report.verifications.map((v, i) => (
              <div className="flex items-start gap-2 text-xs" key={i}>
                <span
                  className={`mt-0.5 rounded-full px-2 py-0.5 font-bold ${
                    v.vote === "true" ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {v.vote === "true" ? "True" : "False"}
                </span>
                <div>
                  <span className="font-semibold text-slate-700">{v.verifierName ?? "Verifier"}</span>
                  <span className="text-slate-400"> · {v.verifierRole.replace("_", " ")}</span>
                  {v.note && <p className="mt-0.5 text-slate-500">{v.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </AppCard>

      {report.status === "verified_true" && report.type !== "missing" && (
        <Button className="gap-2" variant="secondary" type="button" onClick={() => alert("Escalation coming soon.")}>
          <TrendingUp aria-hidden className="h-4 w-4" />
          Escalate
        </Button>
      )}

      {report.status === "verified_true" && report.publishedToFeed && (
        <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Published to community feed
        </div>
      )}
    </div>
  );
}
