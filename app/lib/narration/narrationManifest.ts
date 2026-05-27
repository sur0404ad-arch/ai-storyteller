export type NarrationVoiceId =
  | "michael"
  | "james"
  | "robert"
  | "emma"
  | "olivia"
  | "sophia";

export type NarrationChunk = {
  id: string;
  index: number;
  text: string;
  voiceId: NarrationVoiceId;
  audioUrl: string;
  duration: number;
  isPrepared: boolean;
};

export type ChapterNarrationManifest = {
  bookId: string;
  chapterId: number;
  title: string;
  voiceId: NarrationVoiceId;
  chunks: NarrationChunk[];
  preparedAt: string;
};

export function createChunkId(
  bookId: string,
  chapterId: number,
  voiceId: NarrationVoiceId,
  index: number
) {
  return `${bookId}-${chapterId}-${voiceId}-${index}`;
}

export function createEmptyNarrationManifest(params: {
  bookId: string;
  chapterId: number;
  title: string;
  voiceId: NarrationVoiceId;
}): ChapterNarrationManifest {
  return {
    bookId: params.bookId,
    chapterId: params.chapterId,
    title: params.title,
    voiceId: params.voiceId,
    chunks: [],
    preparedAt: new Date().toISOString(),
  };
}

export function buildPreparedNarrationManifest(params: {
  bookId: string;
  chapterId: number;
  title: string;
  voiceId: NarrationVoiceId;
  texts: string[];
  audioUrls: string[];
  durations?: number[];
}): ChapterNarrationManifest {
  const chunks = params.texts.map((text, index) => ({
    id: createChunkId(
      params.bookId,
      params.chapterId,
      params.voiceId,
      index
    ),
    index,
    text,
    voiceId: params.voiceId,
    audioUrl: params.audioUrls[index] || "",
    duration: params.durations?.[index] || 0,
    isPrepared: Boolean(params.audioUrls[index]),
  }));

  return {
    bookId: params.bookId,
    chapterId: params.chapterId,
    title: params.title,
    voiceId: params.voiceId,
    chunks,
    preparedAt: new Date().toISOString(),
  };
}

export function isManifestReady(manifest: ChapterNarrationManifest) {
  return (
    manifest.chunks.length > 0 &&
    manifest.chunks.every((chunk) => chunk.isPrepared && chunk.audioUrl)
  );
}