"use client";

import { type BookmarkItem } from "../lib/bookmarks/bookmarkController";

type Props = {
  bookmarks: BookmarkItem[];
  onJumpToBookmark: (bookmark: BookmarkItem) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onClearAll: () => void;
};

export default function BookmarksPanel({
  bookmarks,
  onJumpToBookmark,
  onDeleteBookmark,
  onClearAll,
}: Props) {
  if (!bookmarks.length) {
    return (
      <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
        <p className="text-sm text-white/45">No saved moments yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] border-2 border-[#6d3720] bg-black/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-orange-200/75">
            Saved Moments
          </p>

          <p className="mt-1 text-xs text-white/45">
            Jump back to important moments
          </p>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[10px] text-red-300 transition hover:text-red-200"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <button
            key={bookmark.id}
            type="button"
            onClick={() => onJumpToBookmark(bookmark)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-orange-200/70">
                {bookmark.time}
              </span>

              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteBookmark(bookmark.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                    onDeleteBookmark(bookmark.id);
                  }
                }}
                className="text-[10px] text-red-300 transition hover:text-red-200"
              >
                Delete
              </span>
            </div>

            <p className="line-clamp-1 text-sm text-white">
              {bookmark.bookTitle}
            </p>

            <p className="mt-1 line-clamp-1 text-[11px] text-white/45">
              {bookmark.chapterTitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
