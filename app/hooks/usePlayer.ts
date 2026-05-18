"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";
import { useAudioEngine } from "./useAudioEngine";

const STORAGE_KEY = "ai-storyteller-player-engine-v4";

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
  const books = useMemo(() => BOOKS, []);
  const voices = useMemo(() => VOICES, []);

  const saveTimeoutRef =
    useRef<NodeJS.Timeout | null>(null);

  const userUnlockedAudioRef = useRef(false);

  const defaultBookId = String(books[0]?.id ?? "");
  const defaultVoiceId = String(voices[0]?.id ?? "");

  const [selectedBookId, setSelectedBookId] =
    useState(defaultBookId);

  const [selectedChapterId, setSelectedChapterId] =
    useState(1);

  const [voiceByBook, setVoiceByBook] = useState<
    Record<string, string>
  >({});

  const [lastChapterByBook, setLastChapterByBook] =
    useState<Record<string, number>>({});

  const [progressByTrack, setProgressByTrack] =
    useState<Record<string, number>>({});

  const selectedBook =
    books.find(
      (book) => String(book.id) === selectedBookId
    ) || books[0];

  const selectedVoiceId =
    voiceByBook[selectedBookId] || defaultVoiceId;

  const selectedVoice =
    voices.find(
      (voice) => String(voice.id) === selectedVoiceId
    ) || voices[0];

  const currentChapter =
    selectedBook?.chapters?.find(
      (chapter) => chapter.id === selectedChapterId
    ) || selectedBook?.chapters?.[0];

  const currentAudio =
    currentChapter?.audioByVoice?.[
      selectedVoiceId as keyof typeof currentChapter.audioByVoice
    ] || "";

  const trackKey = `${selectedBookId}-${selectedChapterId}-${selectedVoiceId}`;

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seek,
  } = useAudioEngine(currentAudio);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const initialVoiceByBook: Record<string, string> =
        {};

      books.forEach((book, index) => {
        initialVoiceByBook[String(book.id)] =
          String(
            voices[index]?.id ||
              voices[0]?.id ||
              ""
          );
      });

      setVoiceByBook(initialVoiceByBook);

      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (parsed.selectedBookId) {
        setSelectedBookId(
          String(parsed.selectedBookId)
        );
      }

      if (parsed.selectedChapterId) {
        setSelectedChapterId(
          Number(parsed.selectedChapterId)
        );
      }

      if (parsed.voiceByBook) {
        setVoiceByBook(parsed.voiceByBook);
      }

      if (parsed.lastChapterByBook) {
        setLastChapterByBook(
          parsed.lastChapterByBook
        );
      }

      if (parsed.progressByTrack) {
        setProgressByTrack(
          parsed.progressByTrack
        );
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [books, voices]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedBookId,
        selectedChapterId,
        voiceByBook,
        lastChapterByBook,
        progressByTrack,
      })
    );
  }, [
    selectedBookId,
    selectedChapterId,
    voiceByBook,
    lastChapterByBook,
    progressByTrack,
  ]);

  useEffect(() => {
    const savedProgress =
      progressByTrack[trackKey] || 0;

    if (!audioRef.current || !duration) return;

    if (
      savedProgress > 0 &&
      savedProgress < duration
    ) {
      seek(savedProgress);
    }
  }, [trackKey, duration]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setProgressByTrack((prev) => ({
        ...prev,
        [trackKey]: currentTime,
      }));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentTime, trackKey]);

  const unlockMobileAudio = async () => {
    if (userUnlockedAudioRef.current) return;

    try {
      const audio = audioRef.current;

      if (!audio) return;

      audio.muted = true;

      await audio.play();

      audio.pause();

      audio.currentTime = 0;

      audio.muted = false;

      userUnlockedAudioRef.current = true;
    } catch (error) {
      console.error(error);
    }
  };

  const selectBook = async (
    bookId: string | number
  ) => {
    pause();

    const nextBookId = String(bookId);

    const restoredChapter =
      lastChapterByBook[nextBookId] || 1;

    setSelectedBookId(nextBookId);

    setSelectedChapterId(restoredChapter);
  };

  const selectChapter = async (
    chapterId: number
  ) => {
    pause();

    setSelectedChapterId(chapterId);

    setLastChapterByBook((prev) => ({
      ...prev,
      [selectedBookId]: chapterId,
    }));
  };

  const selectVoice = async (
    voiceId: string | number
  ) => {
    pause();

    setVoiceByBook((prev) => ({
      ...prev,
      [selectedBookId]: String(voiceId),
    }));
  };

  const togglePlay = async () => {
    try {
      await unlockMobileAudio();

      if (isPlaying) {
        pause();
        return;
      }

      await play();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeek = (value: number) => {
    seek(value);

    setProgressByTrack((prev) => ({
      ...prev,
      [trackKey]: value,
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
    selectedChapterId,
    currentChapter,
    setSelectedBookId: selectBook,
    setSelectedVoiceId: selectVoice,
    setSelectedChapterId: selectChapter,
    isPlaying,
    isLoadingAudio: false,
    currentTime,
    duration,
    formattedCurrentTime:
      formatTime(currentTime),
    formattedDuration:
      formatTime(duration),
    togglePlay,
    handleSeek,
    restart,
  };
}