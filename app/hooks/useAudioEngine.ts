"use client";

import { useCallback, useEffect, useRef, useState } from "react";

let sharedAudio: HTMLAudioElement | null = null;
let sharedSource = "";

function getSharedAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!sharedAudio) {
    sharedAudio = new Audio();

    sharedAudio.preload = "auto";
    sharedAudio.setAttribute("playsinline", "true");
    sharedAudio.setAttribute("webkit-playsinline", "true");
  }

  return sharedAudio;
}

function toAbsoluteUrl(src: string) {
  return new URL(src, window.location.origin).toString();
}

export function useAudioEngine(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isMountedRef = useRef(false);
  const pendingPlayRef = useRef<Promise<void> | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    isMountedRef.current = true;

    const audio = getSharedAudio();

    if (!audio) return;

    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (!isMountedRef.current) return;

      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsReady(true);
    };

    const handleDurationChange = () => {
      if (!isMountedRef.current) return;

      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleTimeUpdate = () => {
      if (!isMountedRef.current) return;

      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    };

    const handlePlay = () => {
      if (!isMountedRef.current) return;

      setIsPlaying(true);
    };

    const handlePause = () => {
      if (!isMountedRef.current) return;

      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (!isMountedRef.current) return;

      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (!isMountedRef.current) return;

      setIsReady(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    audio.addEventListener("canplay", handleCanPlay);

    setCurrentTime(audio.currentTime || 0);
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    setIsPlaying(!audio.paused);
    setIsReady(audio.readyState >= 1);

    return () => {
      isMountedRef.current = false;

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("timeupdate", handleTimeUpdate);

      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);

      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const load = useCallback(async (src: string, startTime = 0) => {
    const audio = audioRef.current;

    if (!audio || !src) return;

    const absoluteSrc = toAbsoluteUrl(src);
    const sourceChanged = sharedSource !== absoluteSrc;
    const safeStartTime = Math.max(0, startTime);

    if (sourceChanged) {
      audio.pause();

      setIsReady(false);
      setIsPlaying(false);

      audio.src = absoluteSrc;
      sharedSource = absoluteSrc;
      audio.load();

      await new Promise<void>((resolve) => {
        const handleReady = () => {
          audio.removeEventListener("loadedmetadata", handleReady);
          resolve();
        };

        if (audio.readyState >= 1) {
          resolve();
          return;
        }

        audio.addEventListener("loadedmetadata", handleReady, {
          once: true,
        });
      });

      if (safeStartTime > 0) {
        audio.currentTime = safeStartTime;
      }

      setCurrentTime(audio.currentTime || 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsReady(true);

      return;
    }

    if (Math.abs(audio.currentTime - safeStartTime) > 0.5) {
      audio.currentTime = safeStartTime;
      setCurrentTime(safeStartTime);
    }
  }, []);

  useEffect(() => {
    if (!audioSrc) return;

    load(audioSrc);
  }, [audioSrc, load]);

  const play = useCallback(
    async (startTime?: number) => {
      const audio = audioRef.current;

      if (!audio || !audioSrc) return;

      if (pendingPlayRef.current) {
        return pendingPlayRef.current;
      }

      const execute = async () => {
        try {
          const absoluteSrc = toAbsoluteUrl(audioSrc);

          if (sharedSource !== absoluteSrc) {
            await load(audioSrc, startTime || 0);
          } else if (
            typeof startTime === "number" &&
            Number.isFinite(startTime)
          ) {
            const safeStartTime = Math.max(0, startTime);

            if (Math.abs(audio.currentTime - safeStartTime) > 0.5) {
              audio.currentTime = safeStartTime;
              setCurrentTime(safeStartTime);
            }
          }

          if (!audio.paused) return;

          await audio.play();
        } catch (error) {
          console.error("Audio play error:", error);
        } finally {
          pendingPlayRef.current = null;
        }
      };

      pendingPlayRef.current = execute();

      return pendingPlayRef.current;
    },
    [audioSrc, load]
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || audio.paused) return;

    audio.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    const safeTime = Math.max(0, time);

    audio.currentTime = safeTime;
    setCurrentTime(safeTime);
  }, []);

  return {
    audioRef,

    isReady,
    isPlaying,

    currentTime,
    duration,

    play,
    pause,
    seek,
    load,
  };
}