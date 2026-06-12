"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, HouseHeart, RadioTower, Users } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { StatusFlow } from "@/components/common/statusFlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryGrid } from "@/components/reports/categoryGrid";
import { useAuth } from "@/features/auth/useAuth";
import { createReport } from "@/features/reports/reportService";

const RELATIONSHIP_OPTIONS = [
  { label: "Family", icon: HouseHeart },
  { label: "Relative", icon: Users },
  { label: "Friend", icon: Users },
  { label: "Other", icon: Users },
];

export function CreateMissingView() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [relationship, setRelationship] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!user || !name.trim() || !relationship || !lastSeen.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const report = await createReport({
        reporterFirebaseUid: user.uid,
        reporterName: user.displayName || user.email?.split("@")[0] || "RCWN Citizen",
        type: "missing",
        title: `Missing person: ${name.trim()}`,
        description: description.trim() || `${relationship} of the reporter`,
        location: lastSeen.trim(),
        missingPersonName: name.trim(),
        missingPersonAge: age.trim() || undefined,
        missingLastSeen: lastSeen.trim(),
        missingRelationship: relationship,
      });

      router.push(`/concerns/${report._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit alert. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !!name.trim() && !!relationship && !!lastSeen.trim() && !submitting;

  return (
    <div className="grid gap-4">
      <RouteHeader title="Missing Person" subtitle="Rapid response." />
      <NoticeBanner icon={Clock} tone="warn">
        Local watchers and guardians are notified immediately. Truth keepers verify before publishing to the community feed.
      </NoticeBanner>

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        Name of missing person *
        <Input onChange={(e) => setName(e.target.value)} placeholder="e.g. Ruma Akter" value={name} />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        Age (optional)
        <Input onChange={(e) => setAge(e.target.value)} placeholder="e.g. 19" type="number" value={age} />
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-bold text-slate-900">Your relationship *</span>
        <CategoryGrid
          onSelect={setRelationship}
          options={RELATIONSHIP_OPTIONS.map((r) => ({ ...r, selected: r.label === relationship }))}
        />
      </div>

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        Last seen location *
        <Input onChange={(e) => setLastSeen(e.target.value)} placeholder="e.g. Chattogram, GEC Circle" value={lastSeen} />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-900">
        Additional details
        <textarea
          className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Clothing, physical features, anything that helps responders recognize them"
          value={description}
        />
      </label>

      <AppCard>
        <StatusFlow
          steps={[
            { title: "Notify local watchers", description: "Available responders nearby", state: "active" },
            { title: "Truth Keeper verification", description: "Verify and publish to community feed" },
            { title: "Guardian coordination", description: "If not found quickly" },
          ]}
        />
      </AppCard>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <Button
        className="gap-2 bg-rose-700 hover:bg-rose-800"
        disabled={!canSubmit}
        onClick={handleSubmit}
        type="button"
      >
        <RadioTower aria-hidden className="h-4 w-4" />
        {submitting ? "Sending alert…" : "Send Rapid Alert"}
      </Button>

      <p className="pb-2 text-xs text-slate-500">
        A truth keeper will verify and publish to the community feed. You can track status from the Concerns page.
      </p>
    </div>
  );
}
