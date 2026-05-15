"use client";

import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const {
    filteredBooks,
    voices,

    selectedBook,
    selectedVoice,

    searchValue,

    voiceAudio,

    isPlaying,

    progressPercent,

    formattedCurrentTime,
    formattedDuration,

    setSearchValue,

    selectBook,
    selectVoice,

    togglePlay,
    restart,
    seekTo,

    audioRef,

    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  } = usePlayer();

  return (
    <main className="relative h-[100svh] overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-desktop.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <section className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 py-4 md:px-6">
        <header className="mb-3 flex items-center justify-between">
          <div className="rounded-full border border-white/15 bg-black/50 px-5 py-2 text-xs font-black tracking-[0.32em] backdrop-blur-xl">
            AI STORYTELLER
          </div>

          <div className="rounded-full border border-orange-300/20 bg-black/50 px-5 py-2 text-sm font-black text-orange-200 backdrop-blur-xl">
            {selectedVoice.name}
          </div>
        </header>

        <div className="mb-3 flex gap-2 overflow-x-auto rounded-[28px] border border-white/10 bg-black/45 p-2 backdrop-blur-2xl">
          {voices.map((voice) => (
            <button
              key={voice.id}
              type="button"
              onClick={() => selectVoice(voice.id)}
              className={`min-w-[92px] rounded-2xl px-4 py-3 text-left transition ${
                selectedVoice.id === voice.id
                  ? "bg-orange-300 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              <div className="text-sm font-black">
                {voice.name}
              </div>

              <div className="text-[10px] opacity-70">
                {voice.gender}
              </div>
            </button>
          ))}
        </div>

        <input
          value={searchValue}
          onChange={(event) =>
            setSearchValue(event.target.value)
          }
          placeholder="Search books..."
          className="mb-3 h-14 rounded-[24px] border border-white/10 bg-black/45 px-5 text-white outline-none backdrop-blur-2xl placeholder:text-white/40"
        />

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {filteredBooks.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => selectBook(book)}
              className={`rounded-[28px] p-4 text-left transition ${
                selectedBook.id === book.id
                  ? "bg-orange-300 text-black"
                  : "bg-black/50 text-white"
              }`}
            >
              <div className="text-2xl font-black">
                {book.title}
              </div>

              <div className="mt-1 text-sm opacity-70">
                {book.author}
              </div>
            </button>
          ))}
        </div>

        <div className="max-w-4xl">
          <p className="mb-2 text-xs font-black tracking-[0.3em] text-orange-200">
            CONTINUE LISTENING
          </p>

          <h1 className="text-5xl font-black leading-none md:text-7xl">
            {selectedBook.title}
          </h1>

          <p className="mt-3 text-xl text-white/80">
            {selectedBook.author}
          </p>

          <div className="mt-6 rounded-[34px] border border-white/10 bg-black/65 p-5 shadow-2xl backdrop-blur-2xl">
            <p className="mb-4 text-xs font-black tracking-[0.3em] text-white/45">
              NOW PLAYING
            </p>

            <div className="mb-3">
              <div className="text-4xl font-black">
                {selectedBook.chapter}
              </div>

              <div className="mt-1 text-lg text-white/65">
                {selectedBook.subtitle}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  togglePlay();
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-300 text-2xl font-black text-black active:scale-[0.96]"
              >
                {isPlaying ? "II" : "▶"}
              </button>

              <div className="flex-1">
                <div
                  onClick={(event) => {
                    const rect =
                      event.currentTarget.getBoundingClientRect();

                    const percent =
                      ((event.clientX - rect.left) /
                        rect.width) *
                      100;

                    seekTo(percent);
                  }}
                  className="relative h-3 w-full cursor-pointer rounded-full bg-white/10"
                >
                  <div
                    className="absolute left-0 top-0 h-3 rounded-full bg-orange-300"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-sm text-white/45">
                  <span>{formattedCurrentTime}</span>

                  <span>{formattedDuration}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={restart}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black tracking-[0.15em]"
              >
                RESTART
              </button>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/45 p-5 text-lg leading-relaxed text-white/90">
              {selectedBook.captions.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={voiceAudio}
          preload="auto"
          onLoadedMetadata={(event) =>
            handleLoadedMetadata(
              event.currentTarget.duration
            )
          }
          onTimeUpdate={(event) =>
            handleTimeUpdate(
              event.currentTarget.currentTime
            )
          }
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        />
      </section>
    </main>
  );
}