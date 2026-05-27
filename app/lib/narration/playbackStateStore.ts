import {
  NarrationVoiceId,
} from "./narrationManifest";

export type PlaybackState = {
  bookId: string;
  chapterId: number;
  voiceId: NarrationVoiceId;

  currentChunkIndex: number;

  currentTime: number;

  duration: number;

  playbackRate: number;

  isPlaying: boolean;

  updatedAt: number;
};

class PlaybackStateStore {
  private state: PlaybackState | null =
    null;

  setState(
    state: PlaybackState
  ) {
    this.state = {
      ...state,
      updatedAt: Date.now(),
    };

    return this.state;
  }

  getState() {
    return this.state;
  }

  patchState(
    partial: Partial<PlaybackState>
  ) {
    if (!this.state) {
      return null;
    }

    this.state = {
      ...this.state,
      ...partial,
      updatedAt: Date.now(),
    };

    return this.state;
  }

  clear() {
    this.state = null;
  }

  isReady() {
    return Boolean(this.state);
  }

  getPlaybackPosition() {
    if (!this.state) {
      return null;
    }

    return {
      currentChunkIndex:
        this.state.currentChunkIndex,

      currentTime:
        this.state.currentTime,
    };
  }

  getVoiceState() {
    if (!this.state) {
      return null;
    }

    return {
      voiceId:
        this.state.voiceId,

      playbackRate:
        this.state.playbackRate,
    };
  }

  getPlaybackMetrics() {
    if (!this.state) {
      return null;
    }

    return {
      duration:
        this.state.duration,

      currentTime:
        this.state.currentTime,

      isPlaying:
        this.state.isPlaying,

      playbackRate:
        this.state.playbackRate,

      updatedAt:
        this.state.updatedAt,
    };
  }
}

export const playbackStateStore =
  new PlaybackStateStore();