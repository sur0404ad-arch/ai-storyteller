export type Bookmark = {
  id: string;
  bookId: string;
  chapterId: number;
  timestamp: number;
  label: string;
  createdAt: number;
};

export type BookmarkItem = {
  id: string;
  bookId: string | number;
  chapterId: string | number;
  bookTitle: string;
  chapterTitle: string;
  time: string;
  seconds: number;
  createdAt: number;
};

const STORAGE_KEY = "ai-storyteller-bookmarks-v1";

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addBookmark(item: Omit<BookmarkItem, "id" | "createdAt">) {
  if (typeof window === "undefined") return [];

  const bookmark: BookmarkItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  const updated = [bookmark, ...getBookmarks()].slice(0, 50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function saveBookmark(bookmark: Bookmark) {
  if (typeof window === "undefined") return;

  const item: BookmarkItem = {
    id: bookmark.id,
    bookId: bookmark.bookId,
    chapterId: bookmark.chapterId,
    bookTitle: String(bookmark.bookId),
    chapterTitle: bookmark.label,
    time: formatTime(bookmark.timestamp),
    seconds: bookmark.timestamp,
    createdAt: bookmark.createdAt,
  };

  const updated = [item, ...getBookmarks()].slice(0, 50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteBookmark(bookmarkId: string) {
  if (typeof window === "undefined") return [];

  const updated = getBookmarks().filter(
    (bookmark) => bookmark.id !== bookmarkId
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function clearBookmarks() {
  if (typeof window === "undefined") return [];

  localStorage.removeItem(STORAGE_KEY);

  return [];
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
