import type { ReactNode } from "react";
import { AuthRouteGate } from "@/components/common/authRouteGate";
import { PwaOnlyGate } from "@/components/common/pwaOnlyGate";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PwaOnlyGate>
      <AuthRouteGate>{children}</AuthRouteGate>
    </PwaOnlyGate>
  );
}
