import { Check, MapPin, Users } from "lucide-react";

export function SafetyHero() {
  return (
    <section className="relative overflow-hidden rounded-lg bg-teal-700 p-5 text-white shadow-sm">
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-100">Your Safety Status</p>
        <h2 className="mt-1 text-3xl font-bold">All Safe</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-teal-50">
          <MapPin aria-hidden className="h-4 w-4" />
          Mirpur 10, Dhaka - Verified Community
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-teal-50">
          <Users aria-hidden className="h-4 w-4" />
          <strong>2 female watchers</strong> available within 1 km
        </p>
      </div>
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
      <div className="absolute bottom-5 right-5 grid h-14 w-14 place-items-center rounded-full border-2 border-white/50">
        <Check aria-hidden className="h-7 w-7" />
      </div>
    </section>
  );
}
