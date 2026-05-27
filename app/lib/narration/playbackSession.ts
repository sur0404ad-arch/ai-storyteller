import {
  ChapterNarrationManifest,
  NarrationChunk,
} from "./narrationManifest";

import { PrebufferQueue } from "./prebufferQueue";

const PLAYBACK_DEBUG = true;

function debugNarrationSession(
  event: string,
  detail: Record<string, unknown>
) {
  if (!PLAYBACK_DEBUG) {
    return;
  }

  console.log("[playback-debug][playbackSession]", event, detail);
}

export class PlaybackSession {
  private manifest: ChapterNarrationManifest;

  private queue: PrebufferQueue;

  private audio: HTMLAudioElement;

  private activeChunk: NarrationChunk | null = null;

  private loadGeneration = 0;

  constructor(params: {
    manifest: ChapterNarrationManifest;
    audio: HTMLAudioElement;
  }) {
    this.manifest = params.manifest;
    this.queue = new PrebufferQueue(params.manifest);
    this.audio = params.audio;
  }

  async initialize() {
    const prepared = this.queue.preloadCurrentAndNext();

    this.activeChunk = prepared.current || null;

    if (!this.activeChunk) {
      return;
    }

    await this.loadChunk(this.activeChunk, 0, false);
  }

  async play() {
    if (!this.activeChunk) {
      await this.initialize();
    }

    if (!this.audio.src) {
      return;
    }

    const generation = this.loadGeneration;

    await this.applyPlaybackTime(this.audio.currentTime);

    if (generation !== this.loadGeneration) {
      return;
    }

    debugNarrationSession("play()", {
      bookId: this.manifest.bookId,
      chapterId: this.manifest.chapterId,
      voiceId: this.manifest.voiceId,
      chunkIndex: this.queue.getState().currentIndex,
      src: this.audio.src,
      currentTime: this.audio.currentTime,
      caller: "play",
    });

    try {
      await this.audio.play();
    } catch {
      // ignore autoplay restrictions
    }
  }

  pause() {
    this.audio.pause();
  }

  async resume() {
    if (!this.audio.src) {
      await this.initialize();
    }

    await this.play();
  }

  async seek(
    time: number,
    options?: {
      shouldPlay?: boolean;
    }
  ) {
    const shouldPlay = options?.shouldPlay ?? false;
    const safeTime = Math.max(0, Number.isFinite(time) ? time : 0);

    debugNarrationSession("seek:before", {
      bookId: this.manifest.bookId,
      chapterId: this.manifest.chapterId,
      voiceId: this.manifest.voiceId,
      chunkIndex: this.queue.getState().currentIndex,
      requestedTime: time,
      safeTime,
      currentTime: this.audio.currentTime,
      src: this.audio.src,
      shouldPlay,
    });

    const chunks = this.manifest.chunks || [];

    if (!chunks.length) {
      const generation = this.nextGeneration();
      await this.applyPlaybackTime(safeTime);

      if (shouldPlay) {
        await this.playIfCurrent(generation);
      }

      return;
    }

    let accumulatedTime = 0;
    let targetChunk = chunks[0];
    let targetChunkIndex = 0;
    let targetLocalTime = safeTime;

    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const chunkDuration = this.getChunkDuration(chunk);

      if (safeTime <= accumulatedTime + chunkDuration || index === chunks.length - 1) {
        targetChunk = chunk;
        targetChunkIndex = index;
        targetLocalTime = Math.max(0, safeTime - accumulatedTime);
        break;
      }

      accumulatedTime += chunkDuration;
    }

    const currentIndex = this.queue.getState().currentIndex;

    if (
      targetChunkIndex !== currentIndex ||
      this.activeChunk?.audioUrl !== targetChunk.audioUrl
    ) {
      this.queue.setCurrentIndex(targetChunkIndex);
      this.activeChunk = targetChunk;

      await this.loadChunk(targetChunk, targetLocalTime, shouldPlay);

      this.queue.preloadCurrentAndNext();

      debugNarrationSession("seek:after", {
        bookId: this.manifest.bookId,
        chapterId: this.manifest.chapterId,
        voiceId: this.manifest.voiceId,
        chunkIndex: this.queue.getState().currentIndex,
        currentTime: this.audio.currentTime,
        src: this.audio.src,
        path: "chunk-changed",
      });

      return;
    }

    const generation = this.nextGeneration();

    await this.applyPlaybackTime(targetLocalTime);

    if (shouldPlay) {
      await this.playIfCurrent(generation);
    }

    debugNarrationSession("seek:after", {
      bookId: this.manifest.bookId,
      chapterId: this.manifest.chapterId,
      voiceId: this.manifest.voiceId,
      chunkIndex: this.queue.getState().currentIndex,
      currentTime: this.audio.currentTime,
      src: this.audio.src,
    });
  }

  setPlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
  }

  async moveNext() {
    const nextChunk = this.queue.moveNext();

    if (!nextChunk) {
      return null;
    }

    this.activeChunk = nextChunk;

    await this.loadChunk(nextChunk, 0, true);

    this.queue.preloadCurrentAndNext();

    return nextChunk;
  }

  getCurrentChunk() {
    return this.activeChunk;
  }

  getCurrentIndex() {
    return this.queue.getState().currentIndex;
  }

  getBufferedChunks() {
    return this.queue.getBufferedChunks();
  }

  getAudio() {
    return this.audio;
  }

  destroy() {
    this.nextGeneration();
    this.audio.pause();
  }

  private nextGeneration() {
    this.loadGeneration += 1;
    return this.loadGeneration;
  }

  private clampTime(time: number, duration: number) {
    if (!Number.isFinite(time) || time <= 0) {
      return 0;
    }

    if (duration > 0) {
      return Math.min(Math.max(0, time), duration);
    }

    return Math.max(0, time);
  }

  private waitForSeeked(targetTime: number) {
    const audio = this.audio;
    const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const safeTarget = this.clampTime(targetTime, safeDuration);

    return new Promise<void>((resolve) => {
      const epsilon = 0.25;

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
    debugNarrationSession("seek:setCurrentTime", {
      before: audio.currentTime,
      target: safeTarget,
      src: audio.src,
    });
    audio.currentTime = safeTarget;
  });
}

  private async applyPlaybackTime(time: number) {
    const safeDuration = Number.isFinite(this.audio.duration)
      ? this.audio.duration
      : 0;

    const safeTime = this.clampTime(time, safeDuration);

    await this.waitForSeeked(safeTime);
  }

  private async playIfCurrent(generation: number) {
    if (generation !== this.loadGeneration) {
      return;
    }

    debugNarrationSession("play()", {
      bookId: this.manifest.bookId,
      chapterId: this.manifest.chapterId,
      voiceId: this.manifest.voiceId,
      chunkIndex: this.queue.getState().currentIndex,
      src: this.audio.src,
      currentTime: this.audio.currentTime,
      caller: "playIfCurrent",
      generation,
    });

    try {
      await this.audio.play();
    } catch {
      // ignore autoplay restrictions
    }
  }

  private async loadChunk(
    chunk: NarrationChunk,
    startAt = 0,
    shouldPlay = false
  ) {
    const generation = this.nextGeneration();
    const sourceChanged =
      this.audio.src !== this.toAbsoluteUrl(chunk.audioUrl);

    if (sourceChanged) {
      this.audio.pause();
      debugNarrationSession("audio.src=", {
        bookId: this.manifest.bookId,
        chapterId: this.manifest.chapterId,
        voiceId: this.manifest.voiceId,
        chunkIndex: chunk.index,
        src: chunk.audioUrl,
        startAt,
        shouldPlay,
      });
      this.audio.src = chunk.audioUrl;
      this.audio.preload = "auto";

      await new Promise<void>((resolve) => {
        const cleanup = () => {
          this.audio.removeEventListener("loadedmetadata", handleReady);
          this.audio.removeEventListener("error", handleError);
        };

        const handleReady = () => {
          cleanup();
          resolve();
        };

        const handleError = () => {
          cleanup();
          resolve();
        };

        this.audio.addEventListener("loadedmetadata", handleReady, {
          once: true,
        });

        this.audio.addEventListener("error", handleError, {
          once: true,
        });

        this.audio.load();
      });
    }

    if (generation !== this.loadGeneration) {
      return;
    }

    await this.applyPlaybackTime(startAt);

    if (shouldPlay) {
      await this.playIfCurrent(generation);
    }
  }

  private getChunkDuration(chunk: NarrationChunk) {
    const possibleDuration =
      "duration" in chunk && typeof chunk.duration === "number"
        ? chunk.duration
        : "durationSeconds" in chunk &&
            typeof chunk.durationSeconds === "number"
          ? chunk.durationSeconds
          : 0;

    if (Number.isFinite(possibleDuration) && possibleDuration > 0) {
      return possibleDuration;
    }

    if (
      this.activeChunk?.audioUrl === chunk.audioUrl &&
      Number.isFinite(this.audio.duration) &&
      this.audio.duration > 0
    ) {
      return this.audio.duration;
    }

    return 0;
  }

  private toAbsoluteUrl(url: string) {
    if (typeof window === "undefined") {
      return url;
    }

    return new URL(url, window.location.origin).href;
  }
}
