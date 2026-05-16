type Book = {
  id: string | number;
  title: string;
  author: string;
};

type SidebarProps = {
  books: Book[];
  selectedBookId: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectBook: (bookId: string) => void;
};

export default function Sidebar({
  books,
  selectedBookId,
  searchValue,
  onSearchChange,
  onSelectBook,
}: SidebarProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
      <input
        type="text"
        placeholder="Search stories..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/35"
      />

      <div className="flex flex-col gap-3">
        {books.map((book) => {
          const bookId = String(book.id);

          return (
            <button
              key={bookId}
              onClick={() => onSelectBook(bookId)}
              className={`rounded-3xl border p-4 text-left transition ${
                selectedBookId === bookId
                  ? "border-orange-500 bg-orange-500/20"
                  : "border-white/10 bg-black/20 hover:bg-white/5"
              }`}
            >
              <p className="text-sm font-medium">{book.title}</p>
              <p className="text-xs text-white/50">{book.author}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}