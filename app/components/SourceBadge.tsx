type SourceBadgeProps = {
  sourceName?: string;
  sourceType?: string;
};

export default function SourceBadge({
  sourceName,
  sourceType,
}: SourceBadgeProps) {
  if (!sourceName) return null;

  return (
    <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-500/[0.06] px-2.5 py-1 text-[9px] uppercase tracking-[0.13em] text-emerald-200/75">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />

      <span className="truncate">{sourceName}</span>

      {sourceType && (
        <span className="truncate text-emerald-300/55">
          · {sourceType}
        </span>
      )}
    </div>
  );
}