type SessionData = {
  currentBookId: string;
  currentChapterId: number;
  currentVoiceId: string;
  currentTime: number;
  updatedAt: number;
};

const STORAGE_KEY = "ai-storyteller-playback-session-v1";

export function savePlaybackSession(session: SessionData) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getPlaybackSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPlaybackSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}
