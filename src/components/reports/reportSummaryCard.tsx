import { TriangleAlert } from "lucide-react";

export function ReportSummaryCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <TriangleAlert className="h-5 w-5 text-amber-600" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-slate-950">Reports</h2>
          <p className="text-sm text-slate-600">Community reports will surface here.</p>
        </div>
      </div>
    </div>
  );
}
