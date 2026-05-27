import {
  playbackFailoverEngine,
} from "./playbackFailoverEngine";

import {
  playbackHealthMonitor,
} from "./playbackHealthMonitor";

type WatchdogState = {
  started: boolean;

  intervalId: number | null;

  lastCheckAt: number | null;
};

class PlaybackWatchdog {
  private state: WatchdogState = {
    started: false,

    intervalId: null,

    lastCheckAt: null,
  };

  start() {
    if (this.state.started) {
      return;
    }

    this.state.started = true;

    this.state.intervalId =
      window.setInterval(
        async () => {
          this.state.lastCheckAt =
            Date.now();

          const report =
            playbackHealthMonitor.getHealthReport();

          if (
            report.healthScore < 60
          ) {
            await playbackFailoverEngine.monitor();
          }
        },
        3000
      );
  }

  stop() {
    if (
      this.state.intervalId !== null
    ) {
      clearInterval(
        this.state.intervalId
      );
    }

    this.state.started = false;

    this.state.intervalId = null;
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

export const playbackWatchdog =
  new PlaybackWatchdog();