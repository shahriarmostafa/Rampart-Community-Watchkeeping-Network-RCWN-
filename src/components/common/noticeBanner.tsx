import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  safe: "border-teal-100 bg-teal-50 text-teal-800",
  info: "border-sky-100 bg-sky-50 text-sky-800",
  warn: "border-amber-100 bg-amber-50 text-amber-800",
  danger: "border-rose-100 bg-rose-50 text-rose-800",
  guardian: "border-violet-100 bg-violet-50 text-violet-800",
};

export function NoticeBanner({
  icon: Icon,
  children,
  tone = "info",
}: {
  icon: LucideIcon;
  children: ReactNode;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <div className={cn("flex gap-3 rounded-lg border p-3 text-sm leading-6", toneStyles[tone])}>
      <Icon aria-hidden className="mt-0.5 h-5 w-5 flex-none" />
      <div>{children}</div>
    </div>
  );
}
