import Link from "next/link";
import { LogIn, ShieldCheck, UserPlus } from "lucide-react";

export function PwaAuthEntry() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-teal-700 text-white">
            <ShieldCheck aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">RCWN</h1>
            <p className="text-sm text-slate-500">Installed app</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          Sign in or create an account to use Safe Walk, reports, feed, and role-based dashboards.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-bold text-white"
            href="/login"
          >
            <LogIn aria-hidden className="h-4 w-4" />
            Login
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white text-sm font-bold text-slate-950"
            href="/register"
          >
            <UserPlus aria-hidden className="h-4 w-4" />
            Sign Up
          </Link>
          <Link className="text-center text-sm font-bold text-teal-700" href="/verify-phone">
            Verify phone
          </Link>
        </div>
      </section>
    </main>
  );
}
