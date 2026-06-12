import { MobileShell } from "@/components/layout/mobileShell";
import { RoleGate } from "@/components/common/roleGate";
import { ProtectedRouteGate } from "@/components/common/protectedRouteGate";
import { PwaOnlyGate } from "@/components/common/pwaOnlyGate";

export default function TruthKeeperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PwaOnlyGate>
      <ProtectedRouteGate>
        <MobileShell>
          <RoleGate minimumRole="truth_keeper">{children}</RoleGate>
        </MobileShell>
      </ProtectedRouteGate>
    </PwaOnlyGate>
  );
}
