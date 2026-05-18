type Props = {
  books: {
    id: number;
    title: string;
    author: string;
  }[];

  selectedBookId: string;

  searchValue: string;

  onSearchChange: (value: string) => void;

  onSelectBook: (
    bookId: string | number
  ) => void;
};

export default function Sidebar({
  books,
  selectedBookId,
  searchValue,
  onSearchChange,
  onSelectBook,
}: Props) {
  return (
    <aside className="h-fit w-full rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 backdrop-blur-[8px] lg:w-[320px] lg:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-orange-300/75">
            Library
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            Stories
          </h2>
        </div>

        <div className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-orange-200">
          Free
        </div>
      </div>

      <div className="mb-4 flex items-center rounded-3xl border border-white/10 bg-white/[0.025] px-4 py-3">
        <input
          value={searchValue}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search stories..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />

        <span className="text-lg text-white/60">
          ⌕
        </span>
      </div>

      <div className="space-y-3">
        {books.map((book) => {
          const active =
            selectedBookId === String(book.id);

          return (
            <button
              key={book.id}
              onClick={() =>
                onSelectBook(book.id)
              }
              className={`group w-full rounded-[1.6rem] border px-4 py-4 text-left transition-all duration-300 ${
                active
                  ? "border-orange-400/60 bg-orange-500/15 shadow-[0_0_28px_rgba(255,120,0,0.16)]"
                  : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">
                    {book.title}
                  </p>

                  <p className="mt-1 truncate text-sm text-white/55">
                    {book.author}
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-white/55">
                  Free
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-[1.6rem] border border-orange-400/15 bg-gradient-to-br from-orange-500/10 to-transparent px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-300/20 bg-orange-500/10 text-lg text-orange-200">
            ✦
          </div>

          <div>
            <p className="text-base font-medium text-white">
              AI Storyteller
            </p>

            <p className="mt-1 text-xs text-white/45">
              Netflix-style Audio Experience
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs leading-relaxed text-white/60">
            Free library now available.
            Premium voices and full collection
            coming later.
          </p>
        </div>
      </div>
    </aside>
  );
}