"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useDisplayMode } from "@/hooks/useDisplayMode";

export function WebsiteOnlyGate({ children }: { children: ReactNode }) {
  const { isResolved, isStandalone } = useDisplayMode();

  if (!isResolved) {
    return null;
  }

  if (!isStandalone) {
    return children;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
        <Smartphone aria-hidden className="mx-auto h-10 w-10 text-teal-700" />
        <h1 className="mt-4 text-xl font-bold text-slate-950">Admin opens on the website</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The installed app is for citizens and role-based safety work. Admin review tools stay on the browser website.
        </p>
        <Link
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white"
          href="/"
        >
          <Monitor aria-hidden className="h-4 w-4" />
          Open website home
        </Link>
      </section>
    </main>
  );
}
