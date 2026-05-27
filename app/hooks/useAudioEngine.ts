"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { registerGlobalAudio } from "../lib/audio/audioController";

const CURRENT_TIME_DIAG = true;

function diagStack(skip = 2) {
  return new Error()
    .stack?.split("\n")
    .slice(skip, skip + 4)
    .map((line) => line.trim())
    .join(" | ") ?? "stack-unavailable";
}

function diagLog(
  kind: string,
  source: string,
  previousTime: number,
  newTime: number,
  extra?: Record<string, unknown>
) {
  if (!CURRENT_TIME_DIAG) {
    return;
  }

  console.log("[currentTime-diag]", {
    kind,
    source,
    previousTime,
    newTime,
    timestamp: Date.now(),
    perfMs: Math.round(performance.now()),
    stack: diagStack(3),
    ...extra,
  });
}

function clampPlaybackTime(time: number, duration: number) {
  if (!Number.isFinite(time) || time <= 0) {
    return 0;
  }

  if (duration > 0) {
    return Math.min(Math.max(0, time), duration);
  }

  return Math.max(0, time);
}

function assignAudioCurrentTime(
  audio: HTMLAudioElement,
  newTime: number,
  source: string,
  extra?: Record<string, unknown>
) {
  const previousTime = Number.isFinite(audio.currentTime)
    ? audio.currentTime
    : 0;

  diagLog("currentTime-write", source, previousTime, newTime, extra);
  audio.currentTime = newTime;

  return previousTime;
}

function waitForAudioSeeked(
  audio: HTMLAudioElement,
  targetTime: number,
  source: string
) {
  const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
  const safeTarget = clampPlaybackTime(targetTime, safeDuration);

  diagLog(
    "waitForAudioSeeked:enter",
    source,
    audio.currentTime,
    safeTarget,
    {
      paused: audio.paused,
      readyState: audio.readyState,
    }
  );

  return new Promise<void>((resolve) => {
    const epsilon = 0.25;

    if (
      audio.readyState >= 1 &&
      Math.abs(audio.currentTime - safeTarget) < epsilon
    ) {
      diagLog(
        "waitForAudioSeeked:skip-write",
        source,
        audio.currentTime,
        safeTarget,
        { reason: "already-at-target" }
      );
      resolve();
      return;
    }

    const timeout = window.setTimeout(() => {
      cleanup();
      diagLog(
        "waitForAudioSeeked:timeout",
        source,
        audio.currentTime,
        safeTarget,
        {}
      );
      resolve();
    }, 3000);

    const onSeeked = () => {
      cleanup();
      diagLog(
        "seeked-event",
        `${source}:waitForAudioSeeked`,
        safeTarget,
        audio.currentTime,
        { paused: audio.paused }
      );
      resolve();
    };

    const cleanup = () => {
      clearTimeout(timeout);
      audio.removeEventListener("seeked", onSeeked);
    };

    audio.addEventListener("seeked", onSeeked, { once: true });
    assignAudioCurrentTime(audio, safeTarget, `${source}:waitForAudioSeeked`);
  });
}

export function useAudioEngine(initialSource = "") {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sourceRef = useRef("");
  const playbackRateRef = useRef(1);
  const loadGenerationRef = useRef(0);

  const lastTimeUpdateRef = useRef(0);
  const lastTimeUpdateLogRef = useRef(0);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [playbackRate, setPlaybackRateState] = useState(1);

  useEffect(() => {
    if (audioRef.current) return;

    const audio = new Audio();
    audio.dataset.playbackId = `useAudioEngine-${Date.now()}`;

    diagLog("HTMLAudioElement:created", "mount-effect", 0, 0, {
      elementId: audio.dataset.playbackId,
      initialSource,
    });

    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.playbackRate = playbackRateRef.current;

    audioRef.current = registerGlobalAudio(audio);

    const handleLoadedMetadata = () => {
      const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;

      setDuration(safeDuration);
      setIsReady(true);
    };

    const handleCanPlay = () => {
      setIsReady(true);
    };

    const handleSeeked = () => {
      diagLog(
        "seeked-event",
        "mount-effect:listener",
        lastTimeUpdateRef.current,
        audio.currentTime,
        { paused: audio.paused }
      );
    };

    const handleTimeUpdate = () => {
      const previousTime = lastTimeUpdateRef.current;
      const newTime = Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : 0;

      lastTimeUpdateRef.current = newTime;

      const now = performance.now();
      const backward = newTime + 0.05 < previousTime;
      const throttled = now - lastTimeUpdateLogRef.current < 250;

      if (!backward && throttled) {
        return;
      }

      lastTimeUpdateLogRef.current = now;

      diagLog("timeupdate-event", "mount-effect:listener", previousTime, newTime, {
        backward,
        paused: audio.paused,
      });

      setCurrentTime(newTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;

      setCurrentTime(safeDuration);
    };

    const handleError = () => {
      setIsReady(false);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("seeked", handleSeeked);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    if (initialSource) {
      sourceRef.current = initialSource;
      audio.src = initialSource;
    }

    return () => {
      loadGenerationRef.current += 1;
      audio.pause();

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("seeked", handleSeeked);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);

      audioRef.current = null;
    };
  }, [initialSource]);

  const load = useCallback(
    async (
      nextSource: string,
      options?: {
        preserveTime?: boolean;
        autoplay?: boolean;
        startAt?: number;
      }
    ) => {
      const audio = audioRef.current;

      if (!audio || !nextSource) return;

      const loadGeneration = loadGenerationRef.current + 1;
      loadGenerationRef.current = loadGeneration;

      const preserveTime = options?.preserveTime ?? true;
      const autoplay = options?.autoplay ?? false;

      const previousTime = Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : 0;

      const targetTime =
        typeof options?.startAt === "number"
          ? options.startAt
          : preserveTime
            ? previousTime
            : 0;

      const sourceChanged =
        sourceRef.current !== nextSource || !audio.src.includes(nextSource);

      diagLog(
        "restore:load:enter",
        "load",
        previousTime,
        targetTime,
        {
          nextSource,
          sourceChanged,
          autoplay,
          loadGeneration,
        }
      );

      const playAfterSeek = async (time: number) => {
        if (loadGeneration !== loadGenerationRef.current) {
          return;
        }

        diagLog(
          "restore:playAfterSeek:enter",
          "load:playAfterSeek",
          audio.currentTime,
          time,
          { autoplay }
        );

        await waitForAudioSeeked(audio, time, "load:playAfterSeek");

        if (loadGeneration !== loadGenerationRef.current) {
          return;
        }

        setCurrentTime(
          Number.isFinite(audio.currentTime) ? audio.currentTime : time
        );

        if (!autoplay || !audio.paused) {
          return;
        }

        try {
          diagLog(
            "resume:play()",
            "load:playAfterSeek",
            audio.currentTime,
            audio.currentTime,
            {}
          );
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      };

      if (!sourceChanged) {
        const safeDuration = Number.isFinite(audio.duration)
          ? audio.duration
          : 0;

        const safeTime = clampPlaybackTime(targetTime, safeDuration);

        setCurrentTime(safeTime);
        await playAfterSeek(safeTime);

        return;
      }

      const wasPlaying = !audio.paused;

      setIsReady(false);

      sourceRef.current = nextSource;
      audio.src = nextSource;
      audio.playbackRate = playbackRateRef.current;

      await new Promise<void>((resolve) => {
        const cleanup = () => {
          audio.removeEventListener("loadedmetadata", handleReady);
          audio.removeEventListener("canplay", handleReady);
          audio.removeEventListener("error", handleError);
        };

        const handleReady = () => {
          if (loadGeneration !== loadGenerationRef.current) {
            cleanup();
            resolve();
            return;
          }

          cleanup();

          const safeDuration = Number.isFinite(audio.duration)
            ? audio.duration
            : 0;

          const safeTime = clampPlaybackTime(targetTime, safeDuration);

          setDuration(safeDuration);
          setIsReady(true);
          setCurrentTime(safeTime);

          resolve();
        };

        const handleError = () => {
          cleanup();

          if (loadGeneration === loadGenerationRef.current) {
            setIsReady(false);
          }

          resolve();
        };

        audio.addEventListener("loadedmetadata", handleReady, { once: true });
        audio.addEventListener("canplay", handleReady, { once: true });
        audio.addEventListener("error", handleError, { once: true });

        audio.load();
      });

      if (loadGeneration !== loadGenerationRef.current) {
        return;
      }

      const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const safeTime = clampPlaybackTime(targetTime, safeDuration);

      const shouldPlay = autoplay || wasPlaying;

      diagLog(
        "restore:load:post-metadata",
        "load:source-changed",
        audio.currentTime,
        safeTime,
        { shouldPlay }
      );

      await waitForAudioSeeked(audio, safeTime, "load:source-changed");

      if (loadGeneration !== loadGenerationRef.current) {
        return;
      }

      setCurrentTime(
        Number.isFinite(audio.currentTime) ? audio.currentTime : safeTime
      );

      if (!shouldPlay) {
        return;
      }

      try {
        diagLog(
          "resume:play()",
          "load:shouldPlay",
          audio.currentTime,
          audio.currentTime,
          {}
        );
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    },
    []
  );

  const play = useCallback(async (position?: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.playbackRate = playbackRateRef.current;

    if (typeof position === "number" && Number.isFinite(position)) {
      await waitForAudioSeeked(audio, position, "play:position");
      setCurrentTime(
        Number.isFinite(audio.currentTime) ? audio.currentTime : position
      );
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback(async (value: number) => {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(value)) return;

    loadGenerationRef.current += 1;

    const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;

    const safeValue = clampPlaybackTime(value, safeDuration);

    const beforeSeek = audio.currentTime;

    diagLog("seek():enter", "seek", beforeSeek, safeValue, {
      requested: value,
      paused: audio.paused,
      loadGeneration: loadGenerationRef.current,
    });

    await waitForAudioSeeked(audio, safeValue, "seek");

    diagLog("seek():exit", "seek", beforeSeek, audio.currentTime, {
      requested: value,
      safeValue,
      paused: audio.paused,
    });

    setCurrentTime(
      Number.isFinite(audio.currentTime) ? audio.currentTime : safeValue
    );
  }, []);

  const setPlaybackRate = useCallback((value: number) => {
    const safeRate = [0.75, 1, 1.25, 1.5].includes(value) ? value : 1;

    playbackRateRef.current = safeRate;

    const audio = audioRef.current;

    if (audio) {
      audio.playbackRate = safeRate;
    }

    setPlaybackRateState(safeRate);
  }, []);

  return {
    audioRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    setPlaybackRate,
    play,
    pause,
    seek,
    load,
  };
}
