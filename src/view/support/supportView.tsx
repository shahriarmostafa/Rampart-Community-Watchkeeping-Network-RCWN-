import { Banknote, Building2, Compass, HeartPulse, Home, LifeBuoy, Phone, ShieldCheck } from "lucide-react";
import { NoticeBanner } from "@/components/common/noticeBanner";
import { RouteHeader } from "@/components/common/routeHeader";
import { SectionLabel } from "@/components/common/sectionLabel";
import { EmergencyStrip } from "@/components/safeWalk/emergencyStrip";
import { SupportResourceCard } from "@/components/support/supportResourceCard";

export function SupportView() {
  return (
    <div className="grid gap-4">
      <RouteHeader title="Platform Support" subtitle="Professional help." />
      <SectionLabel>Emergency Numbers</SectionLabel>
      <EmergencyStrip />
      <NoticeBanner icon={Building2} tone="info">
        Platform Authority coordinates professional help. Police referral requires survivor informed consent except in immediate life-threatening situations.
      </NoticeBanner>
      <SectionLabel>Professional Support</SectionLabel>
      <SupportResourceCard description="Free legal aid - partner organizations" icon={Banknote} title="Legal Support" tone="blue" />
      <SupportResourceCard description="Confidential trauma support" icon={LifeBuoy} title="Counseling Support" tone="purple" />
      <SupportResourceCard description="Partner shelter network" icon={Home} title="Shelter / Safe Housing" tone="teal" />
      <SupportResourceCard description="Emergency and follow-up care" icon={HeartPulse} title="Medical Support" tone="red" />
      <SectionLabel>Evidence & Documentation</SectionLabel>
      <SupportResourceCard description="Encrypted, timestamped photos, audio and notes" icon={ShieldCheck} title="Evidence Vault" tone="blue" />
      <SupportResourceCard description="Step-by-step support journey" icon={Compass} title="Case Guidance" tone="blue" />
      <NoticeBanner icon={Phone} tone="warn">
        You are never required to report to police. This option is here when you are ready and choose to use it.
      </NoticeBanner>
    </div>
  );
}
