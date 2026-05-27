type PlaybackMetricsState = {
  sessionStartedAt: number | null;

  totalPlayedSeconds: number;

  totalBufferingEvents: number;

  totalVoiceSwitches: number;

  totalChunkTransitions: number;

  averageChunkPlaybackTime: number;

  lastPlaybackStartAt: number | null;

  lastBufferingStartedAt: number | null;
};

class PlaybackMetrics {
  private state: PlaybackMetricsState = {
    sessionStartedAt: null,

    totalPlayedSeconds: 0,

    totalBufferingEvents: 0,

    totalVoiceSwitches: 0,

    totalChunkTransitions: 0,

    averageChunkPlaybackTime: 0,

    lastPlaybackStartAt: null,

    lastBufferingStartedAt: null,
  };

  startSession() {
    this.state.sessionStartedAt =
      Date.now();

    this.state.lastPlaybackStartAt =
      Date.now();
  }

  stopSession() {
    if (
      this.state.lastPlaybackStartAt
    ) {
      const delta =
        (Date.now() -
          this.state
            .lastPlaybackStartAt) /
        1000;

      this.state.totalPlayedSeconds +=
        delta;
    }

    this.state.lastPlaybackStartAt =
      null;
  }

  trackBufferingStart() {
    this.state.totalBufferingEvents +=
      1;

    this.state.lastBufferingStartedAt =
      Date.now();
  }

  trackVoiceSwitch() {
    this.state.totalVoiceSwitches +=
      1;
  }

  trackChunkTransition(
    playbackTime: number
  ) {
    this.state.totalChunkTransitions +=
      1;

    const total =
      this.state
        .totalChunkTransitions;

    this.state.averageChunkPlaybackTime =
      (this.state
        .averageChunkPlaybackTime *
        (total - 1) +
        playbackTime) /
      total;
  }

  getMetrics() {
    return {
      ...this.state,
    };
  }

  reset() {
    this.state = {
      sessionStartedAt: null,

      totalPlayedSeconds: 0,

      totalBufferingEvents: 0,

      totalVoiceSwitches: 0,

      totalChunkTransitions: 0,

      averageChunkPlaybackTime: 0,

      lastPlaybackStartAt: null,

      lastBufferingStartedAt: null,
    };
  }
}

export const playbackMetrics =
  new PlaybackMetrics();