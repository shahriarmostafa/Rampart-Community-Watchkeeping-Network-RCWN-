import { MapPinned } from "lucide-react";

export function SafeWalkStatusCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <MapPinned className="h-5 w-5 text-teal-700" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-slate-950">Safe walk</h2>
          <p className="text-sm text-slate-600">Ready to start a monitored session.</p>
        </div>
      </div>
    </div>
  );
}
