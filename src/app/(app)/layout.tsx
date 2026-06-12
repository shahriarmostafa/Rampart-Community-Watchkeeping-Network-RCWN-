import { MobileShell } from "@/components/layout/mobileShell";
import { ProtectedRouteGate } from "@/components/common/protectedRouteGate";
import { PwaOnlyGate } from "@/components/common/pwaOnlyGate";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PwaOnlyGate>
      <ProtectedRouteGate>
        <MobileShell>{children}</MobileShell>
      </ProtectedRouteGate>
    </PwaOnlyGate>
  );
}
