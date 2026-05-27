import { NarrationVoiceId } from "./narrationManifest";

type ResolveAudioSourceParams = {
  bookId: string;
  chapterId: number;
  voiceId: NarrationVoiceId;
  chunkIndex: number;
};

export function resolveAudioSource(params: ResolveAudioSourceParams) {
  if (params.bookId === "dracula") {
    return `/audio/dracula/chunk-${params.chunkIndex}.mp3`;
  }

  return [
    "/api/audio",
    params.bookId,
    params.chapterId,
    params.voiceId,
    params.chunkIndex,
  ].join("/");
}

export function createAudioUrl(params: ResolveAudioSourceParams) {
  return resolveAudioSource(params);
}

export function resolveManifestId(
  bookId: string,
  chapterId: number,
  voiceId: NarrationVoiceId
) {
  return `${bookId}-${chapterId}-${voiceId}`;
}

export function resolveChunkId(
  bookId: string,
  chapterId: number,
  voiceId: NarrationVoiceId,
  chunkIndex: number
) {
  return `${bookId}-${chapterId}-${voiceId}-${chunkIndex}`;
}