type Chapter = {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
};

type ChapterListProps = {
  chapters: Chapter[];
  activeChapterId: number;
  onSelectChapter: (chapterId: number) => void;
};

export default function ChapterList({
  chapters,
  activeChapterId,
  onSelectChapter,
}: ChapterListProps) {
  return (
    <div className="mt-5 lg:mt-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] text-orange-200/70 lg:text-xs">
          Chapters
        </p>

        <p className="text-[10px] text-white/40 lg:text-xs">
          {chapters.length} Chapters
        </p>
      </div>

      <div className="space-y-2">
        {chapters.map((chapter) => {
          const isActive =
            chapter.id === activeChapterId;

          return (
            <button
              key={chapter.id}
              onClick={() =>
                onSelectChapter(chapter.id)
              }
              className={`w-full rounded-2xl border p-3 text-left transition ${
                isActive
                  ? "border-orange-400/40 bg-orange-500/10"
                  : "border-white/8 bg-black/10 hover:bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {chapter.title}
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    {chapter.subtitle}
                  </p>
                </div>

                <p className="text-[10px] text-white/35">
                  {chapter.duration}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}