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
  const [activeChapterId, setActiveChapterId] =
    useState(1);

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      `${book.title} ${book.author}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }, [books, searchValue]);

  return (
    <main
      className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-black p-2 text-white lg:flex lg:items-center lg:justify-center lg:p-8"
      style={{
        backgroundImage:
          "url('/bg-desktop.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <section className="mx-auto grid h-full w-full max-w-[1280px] grid-rows-[118px_1fr] gap-2 overflow-hidden lg:h-auto lg:grid-cols-[320px_1fr] lg:grid-rows-none lg:gap-6">
        <Sidebar
          books={filteredBooks}
          selectedBookId={selectedBookId}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSelectBook={(bookId) => {
            setSelectedBookId(bookId);
            setActiveChapterId(1);
          }}
        />

        <PlayerCard
          title={selectedBook.title}
          author={selectedBook.author}
          formattedCurrentTime={
            formattedCurrentTime
          }
          formattedDuration={
            formattedDuration
          }
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          selectedVoiceName={
            selectedVoice.name
          }
          sourceName={selectedBook.sourceName}
          sourceType={selectedBook.sourceType}
          chapters={selectedBook.chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={
            setActiveChapterId
          }
          onSeek={handleSeek}
          onTogglePlay={togglePlay}
          onRestart={restart}
        >
          <VoiceSelector
            voices={voices}
            selectedVoiceId={
              selectedVoiceId
            }
            selectedVoiceName={
              selectedVoice.name
            }
            onSelectVoice={
              setSelectedVoiceId
            }
          />
        </PlayerCard>
      </section>
    </main>
  );
}