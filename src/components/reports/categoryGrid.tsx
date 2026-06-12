import type { LucideIcon } from "lucide-react";

export type CategoryOption = {
  label: string;
  icon: LucideIcon;
  selected?: boolean;
};

export function CategoryGrid({
  options,
  onSelect,
}: {
  options: CategoryOption[];
  onSelect?: (label: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const Icon = option.icon;

        return (
          <button
            className={`flex min-h-14 items-center gap-2 rounded-lg border p-3 text-left text-sm font-semibold transition ${
              option.selected
                ? "border-blue-700 bg-blue-50 text-blue-900"
                : "border-slate-200 bg-white text-slate-800 hover:border-blue-300"
            }`}
            key={option.label}
            onClick={() => onSelect?.(option.label)}
            type="button"
          >
            <Icon aria-hidden className="h-5 w-5 flex-none text-blue-700" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
