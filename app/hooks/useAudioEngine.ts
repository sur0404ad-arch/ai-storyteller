"use client";

import { useEffect, useRef, useState } from "react";

let globalAudio: HTMLAudioElement | null = null;

export function useAudioEngine(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!globalAudio) {
      globalAudio = new Audio();
      globalAudio.preload = "auto";
    }

    audioRef.current = globalAudio;

    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
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

    if (audio.src !== window.location.origin + audioSrc) {
      audio.pause();
      audio.src = audioSrc;
      audio.load();

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [audioSrc]);

  const play = async () => {
    try {
      const audio = audioRef.current;

      if (!audio) return;

      await audio.play();

      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const seek = (time: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = time;
    setCurrentTime(time);
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