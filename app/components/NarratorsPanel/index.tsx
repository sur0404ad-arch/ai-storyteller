"use client";

type Narrator = {
  id: string;
  name: string;
  title: string;
  mood: string;
  description: string;
  accentColor: string;
};

type NarratorsPanelProps = {
  narrators: Narrator[];
  activeNarratorId: string;
  onSelectNarrator: (id: string) => void;
};

export default function NarratorsPanel({
  narrators,
  activeNarratorId,
  onSelectNarrator,
}: NarratorsPanelProps) {
  return (
    <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
      <div className="mb-2">
        <p className="text-[9px] uppercase tracking-[0.24em] text-orange-200/75">
          Narrators
        </p>

        <p className="mt-0.5 text-[10px] text-white/45">
          Choose your atmosphere
        </p>
      </div>

      <div className="space-y-2">
        {narrators.map((narrator) => {
          const isActive = activeNarratorId === narrator.id;

          return (
            <button
              key={narrator.id}
              type="button"
              onClick={() => onSelectNarrator(narrator.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                isActive
                  ? "border-white/20 bg-white/10"
                  : "border-[#6d3720] bg-black/10 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p
                    className="text-[9px] uppercase tracking-[0.2em]"
                    style={{
                      color: narrator.accentColor,
                    }}
                  >
                    {narrator.mood}
                  </p>

                  <h3 className="mt-0.5 text-[13px] font-medium text-white">
                    {narrator.title}
                  </h3>

                  <p className="mt-0.5 text-[10px] text-white/45">
                    {narrator.name}
                  </p>
                </div>

                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: narrator.accentColor,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}