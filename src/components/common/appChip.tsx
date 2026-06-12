import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const chipStyles = {
  teal: "bg-teal-50 text-teal-700",
  navy: "bg-blue-50 text-blue-800",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-rose-50 text-rose-700",
  purple: "bg-violet-50 text-violet-700",
  slate: "bg-slate-100 text-slate-600",
  gold: "bg-yellow-50 text-yellow-700",
};

export type ChipTone = keyof typeof chipStyles;

export function AppChip({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
        chipStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
