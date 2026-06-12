export type TeamMember = {
  name: string;
  role: string;
  focus?: string;
};

export type TeamDivision = {
  name: string;
  description: string;
  members: TeamMember[];
};

export function TeamDivisionCard({ division }: { division: TeamDivision }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-950">{division.name}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{division.description}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {division.members.map((member) => (
          <article className="rounded-lg border border-slate-100 bg-slate-50 p-3" key={member.name}>
            <div className="flex gap-3">
              <div className="grid h-14 w-14 flex-none place-items-center rounded-md bg-slate-200 text-sm font-bold text-slate-500">
                Photo
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-950">{member.name}</div>
                <div className="mt-1 text-xs text-slate-500">{member.role}</div>
              </div>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-bold text-teal-700">View details</summary>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {member.focus ?? "Supports RCWN operations with privacy-aware, community-first execution."}
              </p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
