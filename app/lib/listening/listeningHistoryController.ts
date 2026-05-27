export type ListeningHistoryItem = {
  id: string;
  bookId: string;
  chapterId: number;
  bookTitle: string;
  chapterTitle: string;
  timestamp: number;
  duration: number;
  updatedAt: number;
};

const STORAGE_KEY = "ai-storyteller-listening-history-v1";

export function getListeningHistory(): ListeningHistoryItem[] {
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

export function saveListeningProgress(item: ListeningHistoryItem) {
  if (typeof window === "undefined") return [];

  const existing = getListeningHistory();

  const withoutCurrent = existing.filter(
    (historyItem) =>
      !(
        historyItem.bookId === item.bookId &&
        historyItem.chapterId === item.chapterId
      )
  );

  const updated = [item, ...withoutCurrent].slice(0, 20);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function clearListeningHistory() {
  if (typeof window === "undefined") return [];

  localStorage.removeItem(STORAGE_KEY);

  return [];
}
