import Link from "next/link";
import { ClipboardCheck, MapPinned, ShieldCheck, UsersRound } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";

const adminAreas = [
  {
    title: "Watcher applications",
    description: "Review citizen applications and approve or reject watcher access.",
    href: "/admin/watcher-applications",
    icon: ClipboardCheck,
  },
  {
    title: "Add block",
    description: "Pick coordinates, generate a geohash block, and save it to MongoDB.",
    href: "/admin/geo-blocks/add",
    icon: MapPinned,
  },
  {
    title: "Manage blocks",
    description: "View saved blocks on a map and edit their boundaries or address labels.",
    href: "/admin/geo-blocks",
    icon: MapPinned,
  },
  {
    title: "User roles",
    description: "Set any user's access as citizen, watcher, truth keeper, or guardian.",
    href: "/admin/user-roles",
    icon: UsersRound,
  },
  {
    title: "Safety governance",
    description: "Future area for policies, audit checks, and escalation rules.",
    href: "/admin",
    icon: ShieldCheck,
  },
];

export function AdminDashboardView() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Website admin</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-5xl">RCWN admin console</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Admin tools run on the website, while citizens and role-based safety workflows stay inside the installed app.
        </p>
        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminAreas.map((area) => {
            const Icon = area.icon;

            return (
              <Link
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                href={area.href}
                key={area.title}
              >
                <span className="grid h-12 w-12 place-items-center rounded-md bg-teal-50 text-teal-700">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-slate-950">{area.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
