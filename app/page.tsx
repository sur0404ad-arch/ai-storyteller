"use client";

import { useMemo, useState } from "react";

import PlayerCard from "./components/PlayerCard";
import Sidebar from "./components/Sidebar";
import VoiceSelector from "./components/VoiceSelector";

import { usePlayer } from "./hooks/usePlayer";

export default function Home() {
  const {
    books,
    voices,
    selectedBook,
    selectedVoice,
    selectedBookId,
    selectedVoiceId,
    selectedChapterId,
    currentChapter,
    isPlaying,
    isLoadingAudio,
    currentTime,
    duration,
    formattedCurrentTime,
    formattedDuration,
    togglePlay,
    handleSeek,
    restart,
    setSelectedBookId,
    setSelectedVoiceId,
    setSelectedChapterId,
  } = usePlayer();

  const [searchValue, setSearchValue] = useState("");

  const freeBooks = useMemo(() => {
    return books.filter((book) => {
      if (book.access !== "free") return false;

      const query = searchValue.toLowerCase().trim();

      if (!query) return true;

      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    });
  }, [books, searchValue]);

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-[#120806] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-desktop.png')",
          backgroundPosition: "center 42%",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-black/10" />

      <section className="relative z-10 flex min-h-screen w-full items-start justify-center px-4 py-4 md:h-screen md:items-center md:px-8 md:py-6">
        <div className="flex w-full max-w-[1460px] flex-col gap-5 md:grid md:h-[82vh] md:max-h-[780px] md:min-h-[620px] md:grid-cols-[330px_minmax(0,1fr)] md:items-stretch md:gap-8">
          <div className="w-full overflow-hidden">
            <Sidebar
              books={freeBooks.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                access: book.access,
              }))}
              selectedBookId={selectedBookId}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSelectBook={setSelectedBookId}
            />
          </div>

          <div className="relative flex min-w-0 items-start overflow-hidden">
            {currentTime > 0 && (
              <div className="absolute right-3 top-3 z-20 w-[240px] rounded-[1.35rem] border border-orange-300/20 bg-black/35 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl md:right-5 md:top-5 md:w-[300px]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-orange-200/75">
                    Continue Listening
                  </p>

                  <button
                    onClick={togglePlay}
                    disabled={isLoadingAudio}
                    className="rounded-full bg-orange-500 px-4 py-1.5 text-[11px] font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60"
                  >
                    {isPlaying ? "Pause" : "Resume"}
                  </button>
                </div>

                <p className="truncate text-sm font-semibold text-white">
                  {selectedBook.title}
                </p>

                <p className="mt-1 truncate text-xs text-white/50">
                  {currentChapter?.title} · {formattedCurrentTime}
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-orange-400"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <PlayerCard
              title={selectedBook.title}
              author={selectedBook.author}
              formattedCurrentTime={formattedCurrentTime}
              formattedDuration={formattedDuration}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              isLoadingAudio={isLoadingAudio}
              selectedVoiceName={selectedVoice.name}
              sourceName="Project Gutenberg"
              sourceType="Free Public-Domain"
              chapters={selectedBook.chapters}
              activeChapterId={selectedChapterId}
              onSelectChapter={setSelectedChapterId}
              onSeek={handleSeek}
              onTogglePlay={togglePlay}
              onRestart={restart}
            >
              <VoiceSelector
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                selectedVoiceName={selectedVoice.name}
                onSelectVoice={setSelectedVoiceId}
              />
            </PlayerCard>
          </div>
        </div>
      </section>
    </main>
  );
}