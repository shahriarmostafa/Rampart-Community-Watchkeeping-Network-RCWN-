import { ShieldCheck } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { RouteHeader } from "@/components/common/routeHeader";

export function GuardianDashboardView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Community Guardian Dashboard" subtitle="Additional guardian options will be added after the workflow is finalized." />
      <AppCard className="grid min-h-60 place-items-center border-dashed text-center">
        <div>
          <ShieldCheck aria-hidden className="mx-auto h-10 w-10 text-violet-700" />
          <h2 className="mt-4 text-base font-bold text-slate-950">No guardian tools configured yet</h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            This role inherits citizen, watcher, and truth keeper access. Guardian-only tools are intentionally blank for now.
          </p>
        </div>
      </AppCard>
    </div>
  );
}
