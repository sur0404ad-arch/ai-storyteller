"use client";

import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const {
    filteredBooks,
    voices,
    selectedBook,
    selectedVoice,
    selectBook,
    selectVoice,
    searchValue,
    setSearchValue,
    voiceAudio,
    progressPercent,
    formattedCurrentTime,
    formattedDuration,
    audioRef,
    isPlaying,
    togglePlay,
    restart,
    seekTo,
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  } = usePlayer();

  return (
    <main className="relative h-[100svh] overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-desktop.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/62" />

      <section className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-5 py-3">
        <header className="mb-2 flex items-center justify-between">
          <div className="rounded-full border border-white/20 bg-black/55 px-5 py-2 text-xs font-black tracking-[0.28em] backdrop-blur-xl">
            AI STORYTELLER
          </div>
          <div className="rounded-full border border-orange-300/25 bg-black/60 px-5 py-2 text-xs font-black tracking-[0.2em] text-orange-200 backdrop-blur-xl">
            {selectedVoice.name}
          </div>
        </header>

        <div className="mb-2 flex gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-black/45 p-2 backdrop-blur-xl">
          {voices.map((voice) => (
            <button
              key={voice.id}
              type="button"
              onClick={() => selectVoice(voice.id)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-left ${
                selectedVoice.id === voice.id
                  ? "bg-orange-300 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              <div className="text-sm font-black">{voice.name}</div>
              <div className="text-[10px] opacity-70">{voice.gender}</div>
            </button>
          ))}
        </div>

        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search books..."
          className="mb-2 w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-2.5 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/45"
        />

        <div className="mb-3 grid grid-cols-3 gap-3">
          {filteredBooks.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => selectBook(book)}
              className={`rounded-3xl p-3 text-left backdrop-blur-xl ${
                selectedBook.id === book.id
                  ? "bg-orange-300 text-black"
                  : "bg-black/50 text-white"
              }`}
            >
              <div className="text-base font-black">{book.title}</div>
              <div className="text-xs opacity-75">{book.author}</div>
            </button>
          ))}
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-black leading-none">
            {selectedBook.title}
          </h1>

          <p className="mt-1 text-lg text-white/80">{selectedBook.author}</p>

          <div className="mt-3 rounded-[2rem] border border-white/10 bg-black/68 p-4 shadow-2xl backdrop-blur-2xl">
            <p className="mb-1 text-xs font-black tracking-[0.28em] text-white/55">
              NOW PLAYING
            </p>

            <h2 className="text-2xl font-black">{selectedBook.chapter}</h2>
            <p className="mb-3 text-base text-white/65">
              {selectedBook.subtitle}
            </p>

            <div className="mb-3 flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-300 text-lg font-black text-black shadow-2xl"
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <div className="flex-1">
                <div
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const percent =
                      ((event.clientX - rect.left) / rect.width) * 100;
                    seekTo(percent);
                  }}
                  className="h-2 cursor-pointer overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-orange-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mt-1 flex justify-between text-xs text-white/45">
                  <span>{formattedCurrentTime}</span>
                  <span>{formattedDuration}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black tracking-[0.2em] text-white"
              >
                RESTART
              </button>
            </div>

            <audio
              ref={audioRef}
              key={`${selectedBook.title}-${voiceAudio}`}
              className="hidden"
              onLoadedMetadata={(event) =>
                handleLoadedMetadata(event.currentTarget.duration)
              }
              onTimeUpdate={(event) =>
                handleTimeUpdate(event.currentTarget.currentTime)
              }
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
            >
              <source src={voiceAudio} type="audio/mpeg" />
            </audio>

            <div className="max-h-[86px] overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-3">
              {selectedBook.captions.map((caption) => (
                <p key={caption} className="text-sm text-white/80">
                  {caption}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}