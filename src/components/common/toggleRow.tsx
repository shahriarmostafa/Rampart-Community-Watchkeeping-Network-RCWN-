import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

export function ToggleRow({
  title,
  description,
  enabled = true,
  onToggle,
  icon: Icon,
}: {
  title: string;
  description?: string;
  enabled?: boolean;
  onToggle?: (next: boolean) => void;
  icon?: LucideIcon;
}) {
  return (
    <button
      className="flex w-full items-center gap-3 border-b border-slate-100 py-3 text-left last:border-b-0"
      onClick={() => onToggle?.(!enabled)}
      type="button"
    >
      {Icon ? (
        <span className="text-slate-400">
          <Icon aria-hidden className="h-4 w-4" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-slate-950">{title}</div>
        {description ? <div className="mt-0.5 text-xs text-slate-500">{description}</div> : null}
      </div>
      <div
        className={`grid h-7 w-12 flex-none place-items-center rounded-full transition ${
          enabled ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-400"
        }`}
      >
        {enabled ? <Check aria-hidden className="h-4 w-4" /> : null}
      </div>
    </button>
  );
}
