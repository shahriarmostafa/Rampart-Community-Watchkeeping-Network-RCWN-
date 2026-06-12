import { cn } from "@/lib/utils";

export type FlowStep = {
  title: string;
  description: string;
  state?: "done" | "active" | "pending";
};

export function StatusFlow({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div className="relative grid grid-cols-[24px_1fr] gap-3 pb-4 last:pb-0" key={step.title}>
          {index < steps.length - 1 ? <div className="absolute left-3 top-5 h-full w-px bg-slate-200" /> : null}
          <div
            className={cn(
              "relative z-10 mt-1 h-6 w-6 rounded-full border-4 bg-white",
              step.state === "done" && "border-teal-600 bg-teal-600",
              step.state === "active" && "border-blue-700 bg-blue-700",
              (!step.state || step.state === "pending") && "border-slate-300",
            )}
          />
          <div>
            <div className="text-sm font-bold text-slate-950">{step.title}</div>
            <div className="mt-0.5 text-xs text-slate-500">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
