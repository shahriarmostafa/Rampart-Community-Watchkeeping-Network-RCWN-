import Link from "next/link";
import { MapPin, Radio, RadioTower } from "lucide-react";

export function JourneyCard({ href = "/safe-walk/active" }: { href?: string }) {
  return (
    <section className="rounded-lg bg-blue-900 p-4 text-white shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-100">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          LIVE JOURNEY
        </span>
        <span className="text-xs text-white/70">Started 9:24 PM</span>
      </div>
      <div className="mt-4 grid gap-2">
        <div className="flex gap-3">
          <Radio aria-hidden className="mt-0.5 h-5 w-5 text-white/80" />
          <div>
            <div className="text-sm font-bold">Dhanmondi 27</div>
            <div className="text-xs text-white/60">Start point</div>
          </div>
        </div>
        <div className="ml-2 h-5 border-l-2 border-dashed border-white/30" />
        <div className="flex gap-3">
          <MapPin aria-hidden className="mt-0.5 h-5 w-5 text-white/80" />
          <div>
            <div className="text-sm font-bold">Mirpur 10, Home</div>
            <div className="text-xs text-white/60">Destination - about 14 min away</div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-[62%] rounded-full bg-teal-300" />
      </div>
      <Link
        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-md bg-teal-600 text-sm font-bold text-white"
        href={href}
      >
        <RadioTower aria-hidden className="h-4 w-4" />
        Open Live Journey
      </Link>
    </section>
  );
}
