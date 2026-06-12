"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationForRole } from "@/config/navigation";
import { useAuth } from "@/features/auth/useAuth";

export function RoleMenu() {
  const { role } = useAuth();
  const pathname = usePathname();
  const items = getNavigationForRole(role);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="-mx-5 mt-4 overflow-x-auto px-5 pb-1">
      <div className="flex gap-2">
        {items.map((item) => (
          <Link
            className={`role-menu__item${isActive(item.href) ? " role-menu__item--active" : ""}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
