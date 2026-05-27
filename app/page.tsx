"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import BookmarksPanel from "./components/BookmarksPanel";
import NarratorsPanel from "./components/NarratorsPanel";
import PlayerCard from "./components/PlayerCard";
import Sidebar from "./components/Sidebar";
import VoiceSelector from "./components/VoiceSelector";
import VolumeControl from "./components/VolumeControl";
import ContinueListening from "./components/ContinueListening";

import {
  addBookmark,
  clearBookmarks,
  deleteBookmark,
  getBookmarks,
  type BookmarkItem,
} from "./lib/bookmarks/bookmarkController";

import { NARRATORS } from "./lib/narrators/narratorController";
import { getNarratorBackground } from "./lib/narrators/getNarratorBackground";
import { getNarratorPreset } from "./lib/narrators/getNarratorPreset";

import { usePlayer } from "./hooks/usePlayer";

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5];

const SLEEP_TIMER_OPTIONS = [15, 30, 45, 60];

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
    playbackRate,
    setPlaybackRate,
    togglePlay,
    handleSeek,
    handleSliderChange,
    restart,
    setSelectedBookId,
    setSelectedVoiceId,
    setSelectedChapterId,
  } = usePlayer();

  const [searchValue, setSearchValue] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [mobileView, setMobileView] = useState<"library" | "player">("library");
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);
  const [activeNarratorId, setActiveNarratorId] = useState(
    NARRATORS[0]?.id || ""
  );

  const narratorPreset = getNarratorPreset(activeNarratorId);
  const narratorBackground = getNarratorBackground(activeNarratorId);

  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const togglePlayRef = useRef(togglePlay);
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);
  const handleSeekRef = useRef(handleSeek);

  const currentChapterIndex = selectedBook.chapters.findIndex(
    (chapter) => chapter.id === selectedChapterId
  );

  const hasPreviousChapter = currentChapterIndex > 0;

  const hasNextChapter =
    currentChapterIndex >= 0 &&
    currentChapterIndex < selectedBook.chapters.length - 1;

  const previousChapter = hasPreviousChapter
    ? selectedBook.chapters[currentChapterIndex - 1]
    : null;

  const nextChapter = hasNextChapter
    ? selectedBook.chapters[currentChapterIndex + 1]
    : null;

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    togglePlayRef.current = togglePlay;
  }, [togglePlay]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    handleSeekRef.current = handleSeek;
  }, [handleSeek]);

  useEffect(() => {
    setPlaybackRate(narratorPreset.playbackRate);
  }, [narratorPreset.playbackRate, setPlaybackRate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePlayRef.current();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleSeekRef.current(Math.max(0, currentTimeRef.current - 10));
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSeekRef.current(
          Math.min(
            durationRef.current || currentTimeRef.current + 10,
            currentTimeRef.current + 10
          )
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, []);

  const sidebarBooks = useMemo(() => {
    const query = searchValue.toLowerCase().trim();

    const filteredBooks = books.filter((book) => {
      if (!query) return true;

      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.slug.toLowerCase().includes(query)
      );
    });

    return filteredBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      access: book.access,
    }));
  }, [books, searchValue]);

  const handleMobileSelectBook = (bookId: string | number) => {
    setSelectedBookId(bookId);
    setMobileView("player");
  };

  const handlePreviousChapter = () => {
    if (!previousChapter) return;
    setSelectedChapterId(previousChapter.id);
  };

  const handleNextChapter = () => {
    if (!nextChapter) return;
    setSelectedChapterId(nextChapter.id);
  };

  const handleSleepTimerChange = (minutes: number) => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    setSleepTimerMinutes(minutes);

    if (minutes <= 0) return;

    sleepTimerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        togglePlayRef.current();
      }

      setSleepTimerMinutes(0);
      sleepTimerRef.current = null;
    }, minutes * 60 * 1000);
  };

  const handleAddBookmark = () => {
    const updatedBookmarks = addBookmark({
      bookId: selectedBook.id,
      chapterId: selectedChapterId,
      bookTitle: selectedBook.title,
      chapterTitle: currentChapter?.title || "Chapter",
      time: formattedCurrentTime,
      seconds: currentTime,
    });

    setBookmarks(updatedBookmarks);
  };

  const handleOpenBookmark = (bookmark: BookmarkItem) => {
    setSelectedBookId(bookmark.bookId);
    setSelectedChapterId(Number(bookmark.chapterId));

    window.setTimeout(() => {
      handleSeek(bookmark.seconds);
    }, 250);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks(deleteBookmark(bookmarkId));
  };

  const handleClearBookmarks = () => {
    setBookmarks(clearBookmarks());
  };

  return (
    <main className="relative min-h-[100svh] w-screen overflow-x-hidden bg-[#120806] text-white lg:h-screen lg:overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center lg:absolute"
        style={{
          backgroundImage: "url('/bg-desktop.png')",
          backgroundPosition: "center 42%",
        }}
      />

      <div
        className={`pointer-events-none fixed inset-0 z-0 ${narratorBackground.overlay}`}
      />

      <div
        className={`pointer-events-none fixed inset-0 z-0 blur-3xl ${narratorBackground.glow}`}
      />

      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent lg:absolute" />

      <section className="pointer-events-auto relative z-10 min-h-[100svh] w-full px-4 py-4 lg:flex lg:h-full lg:items-center lg:justify-center lg:px-8 lg:py-6">
        <div className="mx-auto w-full max-w-[1460px]">
          <div className="lg:hidden">
            {mobileView === "library" ? (
              <Sidebar
                books={sidebarBooks}
                selectedBookId={selectedBookId}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSelectBook={handleMobileSelectBook}
              />
            ) : (
              <div className="space-y-4 pb-6">
                <button
                  type="button"
                  onClick={() => setMobileView("library")}
                  className="relative z-50 rounded-full border-2 border-[#6d3720] bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur-xl"
                >
                  в†ђ Library
                </button>

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
                  hasPreviousChapter={hasPreviousChapter}
                  hasNextChapter={hasNextChapter}
                  onPreviousChapter={handlePreviousChapter}
                  onNextChapter={handleNextChapter}
                  onSelectChapter={setSelectedChapterId}
                  onSeek={handleSliderChange}
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
            )}
          </div>

          <div className="hidden lg:grid lg:h-[82vh] lg:max-h-[780px] lg:min-h-[620px] lg:grid-cols-[330px_minmax(0,1fr)_320px] lg:items-stretch lg:gap-8">
            <Sidebar
              books={sidebarBooks}
              selectedBookId={selectedBookId}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSelectBook={setSelectedBookId}
            />

            <div className="flex h-full min-w-0 items-stretch overflow-hidden">
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
                hasPreviousChapter={hasPreviousChapter}
                hasNextChapter={hasNextChapter}
                onPreviousChapter={handlePreviousChapter}
                onNextChapter={handleNextChapter}
                onSelectChapter={setSelectedChapterId}
                onSeek={handleSliderChange}
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

            <aside className="flex h-full min-h-0 flex-col overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="space-y-3 pb-10">
                <NarratorsPanel
                  narrators={NARRATORS}
                  activeNarratorId={activeNarratorId}
                  onSelectNarrator={setActiveNarratorId}
                />

                <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
                  <VolumeControl />
                </div>

                <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-[0.24em] text-orange-200/75">
                      Speed
                    </p>

                    <p className="text-[10px] text-white/45">
                      {playbackRate}x
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setPlaybackRate(speed)}
                        className={`rounded-full border-2 px-2 py-1 text-[10px] transition ${
                          playbackRate === speed
                            ? "border-orange-400/70 bg-orange-500/20 text-white"
                            : "border-[#6d3720] bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-[0.24em] text-orange-200/75">
                      Sleep Timer
                    </p>

                    <p className="text-[10px] text-white/45">
                      {sleepTimerMinutes > 0 ? `${sleepTimerMinutes}m` : "Off"}
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSleepTimerChange(0)}
                      className={`rounded-full border-2 px-2 py-1 text-[10px] transition ${
                        sleepTimerMinutes === 0
                          ? "border-orange-400/70 bg-orange-500/20 text-white"
                          : "border-[#6d3720] bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Off
                    </button>

                    {SLEEP_TIMER_OPTIONS.map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => handleSleepTimerChange(minutes)}
                        className={`rounded-full border-2 px-2 py-1 text-[10px] transition ${
                          sleepTimerMinutes === minutes
                            ? "border-orange-400/70 bg-orange-500/20 text-white"
                            : "border-[#6d3720] bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {minutes}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.24em] text-orange-200/75">
                        Active Mood
                      </p>

                      <p className="mt-1 text-xs text-white">
                        {narratorPreset.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] text-white/40">EQ</p>

                      <p className="mt-1 text-[10px] uppercase text-orange-200/70">
                        {narratorPreset.eq}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddBookmark}
                    className="rounded-full border-2 border-orange-400/70 bg-orange-500/15 px-4 py-1.5 text-[11px] font-medium text-white transition hover:bg-orange-500/25"
                  >
                    Save Moment
                  </button>
                </div>

                <ContinueListening
                  onOpenItem={(item) => {
                    setSelectedBookId(item.bookId);
                    setSelectedChapterId(Number(item.chapterId));

                    window.setTimeout(() => {
                      handleSeek(item.timestamp);
                    }, 250);
                  }}
                />

                <BookmarksPanel
                  bookmarks={bookmarks}
                  onJumpToBookmark={handleOpenBookmark}
                  onDeleteBookmark={handleDeleteBookmark}
                  onClearAll={handleClearBookmarks}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
