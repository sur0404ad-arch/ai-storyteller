"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
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

  const [savedProgress, setSavedProgress] = useState<
    Record<string, number>
  >({});

  const selectedChapter = selectedBook.chapters[0];

  const storageKey = `${selectedBook.id}-${selectedVoice.id}`;

  const voiceAudio =
    selectedChapter.audioByVoice[
      selectedVoice.id as keyof typeof selectedChapter.audioByVoice
    ];

  useEffect(() => {
    const stored = localStorage.getItem("ai-story-progress");

    if (stored) {
      setSavedProgress(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ai-story-progress",
      JSON.stringify(savedProgress)
    );
  }, [savedProgress]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.load();

    const savedTime = savedProgress[storageKey] || 0;

    setCurrentTime(savedTime);

    setIsPlaying(false);
  }, [voiceAudio, storageKey, savedProgress]);

  const filteredBooks = books.filter((book) => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return true;

    return (
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value)
    );
  });

  const progressPercent =
    duration > 0
      ? Math.min((currentTime / duration) * 100, 100)
      : 0;

  function selectBook(book: (typeof BOOKS)[number]) {
    setSelectedBook(book);
  }

  function selectVoice(voiceId: string) {
    const foundVoice = VOICES.find(
      (voice) => voice.id === voiceId
    );

    if (!foundVoice) return;

    setSelectedVoice(foundVoice);
  }

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        if (currentTime > 0) {
          audio.currentTime = currentTime;
        }

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

    setSavedProgress((prev) => ({
      ...prev,
      [storageKey]: 0,
    }));
  }

  function seekTo(percent: number) {
    const audio = audioRef.current;

    if (!audio || duration <= 0) return;

    const nextTime = (duration * percent) / 100;

    audio.currentTime = nextTime;

    setCurrentTime(nextTime);

    setSavedProgress((prev) => ({
      ...prev,
      [storageKey]: nextTime,
    }));
  }

  function handleLoadedMetadata(durationValue: number) {
    setDuration(durationValue);

    if (audioRef.current && currentTime > 0) {
      audioRef.current.currentTime = currentTime;
    }
  }

  function handleTimeUpdate(currentTimeValue: number) {
    setCurrentTime(currentTimeValue);

    setSavedProgress((prev) => ({
      ...prev,
      [storageKey]: currentTimeValue,
    }));
  }

  function handlePlay() {
    setIsPlaying(true);
  }

  function handlePause() {
    setIsPlaying(false);
  }

  function handleEnded() {
    setIsPlaying(false);

    setSavedProgress((prev) => ({
      ...prev,
      [storageKey]: 0,
    }));
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