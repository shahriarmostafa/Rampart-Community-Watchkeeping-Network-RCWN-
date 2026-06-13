import { ShieldCheck } from "lucide-react";

export function AuthLoader({ message = "Preparing your RCWN session..." }: { message?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-teal-50 text-teal-700">
          <ShieldCheck aria-hidden className="h-7 w-7" />
        </div>
        <div className="mx-auto mt-5 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-700" />
        <h1 className="mt-5 text-lg font-bold text-slate-950">Loading</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
      </section>
    </main>
  );
}
