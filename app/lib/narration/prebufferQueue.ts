import {
  ChapterNarrationManifest,
  NarrationChunk,
} from "./narrationManifest";

type QueueState = {
  currentIndex: number;
  bufferedIndexes: number[];
  activeChunk: NarrationChunk | null;
};

export class PrebufferQueue {
  private manifest: ChapterNarrationManifest;

  private state: QueueState = {
    currentIndex: 0,
    bufferedIndexes: [],
    activeChunk: null,
  };

  constructor(manifest: ChapterNarrationManifest) {
    this.manifest = manifest;
  }

  getCurrentChunk() {
    return (
      this.manifest.chunks[this.state.currentIndex] || null
    );
  }

  getNextChunk() {
    return (
      this.manifest.chunks[this.state.currentIndex + 1] ||
      null
    );
  }

  setCurrentIndex(index: number) {
    this.state.currentIndex = Math.max(0, index);

    this.state.activeChunk =
      this.manifest.chunks[this.state.currentIndex] ||
      null;
  }

  markBuffered(index: number) {
    if (
      !this.state.bufferedIndexes.includes(index)
    ) {
      this.state.bufferedIndexes.push(index);
    }
  }

  isBuffered(index: number) {
    return this.state.bufferedIndexes.includes(index);
  }

  preloadCurrentAndNext() {
    const current =
      this.manifest.chunks[this.state.currentIndex];

    const next =
      this.manifest.chunks[this.state.currentIndex + 1];

    if (current) {
      this.markBuffered(current.index);
    }

    if (next) {
      this.markBuffered(next.index);
    }

    return {
      current,
      next,
    };
  }

  moveNext() {
    const nextIndex =
      this.state.currentIndex + 1;

    if (!this.manifest.chunks[nextIndex]) {
      return null;
    }

    this.state.currentIndex = nextIndex;

    this.state.activeChunk =
      this.manifest.chunks[nextIndex];

    return this.state.activeChunk;
  }

  getBufferedChunks() {
    return this.state.bufferedIndexes.map(
      (index) => this.manifest.chunks[index]
    );
  }

  getState() {
    return {
      currentIndex: this.state.currentIndex,
      bufferedIndexes:
        this.state.bufferedIndexes,
      activeChunk:
        this.state.activeChunk,
    };
  }
}