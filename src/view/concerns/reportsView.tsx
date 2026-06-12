"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, ShieldQuestion, UserRoundX } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip } from "@/components/common/appChip";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { StatusFlow } from "@/components/common/statusFlow";
import { useAuth } from "@/features/auth/useAuth";
import { getMyReports } from "@/features/reports/reportService";
import type { Report, ReportStatus } from "@/types/report";

const reportOptions = [
  { title: "File Safety Report", detail: "Harassment, stalking, unsafe transport, assault risk", href: "/concerns/create", icon: FileText },
  { title: "Anonymous Tip", detail: "Report as a protected witness", href: "/concerns/anonymous", icon: ShieldQuestion },
  { title: "Missing Person Report", detail: "Create a rapid response case", href: "/missing/create", icon: UserRoundX },
];

const STATUS_LABELS: Record<ReportStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  verified_true: "Verified",
  verified_false: "Not Verified",
  archived: "Archived",
};

const STATUS_TONES: Record<ReportStatus, "navy" | "amber" | "slate" | "teal"> = {
  submitted: "slate",
  under_review: "amber",
  verified_true: "teal",
  verified_false: "slate",
  archived: "slate",
};

export function ReportsView() {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function loadReports() {
      setLoading(true);
      try {
        const reports = await getMyReports(user.uid);
        if (isMounted) {
          setMyReports(reports);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="grid gap-4">
      <RouteHeader title="Reports" subtitle="File reports and track your submitted cases." />
      <div className="grid gap-3">
        {reportOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Link href={option.href} key={option.href}>
              <AppCard className="flex items-center gap-3 transition hover:border-teal-300">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-blue-50 text-blue-800">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-950">{option.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{option.detail}</div>
                </div>
              </AppCard>
            </Link>
          );
        })}
      </div>
      <AppCard>
        <StatusFlow
          steps={[
            { title: "Report submitted", description: "Your identity is protected", state: "done" },
            { title: "Watcher review", description: "A watcher checks immediate safety needs", state: "active" },
            { title: "Truth Keeper verification", description: "Evidence and report consistency are reviewed" },
            { title: "Support or escalation", description: "Next steps are coordinated privately" },
          ]}
        />
      </AppCard>

      {user && (
        <>
          <SectionLabel>My Reports</SectionLabel>
          {loading && <p className="text-sm text-slate-400">Loading your reports…</p>}
          {!loading && myReports.length === 0 && (
            <AppCard>
              <p className="text-center text-sm text-slate-500">You have not filed any reports yet.</p>
            </AppCard>
          )}
          {myReports.length > 0 && (
            <AppCard>
              {myReports.map((report, index) => (
                <div key={report._id}>
                  <Link className="block rounded hover:bg-slate-50" href={`/concerns/${report._id}`}>
                    <div className="flex items-center justify-between gap-2 py-1">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-slate-950">{report.title}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {report.type} · {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-none items-center gap-2">
                        <AppChip tone={STATUS_TONES[report.status]}>{STATUS_LABELS[report.status]}</AppChip>
                        <ChevronRight aria-hidden className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                  {index < myReports.length - 1 && <div className="my-2 border-t border-slate-100" />}
                </div>
              ))}
            </AppCard>
          )}
        </>
      )}
    </div>
  );
}
