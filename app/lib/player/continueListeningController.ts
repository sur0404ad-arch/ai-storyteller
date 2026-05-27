const STORAGE_KEY = "ai-storyteller-player-progress-v19";

export type ContinueListeningData = {
  selectedBookId: string;
  selectedChapterId: number;
  voiceByBook: Record<string, string>;
  lastChapterByBook: Record<string, number>;
  progressByTrack: Record<string, number>;
};

export function loadContinueListening(): ContinueListeningData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveContinueListening(
  data: ContinueListeningData
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}