import Link from "next/link";
import { HeartPulse, LifeBuoy, Phone } from "lucide-react";

const items = [
  { label: "999", detail: "National Emergency", icon: Phone, href: "tel:999", className: "bg-rose-600" },
  { label: "109", detail: "Women's Helpline", icon: HeartPulse, href: "tel:109", className: "bg-violet-700" },
  { label: "Support", detail: "NGO / Legal Aid", icon: LifeBuoy, href: "/support", className: "bg-teal-700" },
];

export function EmergencyStrip() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            className={`${item.className} flex min-h-20 flex-col items-center justify-center rounded-lg px-2 text-center text-white shadow-sm`}
            href={item.href}
            key={item.label}
          >
            <Icon aria-hidden className="h-5 w-5" />
            <span className="mt-1 text-sm font-bold">{item.label}</span>
            <span className="mt-0.5 text-[10px] font-semibold leading-tight text-white/80">{item.detail}</span>
          </Link>
        );
      })}
    </div>
  );
}
