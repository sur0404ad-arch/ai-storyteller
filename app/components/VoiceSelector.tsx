type Voice = {
  id: string;
  name: string;
};

type VoiceSelectorProps = {
  voices: Voice[];
  selectedVoiceId: string;
  selectedVoiceName: string;
  onSelectVoice: (voiceId: string) => void;
};

export default function VoiceSelector({
  voices,
  selectedVoiceId,
  selectedVoiceName,
  onSelectVoice,
}: VoiceSelectorProps) {
  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-orange-300/70">
          Voices
        </p>

        <p className="truncate text-[11px] text-white/45">
          Active: {selectedVoiceName}
        </p>
      </div>

      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onSelectVoice(voice.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
              selectedVoiceId === voice.id
                ? "border-orange-400 bg-orange-500/20 text-white"
                : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
            }`}
          >
            {voice.name}
          </button>
        ))}
      </div>
    </div>
  );
}