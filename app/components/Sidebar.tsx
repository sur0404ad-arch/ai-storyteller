"use client";

import { useState } from "react";

type Props = {
  books: {
    id: number;
    title: string;
    author: string;
    access?: "free" | "premium";
  }[];

  selectedBookId: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectBook: (bookId: string | number) => void;
};

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

  function handlePremiumClick() {
    setPremiumMessage(true);
  }

  return (
    <aside className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 backdrop-blur-[8px] lg:w-[320px] lg:p-5">
      <div className="shrink-0">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-orange-300/75">
            Library
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            Stories
          </h2>
        </div>

        <div className="mb-4 flex items-center rounded-3xl border border-white/10 bg-white/[0.025] px-4 py-3">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stories..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />

          <span className="text-lg text-white/60">⌕</span>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-orange-300/75">
            Free Library
          </p>

          <p className="text-[10px] text-white/40">{books.length} books</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {books.length > 0 ? (
          <>
            <div className="space-y-3">
              {books.map((book) => {
                const active = selectedBookId === String(book.id);

                return (
                  <button
                    key={book.id}
                    onClick={() => onSelectBook(book.id)}
                    className={`group w-full rounded-[1.45rem] border px-4 py-3 text-left transition-all duration-300 ${
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

                      <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-white/55">
                        Free
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.28em] text-yellow-200/70">
                  Premium Collection
                </p>

                <div className="rounded-full border border-yellow-300/20 bg-yellow-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-yellow-100/80">
                  Locked
                </div>
              </div>

              <div className="space-y-3">
                {PREMIUM_BOOKS.map((book) => (
                  <button
                    key={book.title}
                    onClick={() => {
                      setPremiumMessage(false);
                      setShowPremiumModal(true);
                    }}
                    className="group relative w-full overflow-hidden rounded-[1.4rem] border border-yellow-300/10 bg-yellow-500/[0.04] px-4 py-3 text-left opacity-80 transition hover:border-yellow-300/25 hover:bg-yellow-500/[0.08]"
                  >
                    <div className="absolute inset-0 backdrop-blur-[1px]" />

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white/85">
                          {book.title}
                        </p>

                        <p className="mt-1 truncate text-sm text-white/45">
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
                onClick={() => {
                  setPremiumMessage(false);
                  setShowPremiumModal(true);
                }}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-950/30 transition hover:scale-[1.01]"
              >
                Upgrade to Premium
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-black/10 px-5 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-orange-400/20 bg-orange-500/10 text-3xl text-orange-200/80">
              ⌕
            </div>

            <p className="mt-6 text-lg font-semibold text-white">
              No stories found
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Try searching by book title or author.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 shrink-0 rounded-[1.45rem] border border-orange-400/15 bg-gradient-to-br from-orange-500/10 to-transparent px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-300/20 bg-orange-500/10 text-sm text-orange-200">
            ✦
          </div>

          <div>
            <p className="text-base font-medium text-white">AI Storyteller</p>

            <p className="mt-1 text-xs text-white/45">
              Free library + Premium access
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-yellow-300/15 bg-black/20 px-4 py-2.5">
          <p className="text-xs leading-relaxed text-white/60">
            Premium will unlock full public-domain search, better voices,
            unlimited listening, and future exclusive stories.
          </p>
        </div>
      </div>

      {showPremiumModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full rounded-[1.8rem] border border-yellow-300/20 bg-[#1b100a]/95 p-5 shadow-2xl shadow-black/50">
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
              onClick={handlePremiumClick}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-950/30 transition hover:scale-[1.01]"
            >
              Upgrade to Premium
            </button>

            <button
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