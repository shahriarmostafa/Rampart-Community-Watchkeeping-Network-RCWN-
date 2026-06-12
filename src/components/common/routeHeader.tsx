import type { ReactNode } from "react";

export function RouteHeader({
  eyebrow = "RCWN",
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
