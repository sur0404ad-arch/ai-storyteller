import {
  playbackMetrics,
} from "./playbackMetrics";

import {
  playbackStateStore,
} from "./playbackStateStore";

import {
  playbackSessionManager,
} from "./playbackSessionManager";

type PlaybackHealthReport = {
  hasSession: boolean;

  hasAudio: boolean;

  isPlaying: boolean;

  playbackRate: number;

  currentTime: number;

  duration: number;

  totalBufferingEvents: number;

  totalVoiceSwitches: number;

  totalChunkTransitions: number;

  healthScore: number;
};

class PlaybackHealthMonitor {
  getHealthReport(): PlaybackHealthReport {
    const session =
      playbackSessionManager.getSession();

    const audio =
      playbackSessionManager.getAudio();

    const state =
      playbackStateStore.getState();

    const metrics =
      playbackMetrics.getMetrics();

    const bufferingPenalty =
      metrics.totalBufferingEvents * 5;

    const healthScore =
      Math.max(
        0,
        100 - bufferingPenalty
      );

    return {
      hasSession:
        Boolean(session),

      hasAudio:
        Boolean(audio),

      isPlaying:
        state?.isPlaying || false,

      playbackRate:
        state?.playbackRate || 1,

      currentTime:
        state?.currentTime || 0,

      duration:
        state?.duration || 0,

      totalBufferingEvents:
        metrics.totalBufferingEvents,

      totalVoiceSwitches:
        metrics.totalVoiceSwitches,

      totalChunkTransitions:
        metrics.totalChunkTransitions,

      healthScore,
    };
  }

  isHealthy() {
    return (
      this.getHealthReport()
        .healthScore >= 80
    );
  }

  logHealthReport() {
    console.table(
      this.getHealthReport()
    );
  }
}

export const playbackHealthMonitor =
  new PlaybackHealthMonitor();