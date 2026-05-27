import {
  ChapterNarrationManifest,
  NarrationVoiceId,
} from "./narrationManifest";

type RegistryKey = string;

type RegistryRecord = {
  manifest: ChapterNarrationManifest;
  createdAt: number;
};

class PreparedAudioRegistry {
  private manifests =
    new Map<RegistryKey, RegistryRecord>();

  private buildKey(
    bookId: string,
    chapterId: number,
    voiceId: NarrationVoiceId
  ) {
    return `${bookId}-${chapterId}-${voiceId}`;
  }

  registerManifest(
    manifest: ChapterNarrationManifest
  ) {
    const key = this.buildKey(
      manifest.bookId,
      manifest.chapterId,
      manifest.voiceId
    );

    this.manifests.set(key, {
      manifest,
      createdAt: Date.now(),
    });

    return manifest;
  }

  getManifest(params: {
    bookId: string;
    chapterId: number;
    voiceId: NarrationVoiceId;
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
    voiceId: NarrationVoiceId;
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
    voiceId: NarrationVoiceId;
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

  getAll() {
    return Array.from(
      this.manifests.values()
    ).map((item) => item.manifest);
  }

  getStats() {
    return {
      totalPreparedManifests:
        this.manifests.size,

      manifests: Array.from(
        this.manifests.entries()
      ).map(([key, value]) => ({
        key,
        createdAt: value.createdAt,
        chunkCount:
          value.manifest.chunks.length,
      })),
    };
  }
}

export const preparedAudioRegistry =
  new PreparedAudioRegistry();