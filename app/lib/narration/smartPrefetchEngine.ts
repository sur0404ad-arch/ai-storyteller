import {
  NarrationVoiceId,
} from "./narrationManifest";

import {
  backgroundPreloader,
} from "./backgroundPreloader";

type SmartPrefetchParams = {
  currentBookId: string;

  currentChapterId: number;

  nextChapterId?: number;

  title: string;

  currentTexts: string[];

  nextTexts?: string[];

  voices: NarrationVoiceId[];
};

class SmartPrefetchEngine {
  private active =
    new Set<string>();

  private buildKey(
    bookId: string,
    chapterId: number
  ) {
    return `${bookId}-${chapterId}`;
  }

  async prefetchCurrentChapter(
    params: SmartPrefetchParams
  ) {
    const key =
      this.buildKey(
        params.currentBookId,
        params.currentChapterId
      );

    if (this.active.has(key)) {
      return;
    }

    this.active.add(key);

    try {
      await backgroundPreloader.preloadChapter(
        {
          bookId:
            params.currentBookId,

          chapterId:
            params.currentChapterId,

          title:
            params.title,

          texts:
            params.currentTexts,

          voices:
            params.voices,
        }
      );
    } finally {
      this.active.delete(key);
    }
  }

  async prefetchNextChapter(
    params: SmartPrefetchParams
  ) {
    if (
      !params.nextChapterId ||
      !params.nextTexts?.length
    ) {
      return;
    }

    const key =
      this.buildKey(
        params.currentBookId,
        params.nextChapterId
      );

    if (this.active.has(key)) {
      return;
    }

    this.active.add(key);

    try {
      await backgroundPreloader.preloadChapter(
        {
          bookId:
            params.currentBookId,

          chapterId:
            params.nextChapterId,

          title:
            params.title,

          texts:
            params.nextTexts,

          voices:
            params.voices,
        }
      );
    } finally {
      this.active.delete(key);
    }
  }

  isPrefetching(
    bookId: string,
    chapterId: number
  ) {
    return this.active.has(
      this.buildKey(
        bookId,
        chapterId
      )
    );
  }

  getActivePrefetches() {
    return Array.from(
      this.active
    );
  }

  clear() {
    this.active.clear();
  }
}

export const smartPrefetchEngine =
  new SmartPrefetchEngine();