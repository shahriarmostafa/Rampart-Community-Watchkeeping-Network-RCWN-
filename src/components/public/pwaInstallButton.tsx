"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";

export function PwaInstallButton({ className }: { className?: string }) {
  const { canPromptInstall, install, isInstalled, manualInstructions, message } = usePwaInstall();
  const [showHelp, setShowHelp] = useState(false);

  async function handleInstall() {
    await install();
    setShowHelp(true);

    if (!canPromptInstall && !isInstalled) {
      document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <span className="relative inline-flex flex-col items-start gap-2">
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800",
          className,
        )}
        onClick={handleInstall}
        type="button"
      >
        <Download aria-hidden className="h-4 w-4" />
        {isInstalled ? "Installed" : canPromptInstall ? "Install App" : "How to Install"}
      </button>
      {showHelp ? (
        <span className="max-w-xs rounded-md border border-teal-100 bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-600 shadow-sm">
          {isInstalled ? message : canPromptInstall ? message : manualInstructions}
        </span>
      ) : null}
    </span>
  );
}
