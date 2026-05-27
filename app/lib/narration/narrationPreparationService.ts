import {
  buildNarrationManifest,
} from "./buildNarrationManifest";

import {
  preparedAudioRegistry,
} from "./preparedAudioRegistry";

import {
  NarrationVoiceId,
} from "./narrationManifest";

type PrepareNarrationParams = {
  bookId: string;
  chapterId: number;
  title: string;
  texts: string[];
  voices: NarrationVoiceId[];
};

class NarrationPreparationService {
  private preparing =
    new Set<string>();

  private buildPreparationKey(
    bookId: string,
    chapterId: number,
    voiceId: NarrationVoiceId
  ) {
    return `${bookId}-${chapterId}-${voiceId}`;
  }

  async prepareVoiceManifest(params: {
    bookId: string;
    chapterId: number;
    title: string;
    texts: string[];
    voiceId: NarrationVoiceId;
  }) {
    const key =
      this.buildPreparationKey(
        params.bookId,
        params.chapterId,
        params.voiceId
      );

    if (this.preparing.has(key)) {
      return;
    }

    this.preparing.add(key);

    try {
      const manifest =
        await buildNarrationManifest({
          bookId: params.bookId,
          chapterId: params.chapterId,
          title: params.title,
          voiceId: params.voiceId,
          texts: params.texts,
        });

      preparedAudioRegistry.registerManifest(
        manifest
      );

      return manifest;
    } finally {
      this.preparing.delete(key);
    }
  }

  async prepareChapter(
    params: PrepareNarrationParams
  ) {
    const manifests = [];

    for (const voiceId of params.voices) {
      const manifest =
        await this.prepareVoiceManifest({
          bookId: params.bookId,
          chapterId: params.chapterId,
          title: params.title,
          texts: params.texts,
          voiceId,
        });

      if (manifest) {
        manifests.push(manifest);
      }
    }

    return manifests;
  }

  isPreparing(params: {
    bookId: string;
    chapterId: number;
    voiceId: NarrationVoiceId;
  }) {
    const key =
      this.buildPreparationKey(
        params.bookId,
        params.chapterId,
        params.voiceId
      );

    return this.preparing.has(key);
  }

  getPreparedManifest(params: {
    bookId: string;
    chapterId: number;
    voiceId: NarrationVoiceId;
  }) {
    return preparedAudioRegistry.getManifest(
      params
    );
  }
}

export const narrationPreparationService =
  new NarrationPreparationService();