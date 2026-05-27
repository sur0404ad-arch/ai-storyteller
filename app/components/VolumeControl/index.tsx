"use client";

import { useEffect, useState } from "react";

import {
  getStoredVolume,
  setGlobalVolume,
} from "../../lib/audio/audioController";

export default function VolumeControl() {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setVolume(getStoredVolume());
  }, []);

  function handleVolumeChange(value: number) {
    const safeVolume = setGlobalVolume(value);
    setVolume(safeVolume);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">
          Volume
        </p>

        <p className="text-[11px] text-white/45">
          {Math.round(volume * 100)}
        </p>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => handleVolumeChange(Number(event.target.value))}
        className="w-full cursor-pointer accent-orange-500"
      />
    </div>
  );
}