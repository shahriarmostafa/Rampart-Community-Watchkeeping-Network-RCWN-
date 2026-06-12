import type { HTMLAttributes, ReactNode } from "react";

type PageSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

export function PageSection({ children, className = "", ...props }: PageSectionProps) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-5 py-10 ${className}`} {...props}>
      {children}
    </section>
  );
}
