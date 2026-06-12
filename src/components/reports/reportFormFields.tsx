import { Input } from "@/components/ui/input";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mt-4 block text-sm font-bold text-slate-900">{children}</label>;
}

export function TextArea({
  placeholder,
  rows = 4,
}: {
  placeholder: string;
  rows?: number;
}) {
  return (
    <textarea
      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
      placeholder={placeholder}
      rows={rows}
    />
  );
}

export function FormInput({ placeholder, value }: { placeholder?: string; value?: string }) {
  return <Input className="mt-2" placeholder={placeholder} readOnly={Boolean(value)} value={value} />;
}
