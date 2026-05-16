"use client";

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

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-black
        px-10
        py-10
      "
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-desktop.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/10" />

      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-[1500px]
          gap-8
        "
      >
        <Sidebar
          books={books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
          }))}
          selectedBookId={selectedBookId}
          searchValue=""
          onSearchChange={() => {}}
          onSelectBook={setSelectedBookId}
        />

        <div className="flex-1">
          <PlayerCard
            title={selectedBook.title}
            author={selectedBook.author}
            formattedCurrentTime={formattedCurrentTime}
            formattedDuration={formattedDuration}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            selectedVoiceName={selectedVoice.name}
            sourceName="Project Gutenberg"
            sourceType="Public-Domain"
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
              onSelectVoice={setSelectedVoiceId}
            />
          </PlayerCard>
        </div>
      </div>
    </main>
  );
}