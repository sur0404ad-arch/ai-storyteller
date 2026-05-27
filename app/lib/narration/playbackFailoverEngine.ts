import {
  playbackCoordinator,
} from "./playbackCoordinator";

import {
  playbackHealthMonitor,
} from "./playbackHealthMonitor";

import {
  playbackEventBus,
} from "./playbackEventBus";

type FailoverState = {
  lastRecoveryAt: number | null;

  totalRecoveries: number;

  isRecovering: boolean;
};

class PlaybackFailoverEngine {
  private state: FailoverState = {
    lastRecoveryAt: null,

    totalRecoveries: 0,

    isRecovering: false,
  };

  async attemptRecovery() {
    if (this.state.isRecovering) {
      return false;
    }

    this.state.isRecovering = true;

    try {
      const report =
        playbackHealthMonitor.getHealthReport();

      if (
        report.healthScore >= 80
      ) {
        return true;
      }

      playbackEventBus.emit(
        "buffering",
        {
          reason:
            "health-recovery",
        }
      );

      playbackCoordinator.pause();

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      await playbackCoordinator.resume();

      this.state.lastRecoveryAt =
        Date.now();

      this.state.totalRecoveries +=
        1;

      return true;
    } catch (error) {
      console.error(error);

      return false;
    } finally {
      this.state.isRecovering =
        false;
    }
  }

  getState() {
    return this.state;
  }

  shouldRecover() {
    const report =
      playbackHealthMonitor.getHealthReport();

    return (
      report.healthScore < 60
    );
  }

  async monitor() {
    if (
      this.shouldRecover()
    ) {
      await this.attemptRecovery();
    }
  }
}

export const playbackFailoverEngine =
  new PlaybackFailoverEngine();