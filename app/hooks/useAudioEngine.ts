"use client";

import { useEffect, useRef, useState } from "react";

export function useAudioEngine(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioSrcRef = useRef<string>("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

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
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!audioSrc || !audioRef.current) return;

    const audio = audioRef.current;

    if (lastAudioSrcRef.current === audioSrc) return;

    lastAudioSrcRef.current = audioSrc;

    audio.pause();
    audio.src = audioSrc;
    audio.preload = "metadata";
    audio.load();

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioSrc]);

  const play = async () => {
    const audio = audioRef.current;

    if (!audio || !audioSrc) return;

    try {
      if (audio.src !== new URL(audioSrc, window.location.origin).href) {
        audio.src = audioSrc;
        audio.load();
      }

      await audio.play();
    } catch (error) {
      console.error("Audio play failed:", error);
    }
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