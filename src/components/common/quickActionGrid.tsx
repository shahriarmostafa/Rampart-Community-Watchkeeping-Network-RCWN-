import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type QuickAction = {
  label: string;
  detail: string;
  href: string;
  icon: LucideIcon;
  tone: "teal" | "blue" | "purple" | "red" | "amber";
};

const toneClasses = {
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-blue-50 text-blue-800",
  purple: "bg-violet-50 text-violet-700",
  red: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
};

export function QuickActionGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" href={action.href} key={action.href}>
            <span className={`grid h-11 w-11 place-items-center rounded-md ${toneClasses[action.tone]}`}>
              <Icon aria-hidden className="h-5 w-5" />
            </span>
            <div className="mt-3 text-sm font-bold text-slate-950">{action.label}</div>
            <div className="mt-1 text-xs text-slate-500">{action.detail}</div>
          </Link>
        );
      })}
    </div>
  );
}
