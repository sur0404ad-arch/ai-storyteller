import {
  playbackResilienceCoordinator,
} from "./playbackResilienceCoordinator";

import {
  playbackWatchdog,
} from "./playbackWatchdog";

import {
  playbackTelemetryEngine,
} from "./playbackTelemetryEngine";

type RuntimeSupervisorState = {
  started: boolean;

  startedAt: number | null;

  evaluationIntervalId: number | null;

  totalEvaluations: number;
};

class PlaybackRuntimeSupervisor {
  private state: RuntimeSupervisorState =
    {
      started: false,

      startedAt: null,

      evaluationIntervalId: null,

      totalEvaluations: 0,
    };

  start() {
    if (this.state.started) {
      return;
    }

    this.state.started = true;

    this.state.startedAt =
      Date.now();

    playbackWatchdog.start();

    this.state.evaluationIntervalId =
      window.setInterval(
        async () => {
          this.state
            .totalEvaluations += 1;

          playbackTelemetryEngine.captureSnapshot();

          await playbackResilienceCoordinator.evaluate();
        },
        5000
      );
  }

  stop() {
    playbackWatchdog.stop();

    if (
      this.state
        .evaluationIntervalId !==
      null
    ) {
      clearInterval(
        this.state
          .evaluationIntervalId
      );
    }

    this.state.started = false;

    this.state.startedAt = null;

    this.state.evaluationIntervalId =
      null;
  }

  restart() {
    this.stop();

    this.start();
  }

  getState() {
    return {
      ...this.state,
    };
  }

  isRunning() {
    return this.state.started;
  }
}

export const playbackRuntimeSupervisor =
  new PlaybackRuntimeSupervisor();