import {
  NarrationVoiceId,
} from "./narrationManifest";

import {
  narrationPreparationService,
} from "./narrationPreparationService";

type BackgroundPreloadParams = {
  bookId: string;
  chapterId: number;
  title: string;
  texts: string[];
  voices: NarrationVoiceId[];
};

class BackgroundPreloader {
  private activePreloads =
    new Set<string>();

  private buildKey(
    bookId: string,
    chapterId: number
  ) {
    return `${bookId}-${chapterId}`;
  }

  async preloadChapter(
    params: BackgroundPreloadParams
  ) {
    const key = this.buildKey(
      params.bookId,
      params.chapterId
    );

    if (this.activePreloads.has(key)) {
      return;
    }

    this.activePreloads.add(key);

    try {
      await narrationPreparationService.prepareChapter(
        {
          bookId: params.bookId,
          chapterId: params.chapterId,
          title: params.title,
          texts: params.texts,
          voices: params.voices,
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.activePreloads.delete(key);
    }
  }

  isPreloading(
    bookId: string,
    chapterId: number
  ) {
    return this.activePreloads.has(
      this.buildKey(
        bookId,
        chapterId
      )
    );
  }

  getActivePreloads() {
    return Array.from(
      this.activePreloads
    );
  }
}

export const backgroundPreloader =
  new BackgroundPreloader();