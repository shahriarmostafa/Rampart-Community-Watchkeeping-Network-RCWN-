import { UserRoundX } from "lucide-react";
import { AppCard } from "@/components/common/appCard";

export function MissingPersonCard() {
  return (
    <AppCard className="overflow-hidden border-rose-100 p-0">
      <div className="flex items-center gap-2 bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
        <UserRoundX aria-hidden className="h-4 w-4" />
        Missing Person - Active
      </div>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-100 text-slate-400">
            <UserRoundX aria-hidden className="h-7 w-7" />
          </div>
          <div>
            <div className="font-bold text-slate-950">Female, 17 - last seen Sylhet</div>
            <div className="mt-1 text-xs text-slate-500">Zindabazar - today 6:30 PM</div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          If you have seen this person, contact verified watchers privately. Do not share publicly outside the platform.
        </p>
      </div>
    </AppCard>
  );
}
