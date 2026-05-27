import {
  NarrationVoiceId,
} from "./narrationManifest";

import {
  narrationPreparationService,
} from "./narrationPreparationService";

import {
  playbackSessionManager,
} from "./playbackSessionManager";

type StartPlaybackParams = {
  bookId: string;
  chapterId: number;
  title: string;
  texts: string[];
  voiceId: NarrationVoiceId;
};

class PlaybackOrchestrator {
  async prepareAndStartPlayback(
    params: StartPlaybackParams,
    options?: {
      autoplay?: boolean;
    }
  ) {
    let manifest =
      narrationPreparationService.getPreparedManifest(
        {
          bookId: params.bookId,
          chapterId: params.chapterId,
          voiceId: params.voiceId,
        }
      );

    if (!manifest) {
      const prepared =
        await narrationPreparationService.prepareChapter(
          {
            bookId: params.bookId,
            chapterId: params.chapterId,
            title: params.title,
            texts: params.texts,
            voices: [params.voiceId],
          }
        );

      manifest =
        prepared?.[0] || null;
    }

    if (!manifest) {
      return null;
    }

    const session =
      await playbackSessionManager.createSession(
        manifest
      );

    if (options?.autoplay !== false) {
      await playbackSessionManager.play();
    }

    return session;
  }

  async switchVoice(params: {
    bookId: string;
    chapterId: number;
    title: string;
    texts: string[];
    voiceId: NarrationVoiceId;
    currentTime: number;
    shouldPlay?: boolean;
  }) {
    let manifest =
      narrationPreparationService.getPreparedManifest(
        {
          bookId: params.bookId,
          chapterId: params.chapterId,
          voiceId: params.voiceId,
        }
      );

    if (!manifest) {
      const prepared =
        await narrationPreparationService.prepareChapter(
          {
            bookId: params.bookId,
            chapterId: params.chapterId,
            title: params.title,
            texts: params.texts,
            voices: [params.voiceId],
          }
        );

      manifest =
        prepared?.[0] || null;
    }

    if (!manifest) {
      return null;
    }

    const session =
      await playbackSessionManager.createSession(
        manifest
      );

    await playbackSessionManager.seek(params.currentTime, {
      shouldPlay: params.shouldPlay ?? false,
    });

    return session;
  }

  pause() {
    playbackSessionManager.pause();
  }

  async resume() {
    await playbackSessionManager.resume();
  }

  async next() {
    return playbackSessionManager.next();
  }

  async seek(
    time: number,
    options?: {
      shouldPlay?: boolean;
    }
  ) {
    await playbackSessionManager.seek(time, options);
  }

  setPlaybackRate(rate: number) {
    playbackSessionManager.setPlaybackRate(
      rate
    );
  }

  destroy() {
    playbackSessionManager.destroy();
  }
}

export const playbackOrchestrator =
  new PlaybackOrchestrator();