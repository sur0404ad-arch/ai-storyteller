type PlaybackEvent =
  | "play"
  | "pause"
  | "resume"
  | "seek"
  | "chunkchange"
  | "voicechange"
  | "ratechange"
  | "ended"
  | "buffering";

type PlaybackEventPayload = {
  type: PlaybackEvent;

  payload?: Record<string, unknown>;

  createdAt: number;
};

type PlaybackListener = (
  event: PlaybackEventPayload
) => void;

class PlaybackEventBus {
  private listeners =
    new Map<
      PlaybackEvent,
      Set<PlaybackListener>
    >();

  on(
    event: PlaybackEvent,
    listener: PlaybackListener
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(
        event,
        new Set()
      );
    }

    this.listeners
      .get(event)
      ?.add(listener);

    return () => {
      this.off(event, listener);
    };
  }

  off(
    event: PlaybackEvent,
    listener: PlaybackListener
  ) {
    this.listeners
      .get(event)
      ?.delete(listener);
  }

  emit(
    event: PlaybackEvent,
    payload?: Record<string, unknown>
  ) {
    const listeners =
      this.listeners.get(event);

    if (!listeners?.size) {
      return;
    }

    const eventPayload: PlaybackEventPayload =
      {
        type: event,
        payload,
        createdAt: Date.now(),
      };

    listeners.forEach((listener) => {
      listener(eventPayload);
    });
  }

  clear() {
    this.listeners.clear();
  }

  listenerCount(
    event: PlaybackEvent
  ) {
    return (
      this.listeners.get(event)
        ?.size || 0
    );
  }
}

export const playbackEventBus =
  new PlaybackEventBus();