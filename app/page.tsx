"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    selectedBook,
    filteredBooks,
    searchValue,
    isPlaying,
    currentTime,
    progressPercent,
    formattedCurrentTime,
    formattedDuration,
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
  }, [selectedBook.id, currentTime]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[url('/bg-main.png')] bg-cover bg-center brightness-[1.28] contrast-[1.08] saturate-[1.14] md:bg-[url('/bg-desktop.png')]" />
      <div className="absolute inset-0 bg-black/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/14 to-black/0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(255,145,55,0.24),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(255,190,105,0.16),transparent_30%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-32 pt-4 md:grid md:grid-cols-[1fr_430px] md:gap-10 md:px-10 md:py-7">
        <div className="flex min-h-0 flex-col">
          <header className="flex items-center justify-between">
            <div className="rounded-full border border-white/20 bg-black/34 px-4 py-2 shadow-[0_0_30px_rgba(255,160,70,0.10)] backdrop-blur-xl">
              <p className="text-[10px] font-bold tracking-[0.28em] text-white">
                AI STORYTELLER
              </p>
            </div>
          </header>

          <div className="mt-4 md:hidden">
            <p className="mb-2 text-[10px] font-bold tracking-[0.28em] text-white/65">
              SEARCH LIBRARY
            </p>

            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search books"
              className="h-11 w-full rounded-full border border-white/20 bg-black/36 px-5 text-sm text-white outline-none shadow-[0_0_34px_rgba(255,170,80,0.08)] backdrop-blur-xl placeholder:text-white/48"
            />
          </div>

          <div className="mt-4 md:mt-8">
            <h1 className="max-w-[270px] text-[31px] font-black leading-[0.9] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] md:max-w-[760px] md:text-[72px]">
              {selectedBook.title}
            </h1>

            <p className="mt-2 text-base text-white/82 drop-shadow md:mt-4 md:text-2xl">
              {selectedBook.author}
            </p>

            <p className="mt-1 text-xs text-white/56 md:text-base">
              {selectedBook.source}
            </p>
          </div>

          <section className="mt-3 rounded-[26px] border border-white/14 bg-black/38 p-4 shadow-[0_0_70px_rgba(255,135,45,0.20)] backdrop-blur-xl md:mt-7 md:max-w-3xl md:rounded-[34px] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] text-orange-100/78">
                  NOW PLAYING
                </p>

                <h2 className="mt-2 text-2xl font-black leading-tight md:mt-3 md:text-4xl">
                  {selectedBook.chapter}
                </h2>

                <p className="mt-1 text-sm text-white/68 md:text-xl">
                  {selectedBook.subtitle}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-200/14 shadow-[0_0_38px_rgba(255,150,65,0.28)] md:h-16 md:w-16">
                <div
                  className={`h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_22px_rgba(255,170,80,1)] md:h-4 md:w-4 ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 rounded-full bg-white/95 px-2 py-2 shadow-[0_10px_36px_rgba(0,0,0,0.35)] md:mt-5 md:px-3 md:py-3">
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

            <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-white/14 md:mt-4">
              <div
                className="h-full rounded-full bg-orange-300 shadow-[0_0_14px_rgba(255,170,80,1)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-white/72 md:mt-4 md:text-base">
              <span>{isPlaying ? "Now Playing" : "Continue Listening"}</span>
              <span>
                {formattedCurrentTime} / {formattedDuration}
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/68 md:mt-4 md:text-lg md:leading-8">
              {selectedBook.preview}
            </p>
          </section>

          <section className="mt-5 min-h-0 pb-28 md:hidden">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.28em] text-white/62">
                LIBRARY
              </p>

              <p className="text-xs text-white/48">Ready</p>
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => selectBook(book)}
                  className={`min-w-[130px] rounded-[20px] border p-3 text-left shadow-[0_0_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition active:scale-95 ${
                    selectedBook.id === book.id
                      ? "border-orange-200/55 bg-white/16"
                      : "border-white/12 bg-black/30"
                  }`}
                >
                  <h3 className="line-clamp-2 text-lg font-black leading-tight">
                    {book.title}
                  </h3>

                  <p className="mt-2 line-clamp-1 text-xs text-white/62">
                    {book.author}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden min-h-0 flex-col md:flex">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-[0.28em] text-white/55">
              LIBRARY
            </p>

            <div className="w-[280px]">
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search books"
                className="h-14 w-full rounded-full border border-white/15 bg-black/42 px-6 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/40"
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
                    : "border-white/10 bg-black/34"
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

      <div className="fixed bottom-3 left-3 right-3 z-50 rounded-[24px] border border-white/14 bg-black/52 px-4 py-3 shadow-[0_0_40px_rgba(255,140,60,0.22)] backdrop-blur-2xl md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">
              {selectedBook.title}
            </p>

            <p className="truncate text-xs text-white/58">
              {formattedCurrentTime} / {formattedDuration}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_16px_rgba(255,170,80,1)] ${
                isPlaying ? "animate-pulse" : ""
              }`}
            />

            <div className="text-xs font-semibold text-white/70">
              {isPlaying ? "Playing" : "Paused"}
            </div>
          </div>
        </div>

        <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-orange-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </main>
  );
}