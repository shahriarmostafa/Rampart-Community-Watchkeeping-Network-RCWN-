import { Users } from "lucide-react";

export function CirclePreview() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-sky-700" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-slate-950">Trusted circle</h2>
          <p className="text-sm text-slate-600">Invite and manage safety contacts.</p>
        </div>
      </div>
    </div>
  );
}
