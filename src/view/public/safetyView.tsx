import { AppHeader } from "@/components/layout/appHeader";
import { PageSection } from "@/components/common/pageSection";

const items = ["Share live location with trusted contacts", "Send reports to your area", "Receive push alerts"];

export function SafetyView() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <PageSection>
        <h1 className="text-3xl font-bold text-slate-950">Safety</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {items.map((item) => (
            <div className="rounded-lg border border-slate-200 bg-white p-4" key={item}>
              <p className="font-semibold text-slate-950">{item}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
