"use client";

import { useMemo, useState } from "react";

type SidebarBook = {
  id: number;
  title: string;
  author: string;
  access?: "free" | "premium";
};

type Props = {
  books: SidebarBook[];
  selectedBookId: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectBook: (bookId: string | number) => void;
};

const FALLBACK_LIBRARY: SidebarBook[] = [
  {
    id: 1,
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    access: "free",
  },
  {
    id: 2,
    title: "Dracula",
    author: "Bram Stoker",
    access: "free",
  },
];

const PREMIUM_BOOKS = [
  { title: "Harry Potter", author: "J.K. Rowling" },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
  { title: "Dune", author: "Frank Herbert" },
  { title: "The Alchemist", author: "Paulo Coelho" },
];

export default function Sidebar({
  books,
  selectedBookId,
  searchValue,
  onSearchChange,
  onSelectBook,
}: Props) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState(false);

  const visibleBooks = useMemo(() => {
    const incomingBooks = Array.isArray(books) ? books : [];
    const mergedBooks: SidebarBook[] = [];

    [...incomingBooks, ...FALLBACK_LIBRARY].forEach((book) => {
      const exists = mergedBooks.some(
        (item) =>
          String(item.id) === String(book.id) ||
          item.title.toLowerCase().trim() === book.title.toLowerCase().trim()
      );

      if (!exists) {
        mergedBooks.push(book);
      }
    });

    const query = searchValue.toLowerCase().trim();

    if (!query) return mergedBooks;

    return mergedBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [books, searchValue]);

  function openPremiumModal() {
    setPremiumMessage(false);
    setShowPremiumModal(true);
  }

  function handlePremiumClick() {
    setPremiumMessage(true);
  }

  return (
    <aside className="relative flex h-[calc(100svh-2rem)] w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 backdrop-blur-[8px] lg:h-full lg:w-[320px] lg:rounded-[2rem] lg:p-5">
      <div className="shrink-0">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-orange-300/75">
            Library
          </p>

          <h2 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.05em] text-white lg:text-2xl">
            Stories
          </h2>
        </div>

        <div className="mb-4 flex items-center rounded-[1.6rem] border border-white/10 bg-white/[0.025] px-4 py-3 lg:rounded-3xl">
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search stories..."
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/35 lg:text-sm"
          />

          <span className="text-xl text-white/60 lg:text-lg">⌕</span>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-orange-300/75">
            Free Library
          </p>

          <p className="text-[10px] text-white/40">
            {visibleBooks.length} books
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleBooks.length > 0 ? (
          <>
            <div className="space-y-2.5 lg:space-y-3">
              {visibleBooks.map((book) => {
                const active = selectedBookId === String(book.id);

                return (
                  <button
                    key={`${book.id}-${book.title}`}
                    type="button"
                    onClick={() => onSelectBook(book.id)}
                    className={`group w-full rounded-[1.35rem] border px-4 py-3 text-left transition-all duration-300 lg:rounded-[1.45rem] ${
                      active
                        ? "border-orange-400/60 bg-orange-500/15 shadow-[0_0_28px_rgba(255,120,0,0.16)]"
                        : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[1.05rem] font-semibold leading-tight text-white lg:text-base">
                          {book.title}
                        </p>

                        <p className="mt-1 truncate text-[0.95rem] text-white/55 lg:text-sm">
                          {book.author}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-white/55">
                        {book.access === "premium" ? "Premium" : "Free"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 lg:mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.28em] text-yellow-200/70">
                  Premium Collection
                </p>

                <div className="rounded-full border border-yellow-300/20 bg-yellow-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-yellow-100/80">
                  Locked
                </div>
              </div>

              <div className="space-y-2.5 lg:space-y-3">
                {PREMIUM_BOOKS.map((book) => (
                  <button
                    key={book.title}
                    type="button"
                    onClick={openPremiumModal}
                    className="group relative w-full overflow-hidden rounded-[1.3rem] border border-yellow-300/10 bg-yellow-500/[0.04] px-4 py-3 text-left opacity-80 transition hover:border-yellow-300/25 hover:bg-yellow-500/[0.08] lg:rounded-[1.4rem]"
                  >
                    <div className="absolute inset-0 backdrop-blur-[1px]" />

                    <div className="relative flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[1rem] font-semibold leading-tight text-white/85 lg:text-base">
                          {book.title}
                        </p>

                        <p className="mt-1 truncate text-[0.9rem] text-white/45 lg:text-sm">
                          {book.author}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full border border-yellow-300/15 bg-yellow-500/10 px-2 py-1 text-[10px]">
                        🔒
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={openPremiumModal}
                className="mt-4 w-full rounded-[1.25rem] bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-950/30 transition hover:scale-[1.01] lg:rounded-2xl"
              >
                Upgrade to Premium
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-5 py-9 text-center lg:rounded-[1.6rem] lg:py-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-400/20 bg-orange-500/10 text-3xl text-orange-200/80 lg:h-16 lg:w-16">
              ⌕
            </div>

            <p className="mt-5 text-lg font-semibold text-white">
              No stories found
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Try searching by book title or author.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 shrink-0 rounded-[1.35rem] border border-orange-400/15 bg-gradient-to-br from-orange-500/10 to-transparent px-4 py-3 lg:rounded-[1.45rem]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-300/20 bg-orange-500/10 text-sm text-orange-200">
            ✦
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-medium text-white">
              AI Storyteller
            </p>

            <p className="mt-1 truncate text-xs text-white/45">
              Free library + Premium access
            </p>
          </div>
        </div>
      </div>

      {showPremiumModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full rounded-[1.7rem] border border-yellow-300/20 bg-[#1b100a]/95 p-5 shadow-2xl shadow-black/50 lg:rounded-[1.8rem]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-yellow-300/25 bg-yellow-500/10 text-2xl">
              🔒
            </div>

            <h3 className="mt-5 text-center text-xl font-semibold text-white">
              Premium Locked
            </h3>

            <p className="mt-3 text-center text-sm leading-relaxed text-white/55">
              Unlock premium books, better voices, unlimited listening, and
              full public-domain search.
            </p>

            {premiumMessage && (
              <p className="mt-4 rounded-2xl border border-orange-300/15 bg-orange-500/10 px-4 py-3 text-center text-sm text-orange-100">
                Premium coming soon.
              </p>
            )}

            <button
              type="button"
              onClick={handlePremiumClick}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-950/30 transition hover:scale-[1.01]"
            >
              Upgrade to Premium
            </button>

            <button
              type="button"
              onClick={() => setShowPremiumModal(false)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70 transition hover:bg-white/[0.08]"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}