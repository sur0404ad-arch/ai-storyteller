"use client";

import { useEffect, useState } from "react";

import {
  clearListeningHistory,
  getListeningHistory,
  type ListeningHistoryItem,
} from "@/app/lib/listening/listeningHistoryController";

type Props = {
  onOpenItem: (item: ListeningHistoryItem) => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function ContinueListening({
  onOpenItem,
}: Props) {
  const [history, setHistory] = useState<ListeningHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getListeningHistory());
  }, []);

  const handleClear = () => {
    setHistory(clearListeningHistory());
  };

  if (!history.length) {
    return (
      <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
        <p className="text-sm text-white/45">
          No listening history yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-orange-200/75">
            Continue Listening
          </p>

          <p className="mt-1 text-xs text-white/45">
            Resume your recent sessions
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="text-[10px] text-red-300 transition hover:text-red-200"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenItem(item)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-orange-200/70">
                Continue
              </span>

              <span className="text-[10px] text-white/35">
                {formatTime(item.timestamp)}
              </span>
            </div>

            <p className="line-clamp-1 text-sm text-white">
              {item.bookTitle}
            </p>

            <p className="mt-1 line-clamp-1 text-[11px] text-white/45">
              {item.chapterTitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
