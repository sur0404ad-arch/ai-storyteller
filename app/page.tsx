"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    selectedBook,
    filteredBooks,
    isSearchOpen,
    searchValue,
    isPlaying,
    currentTime,
    progressPercent,
    formattedCurrentTime,
    formattedDuration,
    setIsSearchOpen,
    setSearchValue,
    selectBook,
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  } = usePlayer();

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;
    if (currentTime <= 0) return;
    if (audioElement.duration && currentTime >= audioElement.duration) return;

    audioElement.currentTime = currentTime;
  }, [selectedBook.id]);

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[url('/bg-main.png')] bg-cover bg-center md:bg-[url('/bg-desktop.png')]" />
      <div className="absolute inset-0 bg-black/38" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-black/8" />

      <section className="relative z-10 mx-auto flex h-screen w-full max-w-7xl flex-col px-4 pb-3 pt-4 md:grid md:grid-cols-[1fr_430px] md:gap-10 md:px-10 md:py-7">
        <div className="flex min-h-0 flex-col">
          <header className="flex items-center justify-between">
            <div className="rounded-full border border-white/15 bg-black/55 px-4 py-2 backdrop-blur-xl">
              <p className="text-[10px] font-bold tracking-[0.28em] text-white">
                AI STORYTELLER
              </p>
            </div>
          </header>

          <div className="mt-4 md:hidden">
            <p className="mb-2 text-[10px] font-bold tracking-[0.28em] text-white/50">
              SEARCH LIBRARY
            </p>

            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search books"
              className="h-12 w-full rounded-full border border-white/15 bg-black/60 px-5 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/40"
            />
          </div>

          <div className="mt-4 md:mt-8">
            <h1 className="max-w-[250px] text-[34px] font-black leading-[0.88] tracking-tight md:max-w-[760px] md:text-[72px]">
              {selectedBook.title}
            </h1>

            <p className="mt-2 text-base text-white/75 md:mt-4 md:text-2xl">
              {selectedBook.author}
            </p>

            <p className="mt-1 text-xs text-white/40 md:text-base">
              {selectedBook.source}
            </p>
          </div>

          <section className="mt-3 rounded-[26px] border border-white/10 bg-black/52 p-4 shadow-[0_0_60px_rgba(255,120,0,0.12)] backdrop-blur-2xl md:mt-7 md:max-w-3xl md:rounded-[34px] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] text-orange-100/70">
                  NOW PLAYING
                </p>

                <h2 className="mt-2 text-2xl font-black leading-tight md:mt-3 md:text-4xl">
                  {selectedBook.chapter}
                </h2>

                <p className="mt-1 text-sm text-white/60 md:text-xl">
                  {selectedBook.subtitle}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-200/10 md:h-16 md:w-16">
                <div
                  className={`h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_20px_rgba(255,170,80,1)] md:h-4 md:w-4 ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 rounded-full bg-white px-2 py-2 md:mt-5 md:px-3 md:py-3">
              <audio
                ref={audioRef}
                key={selectedBook.id}
                controls
                playsInline
                preload="auto"
                className="w-full"
                onLoadedMetadata={(event) => {
                  handleLoadedMetadata(event.currentTarget.duration);

                  if (
                    currentTime > 0 &&
                    currentTime < event.currentTarget.duration
                  ) {
                    event.currentTarget.currentTime = currentTime;
                  }
                }}
                onTimeUpdate={(event) =>
                  handleTimeUpdate(event.currentTarget.currentTime)
                }
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
              >
                <source src="/voice.mp3" type="audio/mpeg" />
              </audio>
            </div>

            <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-white/10 md:mt-4">
              <div
                className="h-full rounded-full bg-orange-300 shadow-[0_0_14px_rgba(255,170,80,1)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-white/65 md:mt-4 md:text-base">
              <span>{isPlaying ? "Now Playing" : "Continue Listening"}</span>
              <span>
                {formattedCurrentTime} / {formattedDuration}
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/60 md:mt-4 md:text-lg md:leading-8">
              {selectedBook.preview}
            </p>
          </section>

          <section className="mt-3 min-h-0 md:hidden">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.28em] text-white/50">
                LIBRARY
              </p>

              <p className="text-xs text-white/40">Ready</p>
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => selectBook(book)}
                  className={`min-w-[130px] rounded-[20px] border p-3 text-left backdrop-blur-xl transition active:scale-95 ${
                    selectedBook.id === book.id
                      ? "border-orange-200/45 bg-white/12"
                      : "border-white/10 bg-black/38"
                  }`}
                >
                  <h3 className="line-clamp-2 text-lg font-black leading-tight">
                    {book.title}
                  </h3>

                  <p className="mt-2 line-clamp-1 text-xs text-white/55">
                    {book.author}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden min-h-0 flex-col md:flex">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-[0.28em] text-white/50">
              LIBRARY
            </p>

            <div className="w-[280px]">
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search books"
                className="h-14 w-full rounded-full border border-white/15 bg-black/60 px-6 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => selectBook(book)}
                className={`rounded-[28px] border p-5 text-left backdrop-blur-xl transition active:scale-[0.98] ${
                  selectedBook.id === book.id
                    ? "border-orange-200/45 bg-white/14"
                    : "border-white/10 bg-black/38"
                }`}
              >
                <h3 className="text-2xl font-black leading-tight text-white">
                  {book.title}
                </h3>

                <p className="mt-2 text-base text-white/55">{book.author}</p>

                <p className="mt-4 text-xs text-orange-100/55">
                  Public domain
                </p>
              </button>
            ))}
          </div>
        </aside>
      </section>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/94 px-5 py-6 backdrop-blur-2xl">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.28em] text-white/55">
                SEARCH LIBRARY
              </p>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white"
              >
                ×
              </button>
            </div>

            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              autoFocus
              placeholder="Search books"
              className="mt-6 h-14 w-full rounded-2xl border border-white/15 bg-white/10 px-5 text-base text-white outline-none placeholder:text-white/40"
            />

            <div className="mt-5 grid grid-cols-1 gap-3">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => selectBook(book)}
                  className="rounded-3xl border border-white/10 bg-black/38 p-5 text-left backdrop-blur-xl active:scale-[0.98]"
                >
                  <p className="text-2xl font-black text-white">{book.title}</p>
                  <p className="mt-2 text-sm text-white/55">{book.author}</p>
                  <p className="mt-3 text-xs text-orange-100/60">
                    Public domain
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}