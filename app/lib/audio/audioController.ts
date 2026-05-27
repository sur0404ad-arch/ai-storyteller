const STORAGE_KEY = "ai-storyteller-volume";

let globalAudio: HTMLAudioElement | null = null;

export function registerGlobalAudio(audio: HTMLAudioElement) {
  globalAudio = audio;
  globalAudio.volume = getStoredVolume();
  return globalAudio;
}

export function getGlobalAudio() {
  return globalAudio;
}

export function getStoredVolume() {
  if (typeof window === "undefined") return 1;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  const value = stored ? Number(stored) : 1;

  if (Number.isNaN(value)) return 1;
  return Math.min(1, Math.max(0, value));
}

export function setGlobalVolume(value: number) {
  const safeValue = Math.min(1, Math.max(0, value));

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, String(safeValue));
  }

  if (globalAudio) {
    globalAudio.volume = safeValue;
  }

  return safeValue;
}