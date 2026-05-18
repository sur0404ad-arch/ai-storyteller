"use client";

import { useEffect, useRef, useState } from "react";

let sharedAudio: HTMLAudioElement | null = null;

export function useAudioEngine(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!sharedAudio) {
      sharedAudio = new Audio();
      sharedAudio.preload = "auto";
      sharedAudio.setAttribute("playsinline", "true");
    }

    audioRef.current = sharedAudio;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioSrc) return;

    const nextUrl = new URL(audioSrc, window.location.origin).toString();

    if (audio.src !== nextUrl) {
      audio.pause();
      audio.src = nextUrl;
      audio.load();

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [audioSrc]);

  const play = async () => {
    const audio = audioRef.current;

    if (!audio || !audioSrc) return;

    const nextUrl = new URL(audioSrc, window.location.origin).toString();

    if (audio.src !== nextUrl) {
      audio.src = nextUrl;
      audio.load();
    }

    await audio.play();
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const seek = (time: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    const safeTime = Math.max(0, time);

    audio.currentTime = safeTime;
    setCurrentTime(safeTime);
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seek,
  };
}