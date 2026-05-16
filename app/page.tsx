"use client";

import { useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import PlayerCard from "./components/PlayerCard";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-4 text-white lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-main.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/45" />

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-4 lg:grid lg:grid-cols-[320px_1fr] lg:gap-6">
        <Sidebar
          books={filteredBooks}
          selectedBookId={selectedBookId}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSelectBook={setSelectedBookId}
        />

        <PlayerCard
          title={selectedBook.title}
          author={selectedBook.author}
          formattedCurrentTime={formattedCurrentTime}
          formattedDuration={formattedDuration}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          selectedVoiceName={selectedVoice.name}
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
      </section>
    </main>
  );
}