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

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#120806] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-desktop.png')",
          backgroundPosition: "center 46%",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/8 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/18" />

      <section className="relative z-10 flex h-full w-full items-center justify-center px-8 py-7">
        <div className="flex h-[88vh] w-full max-w-[1460px] gap-8">
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

          <div className="flex min-w-0 flex-1">
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