import type { ReactNode } from "react";

export function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-6 flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
      <span>{children}</span>
      {action}
    </div>
  );
}
