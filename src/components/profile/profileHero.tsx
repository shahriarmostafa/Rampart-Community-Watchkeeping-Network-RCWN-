import { AppChip } from "@/components/common/appChip";

export function ProfileHero({
  initials,
  name,
  label,
  detail,
  tone = "teal",
}: {
  initials: string;
  name: string;
  label: string;
  detail: string;
  tone?: "teal" | "purple";
}) {
  const bg = tone === "teal" ? "bg-teal-700" : "bg-violet-950";

  return (
    <section className={`${bg} rounded-lg p-5 text-center text-white shadow-sm`}>
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-white/15 text-2xl font-bold ring-4 ring-white/25">
        {initials}
      </div>
      <div className="mt-3">
        <AppChip tone={tone === "teal" ? "teal" : "gold"} className="bg-white/90">
          {label}
        </AppChip>
      </div>
      <h1 className="mt-3 text-2xl font-bold">{name}</h1>
      <p className="mt-2 text-xs text-white/80">{detail}</p>
    </section>
  );
}
