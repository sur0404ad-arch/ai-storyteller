"use client";

import SourceBadge from "./SourceBadge";

type Chapter = {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
};

type PlayerCardProps = {
  title: string;
  author: string;
  formattedCurrentTime: string;
  formattedDuration: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isLoadingAudio?: boolean;
  selectedVoiceName: string;
  sourceName?: string;
  sourceType?: string;
  chapters?: Chapter[];
  activeChapterId?: number;
  hasPreviousChapter?: boolean;
  hasNextChapter?: boolean;
  onSelectChapter?: (chapterId: number) => void;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
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
  isLoadingAudio = false,
  sourceName,
  sourceType,
  chapters = [],
  activeChapterId = 1,
  hasPreviousChapter = false,
  hasNextChapter = false,
  onSelectChapter = () => {},
  onPreviousChapter = () => {},
  onNextChapter = () => {},
  onSeek,
  onTogglePlay,
  onRestart,
  children,
}: PlayerCardProps) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-[2px] lg:rounded-[2rem] lg:p-7">
      <p className="mb-1 text-[9px] uppercase tracking-[0.26em] text-orange-300/75 lg:mb-3 lg:text-[11px]">
        Now Playing
      </p>

      <h1 className="line-clamp-1 text-2xl font-semibold leading-[1] tracking-[-0.04em] lg:max-w-4xl lg:text-5xl">
        {title}
      </h1>

      <p className="mt-1 truncate text-xs text-white/55 lg:mt-3 lg:text-sm">
        {author}
      </p>

      <SourceBadge sourceName={sourceName} sourceType={sourceType} />

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
          onClick={onPreviousChapter}
          disabled={!hasPreviousChapter || isLoadingAudio}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 lg:px-5 lg:py-3 lg:text-sm"
        >
          Previous
        </button>

        <button
          onClick={onTogglePlay}
          disabled={isLoadingAudio}
          className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:scale-[1.02] hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70 lg:px-7 lg:py-3 lg:text-sm"
        >
          {isLoadingAudio
            ? "Generating Voice..."
            : isPlaying
            ? "Pause"
            : "Play"}
        </button>

        <button
          onClick={onNextChapter}
          disabled={!hasNextChapter || isLoadingAudio}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 lg:px-5 lg:py-3 lg:text-sm"
        >
          Next
        </button>

        <button
          onClick={onRestart}
          disabled={isLoadingAudio}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 lg:px-6 lg:py-3 lg:text-sm"
        >
          Restart
        </button>
      </div>

      {chapters.length > 0 && (
        <div className="mt-5 lg:mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-200/70 lg:text-xs">
              Chapters
            </p>

            <p className="text-[10px] text-white/40 lg:text-xs">
              {chapters.length} Chapters
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {chapters.map((chapter) => {
              const active = chapter.id === activeChapterId;

              return (
                <button
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter.id)}
                  disabled={isLoadingAudio}
                  className={`min-w-[170px] rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 lg:min-w-[190px] ${
                    active
                      ? "border-orange-400/50 bg-orange-500/10"
                      : "border-white/10 bg-black/10 hover:bg-white/5"
                  }`}
                >
                  <p className="text-sm font-medium text-white">
                    {chapter.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs text-white/45">
                    {chapter.subtitle}
                  </p>

                  <p className="mt-4 text-[10px] text-white/35">
                    {chapter.duration}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 lg:mt-6">{children}</div>
    </div>
  );
}