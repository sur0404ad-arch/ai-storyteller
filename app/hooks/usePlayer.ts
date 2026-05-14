"use client";

import { useEffect, useMemo, useState } from "react";
import { BOOKS } from "../data/books";

export type PlayerBook = {
  id: number;
  title: string;
  author: string;
  source: string;
  chapter: string;
  subtitle: string;
  preview: string;
  audio: string;
};

const STORAGE_KEY = "ai-storyteller-player";

type SavedProgress = {
  [bookId: number]: {
    chapterId: number;
    currentTime: number;
    duration: number;
  };
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getPlayerBook(bookId: number, chapterId: number): PlayerBook {
  const book = BOOKS.find((item) => item.id === bookId) ?? BOOKS[0];
  const chapter =
    book.chapters.find((item) => item.id === chapterId) ?? book.chapters[0];

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    source: "Project Gutenberg",
    chapter: chapter.title,
    subtitle: chapter.subtitle,
    preview: chapter.preview,
    audio: chapter.audio,
  };
}

function getAllPlayerBooks(): PlayerBook[] {
  return BOOKS.map((book) => getPlayerBook(book.id, book.chapters[0].id));
}

export function usePlayer() {
  const [selectedBookId, setSelectedBookId] = useState(BOOKS[0].id);
  const [selectedChapterId, setSelectedChapterId] = useState(
    BOOKS[0].chapters[0].id
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [savedProgress, setSavedProgress] = useState<SavedProgress>({});
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const books = useMemo(() => getAllPlayerBooks(), []);

  const selectedBook = useMemo(
    () => getPlayerBook(selectedBookId, selectedChapterId),
    [selectedBookId, selectedChapterId]
  );

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        setHasLoadedStorage(true);
        return;
      }

      const parsedValue = JSON.parse(storedValue) as SavedProgress;
      setSavedProgress(parsedValue);

      const lastBookId = Number(
        window.localStorage.getItem(`${STORAGE_KEY}-last-book`) ?? BOOKS[0].id
      );

      const lastProgress = parsedValue[lastBookId];

      if (lastProgress) {
        setSelectedBookId(lastBookId);
        setSelectedChapterId(lastProgress.chapterId);
        setCurrentTime(lastProgress.currentTime);
        setDuration(lastProgress.duration);
      }

      setHasLoadedStorage(true);
    } catch {
      setHasLoadedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;

    const updatedProgress: SavedProgress = {
      ...savedProgress,
      [selectedBookId]: {
        chapterId: selectedChapterId,
        currentTime,
        duration,
      },
    };

    setSavedProgress(updatedProgress);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    window.localStorage.setItem(
      `${STORAGE_KEY}-last-book`,
      String(selectedBookId)
    );
  }, [
    selectedBookId,
    selectedChapterId,
    currentTime,
    duration,
    hasLoadedStorage,
  ]);

  const filteredBooks = useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return books;

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(value) ||
        book.author.toLowerCase().includes(value)
    );
  }, [books, searchValue]);

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  function selectBook(book: PlayerBook) {
    const originalBook = BOOKS.find((item) => item.id === book.id) ?? BOOKS[0];
    const existingProgress = savedProgress[originalBook.id];

    setSelectedBookId(originalBook.id);

    if (existingProgress) {
      setSelectedChapterId(existingProgress.chapterId);
      setCurrentTime(existingProgress.currentTime);
      setDuration(existingProgress.duration);
    } else {
      setSelectedChapterId(originalBook.chapters[0].id);
      setCurrentTime(0);
      setDuration(0);
    }

    setIsSearchOpen(false);
    setSearchValue("");
    setIsPlaying(false);
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
    setCurrentTime(duration);
  }

  return {
    books,
    selectedBook,
    filteredBooks,
    isSearchOpen,
    searchValue,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    setIsSearchOpen,
    setSearchValue,
    selectBook,
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  };
}