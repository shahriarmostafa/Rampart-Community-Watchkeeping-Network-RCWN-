"use client";

import { CheckCircle2, Download, Laptop, MonitorDown, Smartphone } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export function PwaInstallPanel() {
  const { canPromptInstall, install, isInstalled, manualInstructions, message, platform } = usePwaInstall();

  const buttons = [
    { label: "Install on Android", detail: "Chrome or Edge", icon: Smartphone, platform: "android" },
    { label: "Add to iPhone Home Screen", detail: "Safari share menu", icon: MonitorDown, platform: "ios" },
    { label: "Install on Desktop", detail: "Chrome, Edge, Arc", icon: Laptop, platform: "desktop" },
  ];

  return (
    <section className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-teal-50 text-teal-700">
          <Download aria-hidden className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-950">{isInstalled ? "RCWN is installed" : "Install RCWN first"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The public site explains the mission. The auth and role-based app screens are designed as an installed PWA experience.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {buttons.map((button) => {
          const Icon = button.icon;
          const isCurrentPlatform = platform === button.platform;

          return (
            <button
              className={`rounded-lg border p-4 text-left transition hover:border-teal-300 hover:bg-teal-50 ${
                isCurrentPlatform ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"
              }`}
              key={button.label}
              onClick={install}
              type="button"
            >
              <Icon aria-hidden className="h-5 w-5 text-teal-700" />
              <span className="mt-3 block text-sm font-bold text-slate-950">{button.label}</span>
              <span className="mt-1 block text-xs text-slate-500">{button.detail}</span>
              {isCurrentPlatform ? (
                <span className="mt-3 inline-flex rounded-full bg-white px-2 py-1 text-[11px] font-bold text-teal-700">
                  Recommended
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
        <div className="flex items-start gap-2">
          {isInstalled ? <CheckCircle2 aria-hidden className="h-4 w-4 flex-none text-teal-700" /> : null}
          <p>{message}</p>
        </div>
        {!canPromptInstall && !isInstalled ? <p className="mt-2 text-slate-500">{manualInstructions}</p> : null}
      </div>
    </section>
  );
}
