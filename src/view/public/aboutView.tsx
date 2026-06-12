import { Eye, FileWarning, HeartHandshake, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { PageSection } from "@/components/common/pageSection";
import { PublicFeatureCard } from "@/components/public/publicFeatureCard";
import { TeamDivisionCard, type TeamDivision } from "@/components/public/teamDivision";

const philosophy = [
  {
    icon: ShieldCheck,
    title: "Protect First",
    description: "The first goal is immediate support when someone feels unsafe, not public blame or spectacle.",
  },
  {
    icon: Eye,
    title: "Verify Before Publicity",
    description: "Reports are private and structured so rumors, false accusations, and moral policing cannot become public harm.",
  },
  {
    icon: HeartHandshake,
    title: "Support Before Escalation",
    description: "Counseling, legal aid, shelter, medical support, and survivor consent are central to the response model.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy By Design",
    description: "Location trails, evidence, and report details are treated as sensitive safety data, not ordinary app content.",
  },
  {
    icon: FileWarning,
    title: "Anti-Weaponization",
    description: "Lifestyle complaints, gossip, revenge reports, and private-life policing are outside the system's purpose.",
  },
  {
    icon: MapPinned,
    title: "Coverage Honesty",
    description: "RCWN should never create false confidence. When coverage is weak, emergency fallback paths are made clear.",
  },
];

const divisions: TeamDivision[] = [
  {
    name: "Central Leadership",
    description: "Owns mission, ethics, partnerships, governance, and platform direction.",
    members: [
      { name: "Afsana Rahman", role: "Founder", focus: "Sets product ethics, survivor-consent policy, and long-term governance direction." },
      { name: "Maliha Chowdhury", role: "Director of Safety Policy", focus: "Owns verification rules, escalation boundaries, and anti-weaponization safeguards." },
      { name: "Nabila Karim", role: "Director of Community Operations", focus: "Coordinates watchers, truth keepers, guardians, and pilot-area operating procedures." },
      { name: "Samira Hossain", role: "Director of Partnerships", focus: "Builds NGO, legal aid, medical, shelter, and institutional support channels." },
      { name: "Raisa Islam", role: "Governance Coordinator", focus: "Maintains transparency practices, review cadences, and oversight board communication." },
    ],
  },
  {
    name: "Developers Team",
    description: "Builds the app, role-based interface, safety workflows, realtime systems, and backend integrations.",
    members: [
      { name: "Arif Mahmud", role: "Frontend Lead", focus: "Builds role-based app screens, PWA install experience, and mobile-first workflows." },
      { name: "Tasnima Akter", role: "Backend Engineer", focus: "Plans future Express, MongoDB, auth, and audit-log integration." },
      { name: "Nusrat Jahan", role: "Product Designer", focus: "Designs low-friction safety flows for citizens, watchers, truth keepers, and guardians." },
      { name: "Shuvo Sarker", role: "Realtime Systems Engineer", focus: "Shapes live Safe Walk updates, push alerts, sockets, and coverage-aware fallbacks." },
      { name: "Lamisa Noor", role: "QA and Accessibility Engineer", focus: "Tests mobile usability, accessibility, low-bandwidth states, and safe failure modes." },
    ],
  },
  {
    name: "Marketing Team",
    description: "Creates awareness campaigns, trust messaging, public education, and community onboarding materials.",
    members: [
      { name: "Mehjabin Sultana", role: "Marketing Lead", focus: "Creates public trust campaigns without overpromising coverage or anonymity." },
      { name: "Fariha Ahmed", role: "Community Campaign Manager", focus: "Runs ward-level awareness and safe commute education." },
      { name: "Sadia Rahman", role: "Content Strategist", focus: "Writes explainers for Safe Walk, protected reports, evidence vault, and support options." },
      { name: "Rifat Hasan", role: "Partnership Communications", focus: "Coordinates communications with universities, NGOs, and institutional partners." },
      { name: "Tanvir Alam", role: "Digital Outreach Coordinator", focus: "Manages social channels, app install campaigns, and safety education posts." },
    ],
  },
  {
    name: "Training Team",
    description: "Prepares watchers, truth keepers, and guardians with response boundaries, consent rules, and privacy practices.",
    members: [
      { name: "Dr. Shahana Begum", role: "Training Director", focus: "Owns training curriculum for survivor consent, privacy, and response boundaries." },
      { name: "Jannatul Ferdous", role: "Watcher Training Lead", focus: "Teaches watchers to observe, support, and summon help without confrontation." },
      { name: "Mahmuda Haque", role: "Guardian Training Lead", focus: "Prepares guardians for oversight, misuse prevention, and sensitive-case review." },
      { name: "Sabrina Mitu", role: "Survivor Consent Facilitator", focus: "Trains teams on outreach only through channels the survivor controls." },
      { name: "Rokeya Tasnim", role: "Safety Protocol Coach", focus: "Maintains practical protocols for danger alerts, missing cases, and domestic violence reports." },
    ],
  },
  {
    name: "Planning Team",
    description: "Plans rollout, pilot coverage, support-partner coordination, risk operations, and long-term sustainability.",
    members: [
      { name: "Imran Hossain", role: "Planning Lead", focus: "Plans phased rollout from pilot wards toward district-by-district expansion." },
      { name: "Farzana Naznin", role: "Pilot Operations Planner", focus: "Designs founding watcher coverage, guardian availability, and response drills." },
      { name: "Sanjida Akter", role: "Support Partner Coordinator", focus: "Maps legal aid, counseling, shelter, medical, and police-contact pathways." },
      { name: "Rumana Begum", role: "Coverage and Ward Mapping", focus: "Maintains honest coverage maps and no-coverage fallback messaging." },
      { name: "Nayeem Rahman", role: "Impact Measurement Analyst", focus: "Tracks response times, trust indicators, misuse attempts, and safety outcomes." },
    ],
  },
];

export function AboutView() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />
      <PageSection className="py-14">
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">About RCWN</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">
          A community safety network built for prevention, verification, and support.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          RCWN is inspired by a simple truth: many incidents are never reported, even though neighbors, friends, colleagues, and teachers often know something is wrong before harm escalates. The platform creates a structured way to ask for help, file protected reports, verify sensitive situations, and connect people with trusted support.
        </p>
      </PageSection>

      <PageSection className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {philosophy.map((item) => (
            <PublicFeatureCard key={item.title} {...item} />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Roles unlock responsibility.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Citizens can start Safe Walks, file reports, read verified feed updates, and manage profile settings. Watchers inherit citizen access and help watch nearby Safe Walk requests. Truth Keepers verify sensitive reports and evidence. Community Guardians inherit all previous access and will later receive additional oversight tools.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              ["Citizen", "Safe Walk, reports, feed, profile"],
              ["Watcher", "Citizen access plus nearby Safe Walk requests"],
              ["Truth Keeper", "Watcher access plus report and evidence verification"],
              ["Community Guardian", "All previous access plus future oversight tools"],
            ].map(([role, detail]) => (
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={role}>
                <div className="font-bold text-slate-950">{role}</div>
                <div className="mt-1 text-sm text-slate-500">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Our Team</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Five divisions supporting one safety mission.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            These teams reflect the current operating model for product, outreach, training, planning, and central leadership.
          </p>
        </div>
        <div className="grid gap-5">
          {divisions.map((division) => (
            <TeamDivisionCard division={division} key={division.name} />
          ))}
        </div>
      </PageSection>
    </main>
  );
}
