import {
  playbackMetrics,
} from "./playbackMetrics";

import {
  playbackHealthMonitor,
} from "./playbackHealthMonitor";

import {
  playbackStateStore,
} from "./playbackStateStore";

type TelemetrySnapshot = {
  timestamp: number;

  metrics: ReturnType<
    typeof playbackMetrics.getMetrics
  >;

  health: ReturnType<
    typeof playbackHealthMonitor.getHealthReport
  >;

  playbackState: ReturnType<
    typeof playbackStateStore.getState
  >;
};

class PlaybackTelemetryEngine {
  private snapshots:
    TelemetrySnapshot[] = [];

  private maxSnapshots = 100;

  captureSnapshot() {
    const snapshot: TelemetrySnapshot =
      {
        timestamp: Date.now(),

        metrics:
          playbackMetrics.getMetrics(),

        health:
          playbackHealthMonitor.getHealthReport(),

        playbackState:
          playbackStateStore.getState(),
      };

    this.snapshots.push(snapshot);

    if (
      this.snapshots.length >
      this.maxSnapshots
    ) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  getSnapshots() {
    return this.snapshots;
  }

  getLatestSnapshot() {
    return (
      this.snapshots[
        this.snapshots.length - 1
      ] || null
    );
  }

  clear() {
    this.snapshots = [];
  }

  getPlaybackAnalytics() {
    const latest =
      this.getLatestSnapshot();

    return {
      totalSnapshots:
        this.snapshots.length,

      latestHealthScore:
        latest?.health
          .healthScore || 0,

      totalBufferingEvents:
        latest?.metrics
          .totalBufferingEvents || 0,

      totalVoiceSwitches:
        latest?.metrics
          .totalVoiceSwitches || 0,

      totalChunkTransitions:
        latest?.metrics
          .totalChunkTransitions || 0,

      averageChunkPlaybackTime:
        latest?.metrics
          .averageChunkPlaybackTime || 0,
    };
  }
}

export const playbackTelemetryEngine =
  new PlaybackTelemetryEngine();