import {
  playbackHealthMonitor,
} from "./playbackHealthMonitor";

type BufferingStrategy =
  | "aggressive"
  | "balanced"
  | "light";

type AdaptiveBufferState = {
  strategy: BufferingStrategy;

  targetPrebufferChunks: number;

  maxConcurrentPreloads: number;

  updatedAt: number;
};

class AdaptiveBufferingEngine {
  private state: AdaptiveBufferState =
    {
      strategy: "balanced",

      targetPrebufferChunks: 2,

      maxConcurrentPreloads: 2,

      updatedAt: Date.now(),
    };

  evaluate() {
    const health =
      playbackHealthMonitor.getHealthReport();

    if (
      health.totalBufferingEvents >= 5
    ) {
      this.state = {
        strategy: "aggressive",

        targetPrebufferChunks: 5,

        maxConcurrentPreloads: 4,

        updatedAt: Date.now(),
      };

      return this.state;
    }

    if (
      health.totalBufferingEvents >= 2
    ) {
      this.state = {
        strategy: "balanced",

        targetPrebufferChunks: 3,

        maxConcurrentPreloads: 3,

        updatedAt: Date.now(),
      };

      return this.state;
    }

    this.state = {
      strategy: "light",

      targetPrebufferChunks: 2,

      maxConcurrentPreloads: 2,

      updatedAt: Date.now(),
    };

    return this.state;
  }

  getState() {
    return this.state;
  }

  getStrategy() {
    return this.state.strategy;
  }

  getTargetPrebufferChunks() {
    return this.state
      .targetPrebufferChunks;
  }

  getConcurrentLimit() {
    return this.state
      .maxConcurrentPreloads;
  }
}

export const adaptiveBufferingEngine =
  new AdaptiveBufferingEngine();