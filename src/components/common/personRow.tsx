import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const avatarStyles = [
  "bg-blue-700",
  "bg-teal-700",
  "bg-violet-700",
  "bg-amber-600",
  "bg-rose-700",
  "bg-slate-600",
];

export function PersonRow({
  initials,
  name,
  detail,
  meta,
  toneIndex = 0,
}: {
  initials: string;
  name: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  toneIndex?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "grid h-11 w-11 flex-none place-items-center rounded-md text-sm font-bold text-white",
          avatarStyles[toneIndex % avatarStyles.length],
        )}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-slate-950">{name}</div>
        {detail ? <div className="mt-0.5 text-xs text-slate-500">{detail}</div> : null}
      </div>
      {meta}
    </div>
  );
}
