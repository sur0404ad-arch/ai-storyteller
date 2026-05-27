import {
  continueListeningEngine,
} from "./continueListeningEngine";

import {
  playbackCoordinator,
} from "./playbackCoordinator";

import {
  NarrationVoiceId,
} from "./narrationManifest";

type RestoreSessionParams = {
  title: string;

  texts: string[];
};

class SessionRecoveryEngine {
  async restore(
    params: RestoreSessionParams
  ) {
    const saved =
      continueListeningEngine.load();

    if (!saved) {
      return null;
    }

    const session =
      await playbackCoordinator.start(
        {
          bookId:
            saved.bookId,

          chapterId:
            saved.chapterId,

          title:
            params.title,

          texts:
            params.texts,

          voiceId:
            saved.voiceId as NarrationVoiceId,
        },
        {
          autoplay: false,
        }
      );

    if (!session) {
      return null;
    }

    await playbackCoordinator.seek(saved.currentTime, {
      shouldPlay: true,
    });

    return {
      session,
      restored: true,
      currentTime:
        saved.currentTime,

      chunkIndex:
        saved.chunkIndex,

      voiceId:
        saved.voiceId,
    };
  }

  hasRecoverySession() {
    return (
      continueListeningEngine.hasSavedProgress()
    );
  }

  clearRecoverySession() {
    continueListeningEngine.clear();
  }
}

export const sessionRecoveryEngine =
  new SessionRecoveryEngine();