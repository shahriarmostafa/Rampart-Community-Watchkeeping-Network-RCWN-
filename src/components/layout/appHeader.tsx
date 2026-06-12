"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { publicNavigation } from "@/config/navigation";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link className="flex items-center gap-2 font-bold text-slate-950" href="/">
          <ShieldCheck aria-hidden className="h-6 w-6 text-teal-700" />
          <span>RCWN</span>
        </Link>
        <nav className="hidden items-center gap-5 sm:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`app-header__nav-link${pathname === item.href ? " app-header__nav-link--active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
