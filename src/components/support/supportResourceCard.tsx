import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

const tones = {
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-blue-50 text-blue-800",
  purple: "bg-violet-50 text-violet-700",
  red: "bg-rose-50 text-rose-700",
  gold: "bg-yellow-50 text-yellow-700",
};

export function SupportResourceCard({
  icon: Icon,
  title,
  description,
  tone = "blue",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: keyof typeof tones;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <span className={`grid h-12 w-12 flex-none place-items-center rounded-md ${tones[tone]}`}>
        <Icon aria-hidden className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-slate-950">{title}</div>
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      </div>
      <ChevronRight aria-hidden className="h-5 w-5 text-slate-400" />
    </div>
  );
}
