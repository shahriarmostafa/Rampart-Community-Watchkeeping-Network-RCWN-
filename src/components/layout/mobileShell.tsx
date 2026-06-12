import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottomNav";
import { LogoutButton } from "@/components/layout/logoutButton";
import { RoleMenu } from "@/components/layout/roleMenu";
import { SelectedRoleBadge } from "@/components/layout/selectedRoleBadge";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-950 sm:flex sm:justify-center">
      <div className="mx-auto min-h-screen w-full max-w-md overflow-hidden bg-slate-50 shadow-2xl sm:border-x-8 sm:border-slate-950">
        <header className="sticky top-0 z-20 rounded-b-3xl bg-blue-900 px-5 pb-5 pt-4 text-white shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-white/70">
            <span>9:41</span>
            <SelectedRoleBadge />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-lg font-bold">R</div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold leading-none">RCWN</div>
              <div className="mt-1 text-xs text-white/60">Rampart Community Watchkeeping Network</div>
            </div>
            <LogoutButton />
          </div>
          <RoleMenu />
        </header>
        <main className="min-h-[calc(100vh-8rem)] px-4 py-5 pb-24">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
