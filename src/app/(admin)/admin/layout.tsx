import type { ReactNode } from "react";
import { WebsiteOnlyGate } from "@/components/common/websiteOnlyGate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <WebsiteOnlyGate>{children}</WebsiteOnlyGate>;
}
