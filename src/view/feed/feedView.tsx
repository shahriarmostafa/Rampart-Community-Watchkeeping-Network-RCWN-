"use client";

import { useEffect, useState } from "react";
import { Megaphone, ShieldCheck, UserRoundX } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { PersonRow } from "@/components/common/personRow";
import { RouteHeader } from "@/components/common/routeHeader";
import { useAuth } from "@/features/auth/useAuth";
import { getBlockUpdates } from "@/features/blockUpdates/blockUpdateService";
import { getFeedReports } from "@/features/reports/reportService";
import type { BlockUpdate } from "@/types/blockUpdate";
import type { Report } from "@/types/report";

const FILTERS = ["All", "Alerts", "Missing", "Block Updates", "Awareness"];

type FeedItem =
  | { kind: "missing"; data: Report; date: string }
  | { kind: "update"; data: BlockUpdate; date: string };

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function MissingCard({ report }: { report: Report }) {
  return (
    <AppCard className="overflow-hidden border-rose-100 p-0">
      <div className="flex items-center gap-2 bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
        <UserRoundX aria-hidden className="h-4 w-4" />
        Missing Person – Verified Alert
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <div className="font-bold text-slate-950">
              {report.missingPersonName ?? "Person"}
              {report.missingPersonAge ? `, ${report.missingPersonAge}` : ""}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              Last seen: {report.missingLastSeen ?? report.location ?? "unknown"} · {timeAgo(report.createdAt)}
            </div>
          </div>
          <AppChip tone="red">Missing</AppChip>
        </div>
        <p className="text-sm leading-6 text-slate-700">
          {report.description} If you have information, contact verified watchers privately through the platform.
        </p>
      </div>
    </AppCard>
  );
}

function BlockUpdateCard({ update }: { update: BlockUpdate }) {
  const roleLabel = update.authorRole === "guardian" ? "Guardian" : "Truth Keeper";
  const initials = (update.authorName ?? "TK")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <AppCard>
      <div className="mb-3 flex items-center justify-between gap-2">
        <AppChip tone="navy">
          <Megaphone aria-hidden className="h-3 w-3" /> Block Update
        </AppChip>
        <span className="text-xs text-slate-400">{timeAgo(update.createdAt)}</span>
      </div>
      <div className="font-bold text-slate-950">{update.title}</div>
      <div className="mt-3">
        <PersonRow
          detail={`${roleLabel} · ${update.blockCode}`}
          initials={initials}
          name={update.authorName ?? "Truth Keeper"}
          toneIndex={2}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{update.body}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
        <ShieldCheck aria-hidden className="h-4 w-4" /> Verified Community Update
      </div>
    </AppCard>
  );
}

export function FeedView() {
  const { appUser } = useAuth();
  const blockCode = appUser?.block?.blockCode;

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const [reports, updates] = await Promise.all([
          getFeedReports(),
          blockCode ? getBlockUpdates(blockCode) : Promise.resolve([]),
        ]);

        const missingItems: FeedItem[] = reports
          .filter((r) => r.type === "missing")
          .map((r) => ({ kind: "missing", data: r, date: r.createdAt }));

        const updateItems: FeedItem[] = updates.map((u) => ({
          kind: "update",
          data: u,
          date: u.createdAt,
        }));

        const merged = [...missingItems, ...updateItems].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setFeedItems(merged);
      } catch {
        // fail silently — show empty state
      } finally {
        setLoading(false);
      }
    }

    void loadFeed();
  }, [blockCode]);

  return (
    <div className="grid gap-4">
      <RouteHeader title="Community Feed" subtitle="Moderated and protective." />
      <NoticeBanner icon={ShieldCheck} tone="safe">
        A moderated, protective feed. No gossip, no exposed identities; verified updates only.
      </NoticeBanner>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter, index) => (
          <AppChip className="flex-none" key={filter} tone={index === 0 ? "navy" : "slate"}>
            {filter}
          </AppChip>
        ))}
      </div>

      {loading && (
        <div className="py-8 text-center text-sm text-slate-400">Loading feed…</div>
      )}

      {!loading && feedItems.length === 0 && (
        <AppCard>
          <p className="text-center text-sm text-slate-500">
            {blockCode
              ? "No community updates for your block yet."
              : "No verified alerts at this time."}
          </p>
        </AppCard>
      )}

      {feedItems.map((item) =>
        item.kind === "missing" ? (
          <MissingCard key={item.data._id} report={item.data as Report} />
        ) : (
          <BlockUpdateCard key={item.data._id} update={item.data as BlockUpdate} />
        ),
      )}
    </div>
  );
}
