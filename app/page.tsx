"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    selectedBook,
    filteredBooks,
    selectedVoice,
    voiceAudio,
    voices,
    isVoiceOpen,
    searchValue,
    isPlaying,
    currentTime,
    progressPercent,
    formattedCurrentTime,
    formattedDuration,
    setIsVoiceOpen,
    setSearchValue,
    selectVoice,
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

  const captions =
    selectedBook.captions.length > 0
      ? selectedBook.captions
      : [selectedBook.preview];

  const captionIndex = Math.floor(currentTime / 2) % captions.length;

  return (
    <main className="fixed inset-0 overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[url('/bg-main.png')] bg-cover bg-center brightness-[1.25] contrast-[1.08] saturate-[1.12] md:bg-[url('/bg-desktop.png')]" />
      <div className="absolute inset-0 bg-black/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-black/0" />

      <section className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-4 pb-2 pt-2 md:grid md:grid-cols-[1fr_430px] md:gap-10 md:px-10 md:py-7">
        <div className="flex h-full min-h-0 flex-col">
          <header className="flex shrink-0 items-center justify-between">
            <div className="rounded-full border border-white/20 bg-black/34 px-4 py-2 backdrop-blur-xl">
              <p className="text-[10px] font-bold tracking-[0.28em] text-white">
                AI STORYTELLER
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="rounded-full border border-white/18 bg-black/36 px-4 py-2 text-[10px] font-bold tracking-[0.22em] text-orange-100 backdrop-blur-xl active:scale-95"
            >
              VOICE
            </button>
          </header>

          <div className="mt-2 shrink-0 md:hidden">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search books"
              className="h-9 w-full rounded-full border border-white/20 bg-black/34 px-5 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/48"
            />
          </div>

          <div className="mt-2 shrink-0 md:mt-8">
            <h1 className="max-w-[300px] text-[25px] font-black leading-[0.92] tracking-tight md:max-w-[760px] md:text-[72px]">
              {selectedBook.title}
            </h1>

            <p className="mt-1 text-[13px] text-white/82 md:mt-4 md:text-2xl">
              {selectedBook.author}
            </p>

            <p className="mt-0.5 text-[11px] text-white/56 md:text-base">
              Voice: {selectedVoice.name}
            </p>
          </div>

          <section className="mt-2 shrink-0 rounded-[22px] border border-white/14 bg-black/34 p-3 backdrop-blur-xl md:mt-7 md:max-w-3xl md:rounded-[34px] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] text-orange-100/78">
                  NOW PLAYING
                </p>

                <h2 className="mt-1 text-[22px] font-black leading-tight md:mt-3 md:text-4xl">
                  {selectedBook.chapter}
                </h2>

                <p className="mt-0.5 text-[13px] text-white/68 md:text-xl">
                  {selectedBook.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-2 rounded-full bg-white/95 px-2 py-1 md:mt-5 md:px-3 md:py-3">
              <audio
                ref={audioRef}
                key={`${selectedBook.id}-${selectedVoice.id}`}
                controls
                playsInline
                preload="auto"
                className="h-9 w-full"
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
             <source src={selectedBook.audio} type="audio/mpeg" />
              </audio>
            </div>

            <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-white/14">
              <div
                className="h-full rounded-full bg-orange-300 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-white/72">
              <span>{isPlaying ? "Now Playing" : "Continue Listening"}</span>

              <span>
                {formattedCurrentTime} / {formattedDuration}
              </span>
            </div>

            <div className="mt-2 h-[72px] overflow-hidden rounded-[16px] border border-white/10 bg-black/18 p-2.5 backdrop-blur-xl">
              <div className="space-y-0.5">
                <p className="text-[13px] leading-5 text-white">
                  {captions[captionIndex]}
                </p>

                <p className="text-[13px] leading-5 text-white/62">
                  {captions[(captionIndex + 1) % captions.length]}
                </p>

                <p className="text-[13px] leading-5 text-white/34">
                  {captions[(captionIndex + 2) % captions.length]}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-2 min-h-0 shrink-0 md:hidden">
            <div className="mt-1.5 flex gap-3 overflow-x-auto pb-1">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => selectBook(book)}
                  className={`min-w-[116px] rounded-[16px] border p-2.5 text-left backdrop-blur-xl transition active:scale-95 ${
                    selectedBook.id === book.id
                      ? "border-orange-200/55 bg-white/16"
                      : "border-white/12 bg-black/30"
                  }`}
                >
                  <h3 className="line-clamp-2 text-[15px] font-black leading-tight">
                    {book.title}
                  </h3>

                  <p className="mt-1.5 line-clamp-1 text-[11px] text-white/62">
                    {book.author}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>

        {isVoiceOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/74 px-4 py-5 backdrop-blur-2xl">
            <div className="mx-auto max-w-md rounded-[28px] border border-white/14 bg-black/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.28em] text-orange-100/72">
                    SELECT VOICE
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    Narrator Voice
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/10 text-2xl text-white"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => selectVoice(voice.id)}
                    className={`rounded-2xl border px-4 py-3 text-left ${
                      selectedVoice.id === voice.id
                        ? "border-orange-200/60 bg-orange-200/14"
                        : "border-white/10 bg-white/7"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-black text-white">
                          {voice.name}
                        </p>

                        <p className="mt-1 text-xs text-white/55">
                          {voice.gender} American Narrator
                        </p>
                      </div>

                      {selectedVoice.id === voice.id && (
                        <p className="text-xs font-bold tracking-[0.18em] text-orange-200">
                          ACTIVE
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}