"use client";

type PlayerCardProps = {
  title: string;
  author: string;
  formattedCurrentTime: string;
  formattedDuration: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedVoiceName: string;
  onSeek: (value: number) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  children?: React.ReactNode;
};

export default function PlayerCard({
  title,
  author,
  formattedCurrentTime,
  formattedDuration,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  onRestart,
  children,
}: PlayerCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl lg:p-6">
      <p className="mb-2 text-xs uppercase tracking-[0.28em] text-orange-300/70">
        Now Playing
      </p>

      <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
        {title}
      </h1>

      <p className="mt-2 text-sm text-white/55">{author}</p>

      <p className="mt-5 text-xs uppercase tracking-[0.2em] text-orange-300/70">
        Continue From {formattedCurrentTime}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-white/50">
          <span>{formattedCurrentTime}</span>

          <span>{formattedDuration}</span>
        </div>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onTogglePlay}
          className="rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition hover:bg-orange-400"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={onRestart}
          className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base text-white/80 transition hover:bg-white/10"
        >
          Restart
        </button>
      </div>

      {children}
    </div>
  );
}