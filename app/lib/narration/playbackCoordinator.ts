import {
  NarrationVoiceId,
} from "./narrationManifest";

import {
  playbackOrchestrator,
} from "./playbackOrchestrator";

import {
  continueListeningEngine,
} from "./continueListeningEngine";

import {
  playbackStateStore,
} from "./playbackStateStore";

import {
  playbackEventBus,
} from "./playbackEventBus";

type StartPlaybackParams = {
  bookId: string;

  chapterId: number;

  title: string;

  texts: string[];

  voiceId: NarrationVoiceId;
};

class PlaybackCoordinator {
  async start(
    params: StartPlaybackParams,
    options?: {
      autoplay?: boolean;
    }
  ) {
    playbackEventBus.emit(
      "buffering"
    );

    const shouldAutoplay = options?.autoplay !== false;

    const session =
      await playbackOrchestrator.prepareAndStartPlayback(
        {
          bookId:
            params.bookId,

          chapterId:
            params.chapterId,

          title:
            params.title,

          texts:
            params.texts,

          voiceId:
            params.voiceId,
        },
        {
          autoplay: shouldAutoplay,
        }
      );

    if (!session) {
      return null;
    }

    playbackStateStore.setState({
      bookId:
        params.bookId,

      chapterId:
        params.chapterId,

      voiceId:
        params.voiceId,

      currentChunkIndex: 0,

      currentTime: 0,

      duration: 0,

      playbackRate: 1,

      isPlaying: shouldAutoplay,

      updatedAt:
        Date.now(),
    });

    if (shouldAutoplay) {
      playbackEventBus.emit(
        "play",
        {
          bookId:
            params.bookId,

          chapterId:
            params.chapterId,
        }
      );
    }

    return session;
  }

  pause() {
    playbackOrchestrator.pause();

    playbackStateStore.patchState({
      isPlaying: false,
    });

    playbackEventBus.emit(
      "pause"
    );
  }

  async resume() {
    await playbackOrchestrator.resume();

    playbackStateStore.patchState({
      isPlaying: true,
    });

    playbackEventBus.emit(
      "resume"
    );
  }

  async seek(
    time: number,
    options?: {
      shouldPlay?: boolean;
    }
  ) {
    await playbackOrchestrator.seek(time, options);

    playbackStateStore.patchState({
      currentTime:
        time,
      ...(options?.shouldPlay
        ? { isPlaying: true }
        : {}),
    });

    playbackEventBus.emit(
      "seek",
      {
        currentTime:
          time,
      }
    );

    if (options?.shouldPlay) {
      playbackEventBus.emit("resume");
    }
  }

  async switchVoice(params: {
    bookId: string;

    chapterId: number;

    title: string;

    texts: string[];

    voiceId: NarrationVoiceId;
  }) {
    const state =
      playbackStateStore.getState();

    const currentTime =
      state?.currentTime || 0;

    await playbackOrchestrator.switchVoice(
      {
        bookId:
          params.bookId,

        chapterId:
          params.chapterId,

        title:
          params.title,

        texts:
          params.texts,

        voiceId:
          params.voiceId,

        currentTime,

        shouldPlay: state?.isPlaying ?? false,
      }
    );

    playbackStateStore.patchState({
      voiceId:
        params.voiceId,
    });

    playbackEventBus.emit(
      "voicechange",
      {
        voiceId:
          params.voiceId,
      }
    );
  }

  setPlaybackRate(
    playbackRate: number
  ) {
    playbackOrchestrator.setPlaybackRate(
      playbackRate
    );

    playbackStateStore.patchState({
      playbackRate,
    });

    playbackEventBus.emit(
      "ratechange",
      {
        playbackRate,
      }
    );
  }

  saveProgress() {
    const state =
      playbackStateStore.getState();

    if (!state) {
      return;
    }

    continueListeningEngine.save(
      {
        bookId:
          state.bookId,

        chapterId:
          state.chapterId,

        voiceId:
          state.voiceId,

        chunkIndex:
          state.currentChunkIndex,

        currentTime:
          state.currentTime,

        duration:
          state.duration,

        updatedAt:
          Date.now(),
      }
    );
  }

  destroy() {
    playbackOrchestrator.destroy();

    playbackStateStore.clear();

    playbackEventBus.emit(
      "ended"
    );
  }
}

export const playbackCoordinator =
  new PlaybackCoordinator();