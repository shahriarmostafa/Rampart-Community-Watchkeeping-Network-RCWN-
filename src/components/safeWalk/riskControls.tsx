"use client";

import { CheckCircle2, Frown, ShieldCheck, Siren, TriangleAlert } from "lucide-react";
import type { RiskLevel } from "@/types/safeWalk";

const riskButtons: {
  level: RiskLevel;
  label: string;
  detail: string;
  icon: typeof ShieldCheck;
  className: string;
  activeClassName: string;
}[] = [
  {
    level: "safe",
    label: "Safe",
    detail: "All good",
    icon: ShieldCheck,
    className: "bg-teal-100 text-teal-800 border-2 border-transparent",
    activeClassName: "bg-teal-700 text-white border-2 border-teal-900 shadow-lg scale-105",
  },
  {
    level: "uncomfortable",
    label: "Uncomfortable",
    detail: "Keep watch",
    icon: TriangleAlert,
    className: "bg-amber-100 text-amber-800 border-2 border-transparent",
    activeClassName: "bg-amber-600 text-white border-2 border-amber-800 shadow-lg scale-105",
  },
  {
    level: "scared",
    label: "Scared",
    detail: "Alert nearby",
    icon: Frown,
    className: "bg-orange-100 text-orange-800 border-2 border-transparent",
    activeClassName: "bg-orange-600 text-white border-2 border-orange-800 shadow-lg scale-105",
  },
  {
    level: "danger",
    label: "Danger",
    detail: "Emergency now",
    icon: Siren,
    className: "bg-rose-100 text-rose-800 border-2 border-transparent",
    activeClassName: "bg-rose-700 text-white border-2 border-rose-900 shadow-lg scale-105",
  },
];

export function RiskControls({
  currentRisk = "safe",
  onSelect,
  disabled = false,
}: {
  currentRisk?: RiskLevel;
  onSelect?: (level: RiskLevel) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {riskButtons.map((item) => {
        const Icon = item.icon;
        const isActive = item.level === currentRisk;

        return (
          <button
            className={`flex min-h-28 flex-col items-center justify-center rounded-lg p-3 text-center transition-all ${
              isActive ? item.activeClassName : item.className
            }`}
            disabled={disabled}
            key={item.level}
            onClick={() => onSelect?.(item.level)}
            type="button"
          >
            <Icon aria-hidden className="h-8 w-8" />
            <span className="mt-2 text-base font-bold">{item.label}</span>
            <span className={`text-xs ${isActive ? "text-white/80" : "opacity-70"}`}>{item.detail}</span>
          </button>
        );
      })}
      <button
        className="col-span-2 flex h-14 items-center justify-center gap-2 rounded-lg bg-blue-800 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-50"
        disabled={disabled}
        onClick={() => onSelect?.("safe")}
        type="button"
      >
        <CheckCircle2 aria-hidden className="h-5 w-5" />
        I&apos;ve Arrived Safely
      </button>
    </div>
  );
}
