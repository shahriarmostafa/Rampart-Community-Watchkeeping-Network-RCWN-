"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BusFront, CheckCircle2, Eye, House, ShieldAlert, ShieldX, TriangleAlert } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { ToggleRow } from "@/components/common/toggleRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryGrid, type CategoryOption } from "@/components/reports/categoryGrid";
import { useAuth } from "@/features/auth/useAuth";
import { createReport } from "@/features/reports/reportService";

const CATEGORIES: CategoryOption[] = [
  { label: "Harassment", icon: TriangleAlert },
  { label: "Stalking", icon: Eye },
  { label: "Domestic violence", icon: House },
  { label: "Possible assault", icon: ShieldAlert },
  { label: "Unsafe transport", icon: BusFront },
  { label: "Suspicious activity", icon: TriangleAlert },
];

export function CreateConcernView() {
  const router = useRouter();
  const { user, appUser } = useAuth();

  const [category, setCategory] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!user || !category || !description.trim() || !confirmed) return;

    setSubmitting(true);
    setError(null);

    try {
      const report = await createReport({
        reporterFirebaseUid: user.uid,
        reporterName: user.displayName || user.email?.split("@")[0] || "RCWN Citizen",
        type: "concern",
        category,
        title: `${category} concern`,
        description: description.trim(),
        location: location.trim() || undefined,
        blockCode: appUser?.block?.blockCode,
      });

      router.push(`/concerns/${report._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !!category && description.trim().length >= 10 && confirmed && !submitting;

  return (
    <div className="grid gap-4">
      <RouteHeader title="Community Concern" subtitle="Verification before publicity." />

      <NoticeBanner icon={ShieldX} tone="warn">
        This is a Community Concern Report, not a public accusation. Trained truth keepers verify before any action.
      </NoticeBanner>
      <NoticeBanner icon={ShieldAlert} tone="info">
        Safety concerns only. Lifestyle choices, neighborhood disputes, or personal grievances will be closed with no action.
      </NoticeBanner>

      <label className="text-sm font-bold text-slate-900">Type of concern</label>
      <CategoryGrid
        options={CATEGORIES.map((c) => ({ ...c, selected: c.label === category }))}
        onSelect={setCategory}
      />

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        Area / location
        <Input
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. near Sylhet Zindabazar point"
          value={location}
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        What did you witness or hear?
        <textarea
          className="min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe calmly and factually. Avoid naming people as guilty; describe what you observed."
          value={description}
        />
        <span className={`text-right text-xs ${description.length < 10 ? "text-slate-400" : "text-teal-700"}`}>
          {description.length} chars {description.length < 10 ? `(${10 - description.length} more needed)` : "✓"}
        </span>
      </label>

      <AppCard className="border-blue-200">
        <ToggleRow
          description="Not a lifestyle judgement, neighborhood dispute, or personal grievance"
          enabled={confirmed}
          onToggle={setConfirmed}
          title="I confirm this is a genuine safety concern"
        />
      </AppCard>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <Button
        className="gap-2"
        disabled={!canSubmit}
        onClick={handleSubmit}
        type="button"
      >
        <CheckCircle2 aria-hidden className="h-4 w-4" />
        {submitting ? "Submitting…" : "Submit Community Concern"}
      </Button>

      <p className="pb-2 text-xs text-slate-500">
        After submission, truth keepers will review and verify. You can track status from the Concerns page.
      </p>
    </div>
  );
}
