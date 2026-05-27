import {
  playbackDiagnosticsEngine,
} from "./playbackDiagnosticsEngine";

import {
  playbackFailoverEngine,
} from "./playbackFailoverEngine";

import {
  adaptiveBufferingEngine,
} from "./adaptiveBufferingEngine";

import {
  playbackTelemetryEngine,
} from "./playbackTelemetryEngine";

type ResilienceState = {
  lastEvaluationAt: number | null;

  lastRecoveryAt: number | null;

  activeStrategy:
    | "stable"
    | "adaptive"
    | "recovery";

  totalRecoveries: number;
};

class PlaybackResilienceCoordinator {
  private state: ResilienceState = {
    lastEvaluationAt: null,

    lastRecoveryAt: null,

    activeStrategy: "stable",

    totalRecoveries: 0,
  };

  async evaluate() {
    this.state.lastEvaluationAt =
      Date.now();

    const diagnostics =
      playbackDiagnosticsEngine.runDiagnostics();

    playbackTelemetryEngine.captureSnapshot();

    adaptiveBufferingEngine.evaluate();

    if (
      diagnostics.status ===
      "critical"
    ) {
      this.state.activeStrategy =
        "recovery";

      const recovered =
        await playbackFailoverEngine.attemptRecovery();

      if (recovered) {
        this.state.totalRecoveries +=
          1;

        this.state.lastRecoveryAt =
          Date.now();
      }

      return {
        diagnostics,
        recovered,
      };
    }

    if (
      diagnostics.status ===
      "warning"
    ) {
      this.state.activeStrategy =
        "adaptive";

      return {
        diagnostics,
        recovered: false,
      };
    }

    this.state.activeStrategy =
      "stable";

    return {
      diagnostics,
      recovered: false,
    };
  }

  getState() {
    return this.state;
  }

  getCurrentStrategy() {
    return this.state
      .activeStrategy;
  }

  isRecoveryMode() {
    return (
      this.state
        .activeStrategy ===
      "recovery"
    );
  }
}

export const playbackResilienceCoordinator =
  new PlaybackResilienceCoordinator();