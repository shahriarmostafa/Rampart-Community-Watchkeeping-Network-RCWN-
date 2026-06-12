"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ClipboardCheck, Loader2, Megaphone, SearchCheck, TriangleAlert } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { PersonRow } from "@/components/common/personRow";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { createBlockUpdate } from "@/features/blockUpdates/blockUpdateService";
import { getPendingQueue } from "@/features/reports/reportService";
import type { Report } from "@/types/report";

const POLL_INTERVAL = 15_000;

function typeIcon(type: Report["type"]) {
  if (type === "missing") return SearchCheck;
  if (type === "concern") return TriangleAlert;
  return ClipboardCheck;
}

function toneForType(type: Report["type"]) {
  if (type === "missing") return 4;
  if (type === "concern") return 3;
  return 0;
}

function rowInitials(title: string) {
  const parts = title.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase();
}

export function TruthKeeperDashboardView() {
  const { user, appUser, role } = useAuth();

  const blockCode = appUser?.block?.blockCode;
  const blockAreaName = appUser?.block?.areaName;

  // Verification queue
  const [queue, setQueue] = useState<Report[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  // Post block update
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchQueue() {
      try {
        const reports = await getPendingQueue();
        if (!cancelled) {
          setQueue(reports);
          setQueueError(null);
        }
      } catch {
        if (!cancelled) setQueueError("Could not load queue. Retrying…");
      } finally {
        if (!cancelled) setQueueLoading(false);
      }
    }

    void fetchQueue();
    const timer = setInterval(() => void fetchQueue(), POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  async function handlePostUpdate() {
    if (!user || !blockCode || !updateTitle.trim() || !updateBody.trim()) return;

    setPosting(true);
    setPostError(null);
    setPostSuccess(false);

    try {
      await createBlockUpdate({
        blockCode,
        authorFirebaseUid: user.uid,
        authorName: user.displayName || user.email?.split("@")[0] || "Truth Keeper",
        authorRole: role as "truth_keeper" | "guardian",
        title: updateTitle.trim(),
        body: updateBody.trim(),
      });

      setUpdateTitle("");
      setUpdateBody("");
      setPostSuccess(true);
    } catch (err) {
      setPostError(err instanceof Error ? err.message : "Could not post update.");
    } finally {
      setPosting(false);
    }
  }

  const canPost = !!blockCode && updateTitle.trim().length >= 3 && updateBody.trim().length >= 10 && !posting;

  return (
    <div className="grid gap-4">
      <RouteHeader
        subtitle="Verify reports and post community updates for your block."
        title="Verification Center"
      />

      {/* Block Update Post Form */}
      <SectionLabel>Post Block Update</SectionLabel>

      {!blockCode ? (
        <NoticeBanner icon={Megaphone} tone="warn">
          Your account is not assigned to a block yet. Contact a guardian to be assigned.
        </NoticeBanner>
      ) : (
        <AppCard className="border-blue-200">
          <div className="mb-3 flex items-center gap-2">
            <Megaphone aria-hidden className="h-4 w-4 text-blue-700" />
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
              {blockAreaName ?? blockCode}
            </span>
            <AppChip tone="navy">Block Update</AppChip>
          </div>

          <div className="grid gap-3">
            <Input
              onChange={(e) => setUpdateTitle(e.target.value)}
              placeholder="Update title (e.g. Street lighting restored near market)"
              value={updateTitle}
            />
            <textarea
              className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              onChange={(e) => setUpdateBody(e.target.value)}
              placeholder="Write your update for residents of this block…"
              value={updateBody}
            />
          </div>

          {postError && <p className="mt-2 text-sm font-semibold text-red-600">{postError}</p>}

          {postSuccess && (
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
              <CheckCircle2 aria-hidden className="h-4 w-4" /> Update posted to community feed.
            </div>
          )}

          <Button
            className="mt-3 gap-2"
            disabled={!canPost}
            onClick={handlePostUpdate}
            type="button"
          >
            {posting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Megaphone aria-hidden className="h-4 w-4" />}
            {posting ? "Posting…" : "Post to Community Feed"}
          </Button>
        </AppCard>
      )}

      {/* Verification Queue */}
      <SectionLabel
        action={
          queueLoading ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            <AppChip tone="navy">{queue.length} pending</AppChip>
          )
        }
      >
        Verification Queue
      </SectionLabel>

      {queueError && <p className="text-sm font-semibold text-amber-700">{queueError}</p>}

      {!queueLoading && queue.length === 0 && !queueError && (
        <AppCard>
          <p className="text-center text-sm text-slate-500">No reports pending verification.</p>
        </AppCard>
      )}

      {queue.length > 0 && (
        <AppCard>
          {queue.map((report, index) => {
            const Icon = typeIcon(report.type);
            const isLast = index === queue.length - 1;

            return (
              <div key={report._id}>
                <Link className="block rounded hover:bg-slate-50" href={`/verification-center/${report._id}`}>
                  <div className="flex items-center gap-1">
                    <div className="flex-1">
                      <PersonRow
                        detail={`${report.type} · ${report.location ?? report.category ?? "details inside"} · ${report.trueVotes} true / ${report.falseVotes} false`}
                        initials={rowInitials(report.title)}
                        meta={<Icon aria-hidden className="h-5 w-5 text-blue-700" />}
                        name={report.title}
                        toneIndex={toneForType(report.type)}
                      />
                    </div>
                    <ChevronRight aria-hidden className="h-4 w-4 flex-none text-slate-400" />
                  </div>
                </Link>
                {!isLast && <div className="my-3 border-t border-slate-100" />}
              </div>
            );
          })}
        </AppCard>
      )}
    </div>
  );
}
