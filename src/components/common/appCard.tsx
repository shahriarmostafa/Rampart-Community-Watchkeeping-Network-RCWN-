import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
};

export function AppCard({ children, className, ...props }: AppCardProps) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white p-4 shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
