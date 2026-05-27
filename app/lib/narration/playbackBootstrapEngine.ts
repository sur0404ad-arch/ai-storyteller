import {
  playbackRuntimeSupervisor,
} from "./playbackRuntimeSupervisor";

import {
  playbackLifecycleController,
} from "./playbackLifecycleController";

import {
  sessionRecoveryEngine,
} from "./sessionRecoveryEngine";

type BootstrapParams = {
  title: string;

  texts: string[];
};

class PlaybackBootstrapEngine {
  private initialized = false;

  async bootstrap(
    params: BootstrapParams
  ) {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    playbackLifecycleController.initialize();

    playbackRuntimeSupervisor.start();

    const hasRecovery =
      sessionRecoveryEngine.hasRecoverySession();

    if (!hasRecovery) {
      return;
    }

    try {
      await sessionRecoveryEngine.restore(
        {
          title:
            params.title,

          texts:
            params.texts,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  shutdown() {
    playbackRuntimeSupervisor.stop();

    playbackLifecycleController.destroy();

    this.initialized = false;
  }

  isInitialized() {
    return this.initialized;
  }
}

export const playbackBootstrapEngine =
  new PlaybackBootstrapEngine();