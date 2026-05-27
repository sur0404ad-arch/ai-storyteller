"use client";

type NarratorCardProps = {
  name: string;
  title: string;
  mood: string;
  description: string;
  accentColor: string;
  active?: boolean;
  onSelect?: () => void;
};

export default function NarratorCard({
  name,
  title,
  mood,
  description,
  accentColor,
  active = false,
  onSelect,
}: NarratorCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[1.6rem] border p-4 text-left transition-all backdrop-blur-md ${
        active
          ? "border-white/30 bg-white/10"
          : "border-[#6d3720] bg-black/20 hover:bg-white/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{
              color: accentColor,
            }}
          >
            {mood}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-white/55">
            {name}
          </p>
        </div>

        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: accentColor,
          }}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/60">
        {description}
      </p>
    </button>
  );
}