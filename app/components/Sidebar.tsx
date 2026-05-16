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
    <aside className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2 backdrop-blur-md lg:rounded-3xl lg:p-4 lg:backdrop-blur-xl">
      <input
        type="text"
        placeholder="Search stories..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="mb-2 h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs outline-none placeholder:text-white/35 lg:mb-4 lg:h-auto lg:rounded-2xl lg:px-4 lg:py-3 lg:text-sm"
      />

      <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-col lg:gap-3">
        {books.map((book) => {
          const bookId = String(book.id);

          return (
            <button
              key={bookId}
              onClick={() => onSelectBook(bookId)}
              className={`h-[78px] overflow-hidden rounded-2xl border p-2 text-left transition lg:h-auto lg:rounded-3xl lg:p-4 ${
                selectedBookId === bookId
                  ? "border-orange-500 bg-orange-500/15"
                  : "border-white/10 bg-black/20 hover:bg-white/5"
              }`}
            >
              <p className="line-clamp-2 text-sm font-medium leading-tight lg:text-sm">
                {book.title}
              </p>

              <p className="mt-1 truncate text-xs text-white/50">
                {book.author}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}