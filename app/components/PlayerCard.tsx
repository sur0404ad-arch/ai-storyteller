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
    <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:h-auto lg:rounded-[2rem] lg:p-7">
      <p className="mb-1 text-[9px] uppercase tracking-[0.26em] text-orange-300/75 lg:mb-3 lg:text-[11px]">
        Now Playing
      </p>

      <h1 className="line-clamp-2 text-2xl font-semibold leading-[1.02] tracking-[-0.04em] lg:max-w-4xl lg:text-5xl">
        {title}
      </h1>

      <p className="mt-1 truncate text-xs text-white/55 lg:mt-3 lg:text-sm">
        {author}
      </p>

      <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-orange-300/70 lg:mt-5 lg:text-[11px]">
        Continue From {formattedCurrentTime}
      </p>

      <div className="mt-2 lg:mt-5">
        <div className="mb-1 flex justify-between text-[10px] text-white/45 lg:text-xs">
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
          className="w-full cursor-pointer accent-orange-500"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 lg:mt-6 lg:gap-3">
        <button
          onClick={onTogglePlay}
          className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:scale-[1.02] hover:bg-orange-400 lg:px-7 lg:py-3 lg:text-sm"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={onRestart}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs text-white/80 transition hover:bg-white/10 lg:px-6 lg:py-3 lg:text-sm"
        >
          Restart
        </button>
      </div>

      {children}
    </div>
  );
}