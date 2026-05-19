"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";
import { useAudioEngine } from "./useAudioEngine";

const STORAGE_KEY = "ai-storyteller-player-engine-v12";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function usePlayer() {
  const books = useMemo(() => BOOKS, []);
  const voices = useMemo(() => VOICES, []);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressByTrackRef = useRef<Record<string, number>>({});
  const lastChapterByBookRef = useRef<Record<string, number>>({});
  const voiceByBookRef = useRef<Record<string, string>>({});
  const actionLockRef = useRef(false);

  const defaultBookId = String(books[0]?.id ?? "");
  const defaultVoiceId = String(voices[0]?.id ?? "");

  const [selectedBookId, setSelectedBookId] = useState(defaultBookId);
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [voiceByBook, setVoiceByBook] = useState<Record<string, string>>({});
  const [lastChapterByBook, setLastChapterByBook] = useState<Record<string, number>>({});
  const [progressByTrack, setProgressByTrack] = useState<Record<string, number>>({});

  const selectedBook =
    books.find((book) => String(book.id) === selectedBookId) || books[0];

  const selectedVoiceId =
    voiceByBook[selectedBookId] ||
    voiceByBookRef.current[selectedBookId] ||
    defaultVoiceId;

  const selectedVoice =
    voices.find((voice) => String(voice.id) === String(selectedVoiceId)) ||
    voices[0];

  const currentChapter =
    selectedBook?.chapters?.find((chapter) => chapter.id === selectedChapterId) ||
    selectedBook?.chapters?.[0];

  const currentAudio =
    currentChapter?.audioByVoice?.[
      selectedVoiceId as keyof typeof currentChapter.audioByVoice
    ] || "";

  const trackKey = `${selectedBookId}-${selectedChapterId}-${selectedVoiceId}`;

  const {
    audioRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seek,
    load,
  } = useAudioEngine(currentAudio);

  function persistNow(
    nextSelectedBookId = selectedBookId,
    nextSelectedChapterId = selectedChapterId,
    nextVoiceByBook = voiceByBookRef.current,
    nextLastChapterByBook = lastChapterByBookRef.current,
    nextProgressByTrack = progressByTrackRef.current
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedBookId: nextSelectedBookId,
        selectedChapterId: nextSelectedChapterId,
        voiceByBook: nextVoiceByBook,
        lastChapterByBook: nextLastChapterByBook,
        progressByTrack: nextProgressByTrack,
      })
    );
  }

  function saveCurrentProgress() {
    const audioTime = audioRef.current?.currentTime ?? currentTime;

    if (!Number.isFinite(audioTime)) return;

    const nextProgressByTrack = {
      ...progressByTrackRef.current,
      [trackKey]: audioTime,
    };

    const nextLastChapterByBook = {
      ...lastChapterByBookRef.current,
      [selectedBookId]: selectedChapterId,
    };

    progressByTrackRef.current = nextProgressByTrack;
    lastChapterByBookRef.current = nextLastChapterByBook;

    setProgressByTrack(nextProgressByTrack);
    setLastChapterByBook(nextLastChapterByBook);

    persistNow(
      selectedBookId,
      selectedChapterId,
      voiceByBookRef.current,
      nextLastChapterByBook,
      nextProgressByTrack
    );
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const initialVoiceByBook: Record<string, string> = {};

      books.forEach((book, index) => {
        initialVoiceByBook[String(book.id)] = String(
          voices[index]?.id || voices[0]?.id || ""
        );
      });

      voiceByBookRef.current = initialVoiceByBook;
      setVoiceByBook(initialVoiceByBook);
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (parsed.voiceByBook) {
        voiceByBookRef.current = parsed.voiceByBook;
        setVoiceByBook(parsed.voiceByBook);
      }

      if (parsed.lastChapterByBook) {
        lastChapterByBookRef.current = parsed.lastChapterByBook;
        setLastChapterByBook(parsed.lastChapterByBook);
      }

      if (parsed.progressByTrack) {
        progressByTrackRef.current = parsed.progressByTrack;
        setProgressByTrack(parsed.progressByTrack);
      }

      if (parsed.selectedBookId) {
        setSelectedBookId(String(parsed.selectedBookId));
      }

      if (parsed.selectedChapterId) {
        setSelectedChapterId(Number(parsed.selectedChapterId));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [books, voices]);

  useEffect(() => {
    voiceByBookRef.current = voiceByBook;
  }, [voiceByBook]);

  useEffect(() => {
    progressByTrackRef.current = progressByTrack;
  }, [progressByTrack]);

  useEffect(() => {
    lastChapterByBookRef.current = lastChapterByBook;
  }, [lastChapterByBook]);

  useEffect(() => {
    persistNow();
  }, [
    selectedBookId,
    selectedChapterId,
    voiceByBook,
    lastChapterByBook,
    progressByTrack,
  ]);

  useEffect(() => {
    if (!currentAudio) return;

    const savedProgress = progressByTrackRef.current[trackKey] || 0;

    load(currentAudio, savedProgress);
  }, [trackKey, currentAudio, load]);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const audioTime = audioRef.current?.currentTime ?? currentTime;

      if (!Number.isFinite(audioTime)) return;

      const nextProgressByTrack = {
        ...progressByTrackRef.current,
        [trackKey]: audioTime,
      };

      progressByTrackRef.current = nextProgressByTrack;
      setProgressByTrack(nextProgressByTrack);

      persistNow(
        selectedBookId,
        selectedChapterId,
        voiceByBookRef.current,
        lastChapterByBookRef.current,
        nextProgressByTrack
      );
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentTime, trackKey, selectedBookId, selectedChapterId]);

  const selectBook = async (bookId: string | number) => {
    if (actionLockRef.current) return;

    actionLockRef.current = true;

    try {
      saveCurrentProgress();
      pause();

      const nextBookId = String(bookId);
      const restoredChapter = lastChapterByBookRef.current[nextBookId] || 1;
      const restoredVoice = voiceByBookRef.current[nextBookId] || defaultVoiceId;

      const restoredTrackKey = `${nextBookId}-${restoredChapter}-${restoredVoice}`;
      const restoredProgress = progressByTrackRef.current[restoredTrackKey] || 0;

      setSelectedBookId(nextBookId);
      setSelectedChapterId(restoredChapter);

      const nextBook =
        books.find((book) => String(book.id) === nextBookId) || books[0];

      const nextChapter =
        nextBook?.chapters?.find((chapter) => chapter.id === restoredChapter) ||
        nextBook?.chapters?.[0];

      const nextAudio =
        nextChapter?.audioByVoice?.[
          restoredVoice as keyof typeof nextChapter.audioByVoice
        ] || "";

      if (nextAudio) await load(nextAudio, restoredProgress);
    } finally {
      setTimeout(() => {
        actionLockRef.current = false;
      }, 150);
    }
  };

  const selectChapter = async (chapterId: number) => {
    if (actionLockRef.current) return;

    actionLockRef.current = true;

    try {
      saveCurrentProgress();
      pause();

      const nextLastChapterByBook = {
        ...lastChapterByBookRef.current,
        [selectedBookId]: chapterId,
      };

      lastChapterByBookRef.current = nextLastChapterByBook;
      setLastChapterByBook(nextLastChapterByBook);
      setSelectedChapterId(chapterId);

      const restoredTrackKey = `${selectedBookId}-${chapterId}-${selectedVoiceId}`;
      const restoredProgress = progressByTrackRef.current[restoredTrackKey] || 0;

      const nextChapter =
        selectedBook?.chapters?.find((chapter) => chapter.id === chapterId) ||
        selectedBook?.chapters?.[0];

      const nextAudio =
        nextChapter?.audioByVoice?.[
          selectedVoiceId as keyof typeof nextChapter.audioByVoice
        ] || "";

      if (nextAudio) await load(nextAudio, restoredProgress);
    } finally {
      setTimeout(() => {
        actionLockRef.current = false;
      }, 150);
    }
  };

  const selectVoice = async (voiceId: string | number) => {
    if (actionLockRef.current) return;

    actionLockRef.current = true;

    try {
      saveCurrentProgress();

      const nextVoiceId = String(voiceId);

      const nextVoiceByBook = {
        ...voiceByBookRef.current,
        [selectedBookId]: nextVoiceId,
      };

      voiceByBookRef.current = nextVoiceByBook;
      setVoiceByBook(nextVoiceByBook);

      const restoredTrackKey = `${selectedBookId}-${selectedChapterId}-${nextVoiceId}`;
      const restoredProgress = progressByTrackRef.current[restoredTrackKey] || 0;

      const nextAudio =
        currentChapter?.audioByVoice?.[
          nextVoiceId as keyof typeof currentChapter.audioByVoice
        ] || "";

      if (!nextAudio) return;

      const wasPlaying = isPlaying;

      pause();
      await load(nextAudio, restoredProgress);

      if (wasPlaying) await play(restoredProgress);
    } finally {
      setTimeout(() => {
        actionLockRef.current = false;
      }, 150);
    }
  };

  const togglePlay = async () => {
    if (actionLockRef.current) return;

    actionLockRef.current = true;

    try {
      if (isPlaying) {
        saveCurrentProgress();
        pause();
        return;
      }

      const savedProgress = progressByTrackRef.current[trackKey] || 0;

      if (currentAudio) await load(currentAudio, savedProgress);

      await play(savedProgress);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        actionLockRef.current = false;
      }, 250);
    }
  };

  const handleSeek = (value: number) => {
    seek(value);

    const nextProgressByTrack = {
      ...progressByTrackRef.current,
      [trackKey]: value,
    };

    progressByTrackRef.current = nextProgressByTrack;
    setProgressByTrack(nextProgressByTrack);

    persistNow(
      selectedBookId,
      selectedChapterId,
      voiceByBookRef.current,
      lastChapterByBookRef.current,
      nextProgressByTrack
    );
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
    isReady,
    isPlaying,
    isLoadingAudio: false,
    currentTime,
    duration,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    togglePlay,
    handleSeek,
    restart,
  };
}