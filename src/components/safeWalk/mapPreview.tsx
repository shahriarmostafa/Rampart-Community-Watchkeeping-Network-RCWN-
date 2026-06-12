export function MapPreview() {
  return (
    <div className="relative h-48 overflow-hidden rounded-lg border border-slate-200 bg-[repeating-linear-gradient(45deg,#e8eef8_0_16px,#f1f5fb_16px_32px)]">
      <div className="absolute left-0 right-0 top-[42%] h-3 bg-slate-300" />
      <div className="absolute bottom-0 left-[56%] top-0 w-3 bg-slate-300" />
      <div className="absolute left-[48%] top-[45%] h-5 w-5 rounded-full bg-blue-700 shadow-[0_0_0_8px_rgba(29,78,216,0.18)]" />
      <div className="absolute left-[20%] top-[20%] rounded-md bg-white px-3 py-2 text-sm font-bold text-teal-700 shadow-sm">
        Guard
      </div>
      <div className="absolute bottom-[22%] right-[18%] rounded-md bg-white px-3 py-2 text-sm font-bold text-violet-700 shadow-sm">
        Circle
      </div>
    </div>
  );
}
