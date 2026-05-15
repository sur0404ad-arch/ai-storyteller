"use client";

import { useMemo, useState } from "react";
import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const {
    books,
    voices,
    selectedBook,
    selectedVoice,
    selectedBookId,
    selectedVoiceId,
    setSelectedBookId,
    setSelectedVoiceId,
    isPlaying,
    currentTime,
    duration,
    formattedCurrentTime,
    formattedDuration,
    togglePlay,
    handleSeek,
    restart,
  } = usePlayer();

  const [searchValue, setSearchValue] = useState("");

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      `${book.title} ${book.author}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }, [books, searchValue]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-desktop.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-5">
        <div className="grid w-full gap-4 lg:grid-cols-[310px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search stories..."
              className="mb-3 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-sm outline-none placeholder:text-white/35"
            />

            <div className="space-y-2">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                    selectedBookId === book.id
                      ? "border-orange-400 bg-orange-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {book.title}
                  </p>

                  <p className="text-xs text-white/50">
                    {book.author}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-orange-300/70">
              Now Playing
            </p>

            <h1 className="text-3xl font-semibold leading-tight">
              {selectedBook.title}
            </h1>

            <p className="mt-1 text-sm text-white/55">
              {selectedBook.author}
            </p>

            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-orange-300/70">
              Continue from {formattedCurrentTime}
            </p>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs text-white/50">
                <span>{formattedCurrentTime}</span>

                <span>{formattedDuration}</span>
              </div>

              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) =>
                  handleSeek(Number(e.target.value))
                }
                className="w-full cursor-pointer"
              />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={restart}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Restart
              </button>
            </div>

            <div className="mt-7">
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-orange-300/70">
                Voices
              </p>

              <div className="flex flex-wrap gap-2">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() =>
                      setSelectedVoiceId(voice.id)
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      selectedVoiceId === voice.id
                        ? "border-orange-400 bg-orange-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {voice.name}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-white/45">
                Active Voice: {selectedVoice.name}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}