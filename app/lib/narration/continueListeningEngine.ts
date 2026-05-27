import {
  NarrationVoiceId,
} from "./narrationManifest";

export type ContinueListeningState = {
  bookId: string;

  chapterId: number;

  voiceId: NarrationVoiceId;

  chunkIndex: number;

  currentTime: number;

  duration: number;

  updatedAt: number;
};

class ContinueListeningEngine {
  private storageKey =
    "ai-storyteller-continue-listening";

  save(
    state: ContinueListeningState
  ) {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        ...state,
        updatedAt: Date.now(),
      })
    );
  }

  load():
    | ContinueListeningState
    | null {
    if (
      typeof window === "undefined"
    ) {
      return null;
    }

    try {
      const raw =
        localStorage.getItem(
          this.storageKey
        );

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  clear() {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    localStorage.removeItem(
      this.storageKey
    );
  }

  hasSavedProgress() {
    return Boolean(this.load());
  }

  getResumePosition() {
    const state = this.load();

    if (!state) {
      return null;
    }

    return {
      chunkIndex:
        state.chunkIndex,

      currentTime:
        state.currentTime,
    };
  }

  getResumeVoice() {
    const state = this.load();

    if (!state) {
      return null;
    }

    return state.voiceId;
  }
}

export const continueListeningEngine =
  new ContinueListeningEngine();