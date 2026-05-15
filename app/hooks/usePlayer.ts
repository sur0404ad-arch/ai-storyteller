"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";

const STORAGE_KEY = "ai-storyteller-player";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function usePlayer() {
  const books = useMemo(() => BOOKS, []);
  const voices = useMemo(() => VOICES, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id);
  const [selectedVoiceId, setSelectedVoiceId] = useState(voices[0]?.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressByBook, setProgressByBook] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState(0);

  const selectedBook =
    books.find((book) => book.id === selectedBookId) || books[0];

  const selectedVoice =
    voices.find((voice) => voice.id === selectedVoiceId) || voices[0];

  const currentChapter = selectedBook?.chapters?.[0];

  const audioSource =
    currentChapter?.audioByVoice?.[
      selectedVoice?.id as keyof typeof currentChapter.audioByVoice
    ] || "";

  const storageKey = `${selectedBookId}-${selectedVoiceId}`;
  const currentTime = progressByBook[storageKey] || 0;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed.selectedBookId) setSelectedBookId(parsed.selectedBookId);
      if (parsed.selectedVoiceId) setSelectedVoiceId(parsed.selectedVoiceId);
      if (parsed.progressByBook) setProgressByBook(parsed.progressByBook);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedBookId,
        selectedVoiceId,
        progressByBook,
      })
    );
  }, [selectedBookId, selectedVoiceId, progressByBook]);

  useEffect(() => {
    if (!audioSource) return;

    const audio = new Audio(audioSource);
    audioRef.current = audio;
    audio.preload = "auto";

    const savedProgress = progressByBook[storageKey] || 0;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);

      if (savedProgress > 0 && savedProgress < audio.duration) {
        audio.currentTime = savedProgress;
      }
    };

    const handleTimeUpdate = () => {
      setProgressByBook((prev) => ({
        ...prev,
        [storageKey]: audio.currentTime,
      }));
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioSource]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;

    setProgressByBook((prev) => ({
      ...prev,
      [storageKey]: value,
    }));
  };

  const restart = () => {
    handleSeek(0);
  };

  return {
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
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    togglePlay,
    handleSeek,
    restart,
  };
}