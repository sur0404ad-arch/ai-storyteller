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
    <div className="mt-6">
      <p className="mb-4 text-xs uppercase tracking-[0.28em] text-orange-300/70">
        Voices
      </p>

      <div className="flex flex-wrap gap-2">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onSelectVoice(voice.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selectedVoiceId === voice.id
                ? "border-orange-400 bg-orange-500/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            {voice.name}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-white/45">
        Active Voice: {selectedVoiceName}
      </p>
    </div>
  );
}