type FeaturePageViewProps = {
  title: string;
  description?: string;
};

export function FeaturePageView({ title, description }: FeaturePageViewProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase text-teal-700">RCWN</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-950">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  );
}
