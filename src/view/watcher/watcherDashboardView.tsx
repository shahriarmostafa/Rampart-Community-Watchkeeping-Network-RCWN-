"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Info,
  MapPinned,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Venus,
} from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { getBlockSessions } from "@/features/safeWalk/safeWalkService";
import { getUserProfile } from "@/features/users/userService";
import type { SafeWalkSessionPublic } from "@/types/safeWalk";

const riskChipTone: Record<string, "red" | "amber" | "navy" | "teal"> = {
  safe: "teal",
  uncomfortable: "amber",
  scared: "amber",
  danger: "red",
};

const riskBorderColor: Record<string, string> = {
  safe: "border-l-teal-500",
  uncomfortable: "border-l-amber-500",
  scared: "border-l-orange-500",
  danger: "border-l-rose-600",
};

const riskLabel: Record<string, string> = {
  safe: "Safe Walk Active",
  uncomfortable: "Watch Requested",
  scared: "Scared — Needs Support",
  danger: "DANGER",
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function SessionCard({ session }: { session: SafeWalkSessionPublic }) {
  const [expanded, setExpanded] = useState(false);
  const risk = session.riskLevel;
  const isDanger = risk === "danger";
  const isScared = risk === "scared";
  const isAnonymous = risk === "safe" || risk === "uncomfortable";

  return (
    <AppCard className={`border-l-4 ${riskBorderColor[risk] ?? "border-l-slate-300"}`}>
      <div className="flex items-center justify-between gap-2">
        <AppChip tone={riskChipTone[risk] ?? "navy"}>{riskLabel[risk] ?? risk}</AppChip>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {session.shareWith.femaleOnly && (
            <span className="flex items-center gap-1 font-semibold text-violet-600">
              <Venus aria-hidden className="h-3 w-3" />
              Female
            </span>
          )}
          <span>{timeAgo(session.startedAt)}</span>
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {isAnonymous ? (
          <p className="text-sm text-slate-600">
            {risk === "safe"
              ? "Someone is safewalking in your block."
              : "An anonymous user in your block needs a watch presence nearby."}
          </p>
        ) : (
          <div className="grid gap-1 text-sm">
            {session.userName && (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  {session.userName.slice(0, 2).toUpperCase()}
                </span>
                <span className="font-semibold text-slate-950">{session.userName}</span>
              </div>
            )}
            {session.blockCode && (
              <p className="text-xs text-slate-500">Block: {session.blockCode}</p>
            )}
          </div>
        )}
      </div>

      {/* Expanded detail for scared / danger */}
      {expanded && !isAnonymous && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs">
          {session.location && isDanger ? (
            <p className="font-semibold text-slate-700">
              <MapPinned aria-hidden className="mr-1 inline h-3 w-3 text-rose-600" />
              Live location: {session.location.lat.toFixed(5)}, {session.location.lng.toFixed(5)}
            </p>
          ) : isScared ? (
            <p className="font-semibold text-slate-600">
              <TriangleAlert aria-hidden className="mr-1 inline h-3 w-3 text-amber-600" />
              Approximate area — Block {session.blockCode ?? "unknown"}
            </p>
          ) : null}
          <p className="mt-2 text-slate-500">
            Started {timeAgo(session.startedAt)}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {isAnonymous ? (
          <Button className="w-full gap-2" type="button" variant="secondary">
            <Eye aria-hidden className="h-4 w-4" />
            Stay alert in area
          </Button>
        ) : (
          <Button
            className={`w-full gap-2 ${isDanger ? "bg-rose-700 hover:bg-rose-800" : ""}`}
            onClick={() => setExpanded((v) => !v)}
            type="button"
            variant={isDanger ? "default" : "secondary"}
          >
            {isDanger ? (
              <ShieldAlert aria-hidden className="h-4 w-4" />
            ) : (
              <ShieldCheck aria-hidden className="h-4 w-4" />
            )}
            {expanded ? "Hide details" : "Open Request"}
          </Button>
        )}
      </div>
    </AppCard>
  );
}

export function WatcherDashboardView() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SafeWalkSessionPublic[]>([]);
  const [blockCode, setBlockCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Resolve watcher's block from their profile
  useEffect(() => {
    if (!user) return;
    void getUserProfile(user.uid).then((profile) => {
      setBlockCode(profile.block?.blockCode ?? null);
    });
  }, [user]);

  async function loadSessions(silent = false) {
    if (!blockCode) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      setSessions(await getBlockSessions(blockCode));
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load nearby walks.");
    } finally {
      setLoading(false);
    }
  }

  // Initial load + 15-second auto-refresh
  useEffect(() => {
    window.setTimeout(() => {
      void loadSessions();
    }, 0);
    const interval = setInterval(() => void loadSessions(true), 15_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockCode]);

  const hasSessions = sessions.length > 0;
  const dangerSessions = sessions.filter((s) => s.riskLevel === "danger");
  const otherSessions = sessions.filter((s) => s.riskLevel !== "danger");

  return (
    <div className="grid gap-4">
      <RouteHeader
        title="Watcher Dashboard"
        subtitle={blockCode ? `Block ${blockCode}` : "No block assigned"}
      />

      <NoticeBanner icon={Info} tone="warn">
        Observe, support, and call for help. Do not confront, detain, or attend active danger alone.
      </NoticeBanner>

      {!blockCode && (
        <AppCard className="border-amber-200 bg-amber-50">
          <p className="text-sm font-semibold text-amber-800">
            Your profile does not have a block assigned. Go to Profile → Address & Block to set your location and block.
          </p>
        </AppCard>
      )}

      {blockCode && (
        <>
          <div className="flex items-center justify-between">
            <SectionLabel>
              <span className="flex items-center gap-2">
                Nearby Safe Walks
                {hasSessions && (
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">
                    {sessions.length}
                  </span>
                )}
              </span>
            </SectionLabel>
            <button
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
              onClick={() => void loadSessions()}
              type="button"
            >
              <RefreshCcw aria-hidden className="h-3 w-3" />
              {loading ? "Refreshing…" : `Updated ${timeAgo(lastRefresh.toISOString())}`}
            </button>
          </div>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          {loading && !hasSessions && (
            <AppCard>
              <p className="text-sm text-slate-500">Loading nearby walks…</p>
            </AppCard>
          )}

          {!loading && !hasSessions && !error && (
            <AppCard>
              <p className="text-sm text-slate-500">
                No active safe walks in your block right now. Auto-refreshes every 15 seconds.
              </p>
            </AppCard>
          )}

          {/* Danger sessions always first */}
          {dangerSessions.map((s) => (
            <SessionCard key={String(s._id)} session={s} />
          ))}
          {otherSessions.map((s) => (
            <SessionCard key={String(s._id)} session={s} />
          ))}
        </>
      )}
    </div>
  );
}
