import {
  ChapterNarrationManifest,
} from "./narrationManifest";

type CachedManifest = {
  manifest: ChapterNarrationManifest;
  cachedAt: number;
};

class NarrationCache {
  private manifests =
    new Map<string, CachedManifest>();

  private buildKey(
    bookId: string,
    chapterId: number,
    voiceId: string
  ) {
    return `${bookId}-${chapterId}-${voiceId}`;
  }

  setManifest(
    manifest: ChapterNarrationManifest
  ) {
    const key = this.buildKey(
      manifest.bookId,
      manifest.chapterId,
      manifest.voiceId
    );

    this.manifests.set(key, {
      manifest,
      cachedAt: Date.now(),
    });

    return manifest;
  }

  getManifest(params: {
    bookId: string;
    chapterId: number;
    voiceId: string;
  }) {
    const key = this.buildKey(
      params.bookId,
      params.chapterId,
      params.voiceId
    );

    return (
      this.manifests.get(key)?.manifest ||
      null
    );
  }

  hasManifest(params: {
    bookId: string;
    chapterId: number;
    voiceId: string;
  }) {
    const key = this.buildKey(
      params.bookId,
      params.chapterId,
      params.voiceId
    );

    return this.manifests.has(key);
  }

  removeManifest(params: {
    bookId: string;
    chapterId: number;
    voiceId: string;
  }) {
    const key = this.buildKey(
      params.bookId,
      params.chapterId,
      params.voiceId
    );

    this.manifests.delete(key);
  }

  clear() {
    this.manifests.clear();
  }

  getStats() {
    return {
      total:
        this.manifests.size,

      manifests: Array.from(
        this.manifests.entries()
      ).map(([key, value]) => ({
        key,
        chunkCount:
          value.manifest.chunks.length,
        cachedAt:
          value.cachedAt,
      })),
    };
  }
}

export const narrationCache =
  new NarrationCache();