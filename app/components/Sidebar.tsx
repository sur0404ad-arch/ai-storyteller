type Props = {
  books: {
    id: number;
    title: string;
    author: string;
  }[];
  selectedBookId: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectBook: (bookId: string | number) => void;
};

export default function Sidebar({
  books,
  selectedBookId,
  searchValue,
  onSearchChange,
  onSelectBook,
}: Props) {
  return (
    <aside className="h-fit w-full rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 backdrop-blur-[8px] lg:w-[300px] lg:p-5">
      <div className="mb-4 flex items-center rounded-3xl border border-white/10 bg-white/[0.025] px-4 py-3">
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search stories..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />

        <span className="text-lg text-white/60">⌕</span>
      </div>

      <div className="space-y-3">
        {books.map((book) => {
          const active = selectedBookId === String(book.id);

          return (
            <button
              key={book.id}
              onClick={() => onSelectBook(book.id)}
              className={`w-full rounded-[1.6rem] border px-4 py-4 text-left transition ${
                active
                  ? "border-orange-400/60 bg-orange-500/15 shadow-[0_0_28px_rgba(255,120,0,0.16)]"
                  : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
              }`}
            >
              <p className="text-base font-semibold text-white">{book.title}</p>
              <p className="mt-1 text-sm text-white/55">{book.author}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-white/[0.025] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white">
            N
          </div>

          <div>
            <p className="text-base font-medium text-white">AI Storyteller</p>
            <p className="mt-1 text-xs text-white/45">Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
}