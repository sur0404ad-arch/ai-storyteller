import {
  playbackCoordinator,
} from "./playbackCoordinator";

import {
  playbackEventBus,
} from "./playbackEventBus";

import {
  playbackMetrics,
} from "./playbackMetrics";

class PlaybackLifecycleController {
  private initialized =
    false;

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    playbackEventBus.on(
      "play",
      () => {
        playbackMetrics.startSession();
      }
    );

    playbackEventBus.on(
      "pause",
      () => {
        playbackMetrics.stopSession();

        playbackCoordinator.saveProgress();
      }
    );

    playbackEventBus.on(
      "voicechange",
      () => {
        playbackMetrics.trackVoiceSwitch();
      }
    );

    playbackEventBus.on(
      "buffering",
      () => {
        playbackMetrics.trackBufferingStart();
      }
    );

    playbackEventBus.on(
      "chunkchange",
      (event) => {
        const playbackTime =
          Number(
            event.payload
              ?.playbackTime || 0
          );

        playbackMetrics.trackChunkTransition(
          playbackTime
        );
      }
    );

    playbackEventBus.on(
      "ended",
      () => {
        playbackMetrics.stopSession();

        playbackCoordinator.saveProgress();
      }
    );
  }

  destroy() {
    playbackCoordinator.destroy();

    this.initialized = false;
  }

  getMetrics() {
    return playbackMetrics.getMetrics();
  }
}

export const playbackLifecycleController =
  new PlaybackLifecycleController();