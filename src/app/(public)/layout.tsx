import type { ReactNode } from "react";
import { PwaAuthEntry } from "@/components/public/pwaAuthEntry";

export default function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <div className="website-only">{children}</div>
      <div className="pwa-only">
        <PwaAuthEntry />
      </div>
    </>
  );
}
