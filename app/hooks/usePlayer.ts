"use client";

import { useMemo, useRef, useState } from "react";
import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const books = useMemo(() => BOOKS, []);

  const [selectedBook, setSelectedBook] = useState(BOOKS[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [searchValue, setSearchValue] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const selectedChapter = selectedBook.chapters[0];

  const voiceAudio =
    selectedChapter.audioByVoice[
      selectedVoice.id as keyof typeof selectedChapter.audioByVoice
    ];

  const filteredBooks = books.filter((book) => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return true;

    return (
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value)
    );
  });

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  function resetAudioState() {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }

  function selectBook(book: (typeof BOOKS)[number]) {
    resetAudioState();
    setSelectedBook(book);
  }

  function selectVoice(voiceId: string) {
    const foundVoice = VOICES.find((voice) => voice.id === voiceId);

    if (!foundVoice) return;

    resetAudioState();
    setSelectedVoice(foundVoice);
  }

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }

      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  function restart() {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
  }

  function seekTo(percent: number) {
    const audio = audioRef.current;

    if (!audio || duration <= 0) return;

    const nextTime = (duration * percent) / 100;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleLoadedMetadata(durationValue: number) {
    setDuration(durationValue);
  }

  function handleTimeUpdate(currentTimeValue: number) {
    setCurrentTime(currentTimeValue);
  }

  function handlePlay() {
    setIsPlaying(true);
  }

  function handlePause() {
    setIsPlaying(false);
  }

  function handleEnded() {
    setIsPlaying(false);
    setCurrentTime(0);
  }

  return {
    books,
    filteredBooks,
    voices: VOICES,

    selectedBook: {
      ...selectedBook,
      chapter: selectedChapter.title,
      subtitle: selectedChapter.subtitle,
      captions: selectedChapter.captions,
    },

    selectedVoice,
    searchValue,
    voiceAudio,

    audioRef,
    isPlaying,
    currentTime,
    duration,
    progressPercent,

    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),

    setSearchValue,
    selectBook,
    selectVoice,

    togglePlay,
    restart,
    seekTo,

    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  };
}