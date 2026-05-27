import {
  ChapterNarrationManifest,
} from "./narrationManifest";

import { PlaybackSession } from "./playbackSession";

const PLAYBACK_DEBUG = true;

function debugNarrationManager(
  event: string,
  detail: Record<string, unknown>
) {
  if (!PLAYBACK_DEBUG) {
    return;
  }

  console.log(
    "[playback-debug][playbackSessionManager]",
    event,
    detail
  );
}

class PlaybackSessionManager {
  private session: PlaybackSession | null =
    null;

  private audio: HTMLAudioElement | null =
    null;

  initializeGlobalAudio() {
    if (this.audio) {
      return this.audio;
    }

    this.audio = new Audio();
    this.audio.dataset.playbackId = `playbackSessionManager-${Date.now()}`;

    debugNarrationManager("HTMLAudioElement:created", {
      elementId: this.audio.dataset.playbackId,
    });

    this.audio.preload = "auto";

    return this.audio;
  }

  async createSession(
    manifest: ChapterNarrationManifest
  ) {
    const audio =
      this.initializeGlobalAudio();

    if (this.session) {
      this.session.destroy();
    }

    this.session =
      new PlaybackSession({
        manifest,
        audio,
      });

    await this.session.initialize();

    return this.session;
  }

  getSession() {
    return this.session;
  }

  getAudio() {
    return this.audio;
  }

  async play() {
    if (!this.session) {
      return;
    }

    await this.session.play();
  }

  pause() {
    if (!this.session) {
      return;
    }

    this.session.pause();
  }

  async resume() {
    if (!this.session) {
      return;
    }

    await this.session.resume();
  }

  async next() {
    if (!this.session) {
      return null;
    }

    return this.session.moveNext();
  }

  async seek(
    time: number,
    options?: {
      shouldPlay?: boolean;
    }
  ) {
    if (!this.session) {
      return;
    }

    await this.session.seek(time, options);
  }

  setPlaybackRate(rate: number) {
    if (!this.session) {
      return;
    }

    this.session.setPlaybackRate(rate);
  }

  destroy() {
    if (this.session) {
      this.session.destroy();
    }

    this.session = null;
  }
}

export const playbackSessionManager =
  new PlaybackSessionManager();