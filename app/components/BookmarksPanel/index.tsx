"use client";

import type { BookmarkItem } from "../../lib/bookmarks/bookmarkController";

type BookmarksPanelProps = {
  bookmarks: BookmarkItem[] | unknown;
  onJumpToBookmark: (bookmark: BookmarkItem) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onClearAll: () => void;
};

export default function BookmarksPanel({
  bookmarks,
  onJumpToBookmark,
  onDeleteBookmark,
  onClearAll,
}: BookmarksPanelProps) {
  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];

  return (
    <div className="rounded-[1.35rem] border-2 border-[#6d3720] bg-black/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-orange-200/75">
            Saved Moments
          </p>

          <p className="mt-1 text-[11px] text-white/45">
            {safeBookmarks.length} saved
          </p>
        </div>

        {safeBookmarks.length > 0 ? (
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-full border border-red-400/20 px-3 py-1 text-[10px] text-red-200/60 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-100"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {safeBookmarks.length === 0 ? (
        <div className="rounded-xl border border-[#6d3720] bg-black/10 p-3">
          <p className="text-xs text-white/45">No saved moments yet.</p>
        </div>
      ) : (
        <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safeBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group rounded-xl border border-[#6d3720] bg-black/10 p-3 transition hover:border-orange-400/50 hover:bg-white/5"
            >
              <button
                type="button"
                onClick={() => onJumpToBookmark(bookmark)}
                className="w-full text-left"
              >
                <p className="truncate text-xs font-medium text-white">
                  {bookmark.bookTitle}
                </p>

                <p className="mt-1 truncate text-[11px] text-white/50">
                  {bookmark.chapterTitle}
                </p>

                <p className="mt-1 text-[10px] text-orange-300/70">
                  {bookmark.time}
                </p>
              </button>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onDeleteBookmark(bookmark.id)}
                  className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}