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
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/10 p-5 shadow-2xl shadow-black/30 backdrop-blur-[2px] lg:rounded-[2rem] lg:p-6">
      <p className="mb-2 text-[10px] uppercase tracking-[0.26em] text-orange-300/75">
        Now Playing
      </p>

      <h1 className="max-w-full break-words text-4xl font-semibold leading-tight tracking-[-0.03em] lg:text-[3rem]">
        {title}
      </h1>

      <p className="mt-3 text-sm text-white/55">
        {author}
      </p>

      <div className="mt-3">
        <SourceBadge
          sourceName={sourceName}
          sourceType={sourceType}
        />
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-orange-300/70">
        Continue From {formattedCurrentTime}
      </p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[11px] text-white/45">
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

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onPreviousChapter}
          disabled={!hasPreviousChapter || isLoadingAudio}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Previous
        </button>

        <button
          onClick={onTogglePlay}
          disabled={isLoadingAudio}
          className="rounded-full bg-orange-500 px-7 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:scale-[1.02] hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
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
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
        </button>

        <button
          onClick={onRestart}
          disabled={isLoadingAudio}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Restart
        </button>
      </div>

      {chapters.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-200/70">
              Chapters
            </p>

            <p className="text-[11px] text-white/40">
              {chapters.length} Chapters
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chapters.map((chapter) => {
              const active = chapter.id === activeChapterId;

              return (
                <button
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter.id)}
                  disabled={isLoadingAudio}
                  className={`min-w-[170px] rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
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

                  <p className="mt-3 text-[10px] text-white/35">
                    {chapter.duration}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}