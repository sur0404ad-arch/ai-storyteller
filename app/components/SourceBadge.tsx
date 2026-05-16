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
    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200 lg:text-xs">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />

      <span>{sourceName}</span>

      {sourceType && (
        <span className="text-emerald-300/70">
          • {sourceType}
        </span>
      )}
    </div>
  );
}