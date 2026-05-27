"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BOOKS } from "../data/books";
import { VOICES } from "../data/voices";

import {
  Bookmark,
  saveBookmark,
} from "../lib/bookmarks/bookmarkController";

import {
  getPlaybackSession,
  savePlaybackSession,
} from "../lib/playback/playbackSessionManager";

import { useAudioEngine } from "./useAudioEngine";

const STORAGE_KEY = "ai-storyteller-player-engine-v6";

function clampToDuration(time: number, duration: number) {
  if (!Number.isFinite(time) || time <= 0) {
    return 0;
  }

  if (duration > 0) {
    return Math.min(Math.max(0, time), duration);
  }

  return Math.max(0, time);
}

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

function waitForAudioSeeked(
  audio: HTMLAudioElement,
  targetTime: number
) {
  const safeDuration = Number.isFinite(audio.duration)
    ? audio.duration
    : 0;

  const safeTarget = clampToDuration(targetTime, safeDuration);

  return new Promise<void>((resolve) => {
    const epsilon = 0.15;

    if (
      audio.readyState >= 1 &&
      Math.abs(audio.currentTime - safeTarget) < epsilon
    ) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(() => {
      cleanup();
      resolve();
    }, 3000);

    const onSeeked = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      clearTimeout(timeout);
      audio.removeEventListener("seeked", onSeeked);
    };

    audio.addEventListener("seeked", onSeeked, { once: true });
    audio.currentTime = safeTarget;
  });
}

export function usePlayer() {
  const books = useMemo(() => BOOKS, []);
  const voices = useMemo(() => VOICES, []);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const restoredTrackRef = useRef("");

  const [dragValue, setDragValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const dragValueRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isSeekingRef = useRef(false);
  const wasPlayingBeforeDragRef = useRef(false);
  const seekCommitGenerationRef = useRef(0);
  const releaseHandledRef = useRef(false);

  const defaultBookId = String(books[0]?.id ?? "");
  const defaultVoiceId = String(voices[0]?.id ?? "");

  const [selectedBookId, setSelectedBookIdState] =
    useState(defaultBookId);

  const [selectedChapterId, setSelectedChapterIdState] =
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
    ] ||
    Object.values(currentChapter?.audioByVoice || {})[0] ||
    "";

  const progressKey =
    `${selectedBookId}-${selectedChapterId}`;

  const sourceKey =
    `${selectedBookId}-${selectedChapterId}-${selectedVoiceId}-${currentAudio}`;

  const {
    audioRef,
    isPlaying,
    isReady,
    currentTime,
    duration,
    playbackRate,
    setPlaybackRate,
    play,
    pause,
    seek,
    load,
  } = useAudioEngine(currentAudio);

  const isScrubbing = isDragging || isSeeking;

  const displayTime = isScrubbing ? dragValue : currentTime;

  useEffect(() => {
    if (isScrubbing) {
      return;
    }

    setDragValue(currentTime);
  }, [currentTime, isScrubbing]);

  const confirmAudioTime = useCallback(
    async (value: number) => {
      const audio = audioRef.current;

      if (!audio) {
        return value;
      }

      const safeDuration = Number.isFinite(audio.duration)
        ? audio.duration
        : 0;

      const safeValue = clampToDuration(value, safeDuration);

      await waitForAudioSeeked(audio, safeValue);

      if (Math.abs(audio.currentTime - safeValue) > 0.15) {
        audio.currentTime = safeValue;
        await waitForAudioSeeked(audio, safeValue);
      }

      return Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : safeValue;
    },
    [audioRef]
  );

  const commitSeek = useCallback(
    async (value: number) => {
      if (isSeekingRef.current) {
        return;
      }

      const commitId = seekCommitGenerationRef.current + 1;
      seekCommitGenerationRef.current = commitId;

      isSeekingRef.current = true;
      setIsSeeking(true);

      const shouldResume = wasPlayingBeforeDragRef.current;

      try {
        pause();

        await seek(value);

        if (commitId !== seekCommitGenerationRef.current) {
          return;
        }

        const confirmedTime = Number.isFinite(audioRef.current?.currentTime)
          ? (audioRef.current?.currentTime as number)
          : value;

        setProgressByTrack((prev) => ({
          ...prev,
          [progressKey]: confirmedTime,
        }));

        setDragValue(confirmedTime);

        if (shouldResume) {
          await play(value);
        }
      } finally {
        if (commitId === seekCommitGenerationRef.current) {
          isSeekingRef.current = false;
          setIsSeeking(false);
          isDraggingRef.current = false;
          setIsDragging(false);
          wasPlayingBeforeDragRef.current = false;
        }
      }
    },
    [seek, pause, play, progressKey, confirmAudioTime]
  );

  const handleSliderChange = useCallback(
    (value: number) => {
      if (!isDraggingRef.current) {
        wasPlayingBeforeDragRef.current = isPlaying;
        releaseHandledRef.current = false;
        pause();
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      dragValueRef.current = value;
      setDragValue(value);
    },
    [isPlaying, pause]
  );

  useEffect(() => {
    if (!isDragging || isSeeking) {
      return;
    }

    const onRelease = () => {
      if (!isDraggingRef.current || releaseHandledRef.current) {
        return;
      }

      releaseHandledRef.current = true;
      isDraggingRef.current = false;
      setIsDragging(false);

      void commitSeek(dragValueRef.current);
    };

    window.addEventListener("pointerup", onRelease);
    window.addEventListener("mouseup", onRelease);

    return () => {
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("mouseup", onRelease);
    };
  }, [isDragging, isSeeking, commitSeek]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const initialVoiceByBook: Record<string, string> = {};

      books.forEach((book, index) => {
        initialVoiceByBook[String(book.id)] = String(
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
        setSelectedBookIdState(
          String(parsed.selectedBookId)
        );
      }

      if (parsed.selectedChapterId) {
        setSelectedChapterIdState(
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
    const session = getPlaybackSession();

    if (!session) return;

    setSelectedBookIdState(session.currentBookId);

    setSelectedChapterIdState(
      session.currentChapterId
    );

    setVoiceByBook((prev) => ({
      ...prev,
      [session.currentBookId]:
        session.currentVoiceId,
    }));

    setProgressByTrack((prev) => ({
      ...prev,
      [
        `${session.currentBookId}-${session.currentChapterId}`
      ]: session.currentTime,
    }));
  }, []);

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
    if (isScrubbing) {
      return;
    }

    savePlaybackSession({
      currentBookId: selectedBookId,
      currentChapterId: selectedChapterId,
      currentVoiceId: selectedVoiceId,
      currentTime,
      updatedAt: Date.now(),
    });
  }, [
    selectedBookId,
    selectedChapterId,
    selectedVoiceId,
    currentTime,
    isScrubbing,
  ]);

  useEffect(() => {
    if (!currentAudio) return;

    if (restoredTrackRef.current === sourceKey) {
      return;
    }

    if (isScrubbing) {
      return;
    }

    restoredTrackRef.current = sourceKey;

    const savedProgress =
      progressByTrack[progressKey] || 0;

    load(currentAudio, {
      preserveTime: true,
      startAt: savedProgress,
      autoplay: isPlaying,
    });
  }, [
    currentAudio,
    sourceKey,
    progressKey,
    progressByTrack,
    load,
    isPlaying,
    isScrubbing,
  ]);

  useEffect(() => {
    if (isScrubbing) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setProgressByTrack((prev) => ({
        ...prev,
        [progressKey]: currentTime,
      }));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentTime, progressKey, isScrubbing]);

  const setSelectedBookId = (
    bookId: string | number
  ) => {
    const nextBookId = String(bookId);

    const restoredChapter =
      lastChapterByBook[nextBookId] || 1;

    setSelectedBookIdState(nextBookId);

    setSelectedChapterIdState(
      restoredChapter
    );
  };

  const setSelectedChapterId = (
    chapterId: number
  ) => {
    setSelectedChapterIdState(chapterId);

    setLastChapterByBook((prev) => ({
      ...prev,
      [selectedBookId]: chapterId,
    }));
  };

  const setSelectedVoiceId = (
    voiceId: string | number
  ) => {
    const nextVoiceId = String(voiceId);

    setVoiceByBook((prev) => ({
      ...prev,
      [selectedBookId]: nextVoiceId,
    }));
  };

  const togglePlay = async () => {
    if (isPlaying) {
      pause();
      return;
    }

    if (currentAudio) {
      await load(currentAudio, {
        preserveTime: true,
        startAt:
          progressByTrack[progressKey] ||
          currentTime,
        autoplay: true,
      });

      return;
    }

    await play();
  };

  const handleSeek = useCallback(
    (value: number) => {
      seekCommitGenerationRef.current += 1;
      isDraggingRef.current = false;
      setIsDragging(false);
      wasPlayingBeforeDragRef.current = false;
      void commitSeek(value);
    },
    [commitSeek]
  );

  const restart = () => {
    seekCommitGenerationRef.current += 1;
    isDraggingRef.current = false;
    setIsDragging(false);
    wasPlayingBeforeDragRef.current = false;
    void commitSeek(0);
  };

  const createBookmark = (label?: string) => {
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),

      bookId: selectedBookId,

      chapterId: selectedChapterId,

      timestamp: displayTime,

      label:
        label ||
        `${selectedBook.title} — ${
          currentChapter?.title || "Moment"
        }`,

      createdAt: Date.now(),
    };

    saveBookmark(bookmark);
  };

  const jumpToBookmark = async (
    bookmark: Bookmark
  ) => {
    const targetBook =
      books.find(
        (book) =>
          String(book.id) === bookmark.bookId
      ) || books[0];

    const targetVoiceId =
      voiceByBook[bookmark.bookId] ||
      defaultVoiceId;

    const targetChapter =
      targetBook?.chapters?.find(
        (chapter) =>
          chapter.id === bookmark.chapterId
      ) || targetBook?.chapters?.[0];

    const targetAudio =
      targetChapter?.audioByVoice?.[
        targetVoiceId as keyof typeof targetChapter.audioByVoice
      ] ||
      Object.values(
        targetChapter?.audioByVoice || {}
      )[0] ||
      "";

    if (!targetAudio) return;

    setSelectedBookIdState(
      bookmark.bookId
    );

    setSelectedChapterIdState(
      bookmark.chapterId
    );

    await load(targetAudio, {
      preserveTime: false,
      startAt: bookmark.timestamp,
      autoplay: true,
    });
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
    setSelectedBookId,
    setSelectedVoiceId,
    setSelectedChapterId,
    isPlaying,
    isLoadingAudio: !isReady,
    currentTime: displayTime,
    duration,
    formattedCurrentTime:
      formatTime(displayTime),
    formattedDuration:
      formatTime(duration),
    playbackRate,
    setPlaybackRate,
    togglePlay,
    handleSeek,
    handleSliderChange,
    restart,
    createBookmark,
    jumpToBookmark,
    audioRef,
  };
}
