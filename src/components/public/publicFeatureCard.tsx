import type { LucideIcon } from "lucide-react";

export function PublicFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700">
        <Icon aria-hidden className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
