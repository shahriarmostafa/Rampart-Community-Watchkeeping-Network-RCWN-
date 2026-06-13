"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, ShieldX, XCircle } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { getReportDetail, submitVerification } from "@/features/reports/reportService";
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

export function ReportVerificationView({ id }: { id: string }) {
  const router = useRouter();
  const { user, role } = useAuth();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [vote, setVote] = useState<"true" | "false" | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    void getReportDetail(id)
      .then(setReport)
      .catch(() => setLoadError("Could not load this report."))
      .finally(() => setLoading(false));
  }, [id]);

  const canVerify = role === "truth_keeper" || role === "guardian";

  const alreadyVoted =
    !!user &&
    report?.verifications.some((v) => v.verifierFirebaseUid === user.uid);

  const resolved =
    report?.status === "verified_true" ||
    report?.status === "verified_false" ||
    report?.status === "archived";

  async function handleSubmit() {
    if (!user || !vote || !report) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const updated = await submitVerification(id, {
        verifierFirebaseUid: user.uid,
        verifierName: user.displayName || user.email?.split("@")[0] || "Truth Keeper",
        verifierRole: role as "truth_keeper" | "guardian",
        vote,
        note: note.trim() || undefined,
      });
      setReport(updated);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit verification.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 aria-hidden className="h-7 w-7 animate-spin text-teal-700" />
      </div>
    );
  }

  if (loadError || !report) {
    return (
      <div className="grid gap-4 py-8 text-center">
        <p className="text-sm font-semibold text-red-600">{loadError ?? "Report not found."}</p>
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
        <ArrowLeft aria-hidden className="h-4 w-4" /> Back to queue
      </button>

      <div className="flex items-start justify-between gap-2">
        <h1 className="text-lg font-bold leading-tight text-slate-950">{report.title}</h1>
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
          <SectionLabel>Missing Person</SectionLabel>
          <div className="mt-3 grid gap-1 text-sm text-slate-700">
            {report.missingPersonName && (
              <div>
                <span className="font-semibold">{report.missingPersonName}</span>
                {report.missingPersonAge ? `, ${report.missingPersonAge} yrs` : ""}
              </div>
            )}
            {report.missingLastSeen && <div className="text-slate-500">Last seen: {report.missingLastSeen}</div>}
            {report.missingRelationship && (
              <div className="text-xs text-slate-400">Relationship: {report.missingRelationship}</div>
            )}
          </div>
        </AppCard>
      )}

      <SectionLabel>
        Verifications · {report.trueVotes} true / {report.falseVotes} false
      </SectionLabel>

      {report.verifications.length > 0 && (
        <AppCard>
          <div className="grid gap-3">
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
        </AppCard>
      )}

      {/* Verification form */}
      {canVerify && !resolved && !alreadyVoted && !submitted && (
        <AppCard className="border-blue-200">
          <SectionLabel>Your Verification</SectionLabel>
          <p className="mb-3 mt-1 text-xs text-slate-500">
            {report.type === "missing"
              ? "1 truth keeper is enough to verify a missing report."
              : "3 truth keepers or 1 guardian required for verification."}
          </p>
          <div className="flex gap-3 mb-4">
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-bold transition ${
                vote === "true"
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
              }`}
              onClick={() => setVote("true")}
              type="button"
            >
              <CheckCircle2 aria-hidden className="h-4 w-4" /> Verified True
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-bold transition ${
                vote === "false"
                  ? "border-rose-600 bg-rose-50 text-rose-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-rose-300"
              }`}
              onClick={() => setVote("false")}
              type="button"
            >
              <XCircle aria-hidden className="h-4 w-4" /> Not Verified
            </button>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-900">
            Note (optional)
            <textarea
              className="min-h-20 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe your findings (optional but recommended)"
              value={note}
            />
          </label>
          {submitError && <p className="mt-2 text-sm font-semibold text-red-600">{submitError}</p>}
          <Button
            className="mt-4 w-full gap-2"
            disabled={!vote || submitting}
            onClick={handleSubmit}
            type="button"
          >
            {submitting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Submitting…" : "Submit Verification"}
          </Button>
        </AppCard>
      )}

      {(alreadyVoted || submitted) && !resolved && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Your verification has been recorded. Awaiting other verifiers.
        </div>
      )}

      {resolved && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${
            report.status === "verified_true"
              ? "border-teal-200 bg-teal-50 text-teal-800"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {report.status === "verified_true" ? (
            <CheckCircle2 aria-hidden className="h-4 w-4" />
          ) : (
            <ShieldX aria-hidden className="h-4 w-4" />
          )}
          {STATUS_LABELS[report.status]}
          {report.publishedToFeed ? " · Published to community feed" : ""}
        </div>
      )}

      {!canVerify && (
        <p className="text-xs text-slate-400">Only truth keepers and guardians can verify reports.</p>
      )}
    </div>
  );
}
