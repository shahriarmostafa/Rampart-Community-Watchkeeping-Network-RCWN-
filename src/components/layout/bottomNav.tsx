"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ClipboardList, Home, MapPinned, Megaphone, SearchCheck, ShieldCheck, UserCircle } from "lucide-react";
import { getPrimaryNavigationForRole } from "@/config/navigation";
import { useAuth } from "@/features/auth/useAuth";

const iconByHref = {
  "/home": Home,
  "/safe-walk": MapPinned,
  "/concerns": ClipboardList,
  "/feed": Megaphone,
  "/profile": UserCircle,
  "/nearby-walks": Bell,
  "/verification-center": SearchCheck,
  "/oversight": ShieldCheck,
};

export function BottomNav() {
  const { role } = useAuth();
  const pathname = usePathname();
  const items = getPrimaryNavigationForRole(role);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="grid h-16 grid-cols-5">
        {items.map((item) => {
          const Icon = iconByHref[item.href as keyof typeof iconByHref] ?? Home;
          const active = isActive(item.href);

          return (
            <Link
              className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
