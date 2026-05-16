"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";

const STORAGE_KEY = "ai-storyteller-player-v5";

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
  const shouldAutoPlayRef = useRef(false);

  const defaultBookId = String(books[0]?.id ?? "");
  const defaultVoiceId = String(voices[0]?.id ?? "");

  const [selectedBookId, setSelectedBookId] = useState(defaultBookId);
  const [voiceByBook, setVoiceByBook] = useState<Record<string, string>>({});
  const [progressByBookVoice, setProgressByBookVoice] = useState<Record<string, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const selectedVoiceId = voiceByBook[selectedBookId] || defaultVoiceId;

  const selectedBook =
    books.find((book) => String(book.id) === selectedBookId) || books[0];

  const selectedVoice =
    voices.find((voice) => String(voice.id) === selectedVoiceId) || voices[0];

  const currentChapter = selectedBook?.chapters?.[0];

  const audioSource =
    currentChapter?.audioByVoice?.[
      selectedVoice?.id as keyof typeof currentChapter.audioByVoice
    ] || "";

  const progressKey = `${selectedBookId}-${selectedVoiceId}`;
  const currentTime = progressByBookVoice[progressKey] || 0;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.selectedBookId) {
          setSelectedBookId(String(parsed.selectedBookId));
        }

        if (parsed.voiceByBook) {
          setVoiceByBook(parsed.voiceByBook);
        }

        if (parsed.progressByBookVoice) {
          setProgressByBookVoice(parsed.progressByBookVoice);
        }

        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const initialVoiceByBook: Record<string, string> = {};

    books.forEach((book, index) => {
      initialVoiceByBook[String(book.id)] = String(
        voices[index]?.id || voices[0]?.id || ""
      );
    });

    setVoiceByBook(initialVoiceByBook);
  }, [books, voices]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedBookId,
        voiceByBook,
        progressByBookVoice,
      })
    );
  }, [selectedBookId, voiceByBook, progressByBookVoice]);

  useEffect(() => {
    if (!audioSource) return;

    audioRef.current?.pause();

    setIsPlaying(false);
    setDuration(0);

    const audio = new Audio(audioSource);
    audio.preload = "auto";
    audioRef.current = audio;

    const savedProgress = progressByBookVoice[progressKey] || 0;

    const handleLoadedMetadata = async () => {
      setDuration(audio.duration || 0);

      if (savedProgress > 0 && savedProgress < audio.duration) {
        audio.currentTime = savedProgress;
      }

      if (shouldAutoPlayRef.current) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }

      shouldAutoPlayRef.current = false;
    };

    const handleTimeUpdate = () => {
      setProgressByBookVoice((prev) => ({
        ...prev,
        [progressKey]: audio.currentTime,
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
  }, [audioSource, progressKey]);

  const selectBook = (bookId: string | number) => {
    shouldAutoPlayRef.current = true;
    setSelectedBookId(String(bookId));
  };

  const selectVoice = (voiceId: string | number) => {
    shouldAutoPlayRef.current = true;

    setVoiceByBook((prev) => ({
      ...prev,
      [selectedBookId]: String(voiceId),
    }));
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value;

    setProgressByBookVoice((prev) => ({
      ...prev,
      [progressKey]: value,
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
    setSelectedBookId: selectBook,
    setSelectedVoiceId: selectVoice,
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