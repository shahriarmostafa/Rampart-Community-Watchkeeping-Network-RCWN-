import { Heart, ShieldCheck } from "lucide-react";
import { AppCard } from "@/components/common/appCard";
import { AppChip, type ChipTone } from "@/components/common/appChip";
import { PersonRow } from "@/components/common/personRow";

export function FeedCard({
  tag,
  tone,
  author,
  detail,
  body,
  initials,
}: {
  tag: string;
  tone: ChipTone;
  author: string;
  detail: string;
  body: string;
  initials: string;
}) {
  return (
    <AppCard>
      <AppChip tone={tone}>{tag}</AppChip>
      <div className="mt-3">
        <PersonRow initials={initials} name={author} detail={detail} toneIndex={2} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{body}</p>
      <div className="mt-3 flex gap-5 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck aria-hidden className="h-4 w-4" />
          Verified
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart aria-hidden className="h-4 w-4" />
          Save
        </span>
      </div>
    </AppCard>
  );
}
