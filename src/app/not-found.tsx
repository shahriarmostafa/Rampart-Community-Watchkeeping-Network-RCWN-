import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5">
      <p className="text-sm font-semibold uppercase text-teal-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">The route you opened does not exist in RCWN.</p>
      <Link className="mt-6 font-semibold text-teal-700" href="/">
        Back to home
      </Link>
    </main>
  );
}
