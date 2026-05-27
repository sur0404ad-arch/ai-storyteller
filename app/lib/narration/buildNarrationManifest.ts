import {
  buildPreparedNarrationManifest,
  ChapterNarrationManifest,
  NarrationVoiceId,
} from "./narrationManifest";

type BuildManifestParams = {
  bookId: string;
  chapterId: number;
  title: string;
  voiceId: NarrationVoiceId;
  texts: string[];
};

function createAudioUrl(
  bookId: string,
  chapterId: number,
  voiceId: NarrationVoiceId,
  index: number
) {
  return `/api/audio/${bookId}/${chapterId}/${voiceId}/${index}`;
}

export async function buildNarrationManifest(
  params: BuildManifestParams
): Promise<ChapterNarrationManifest> {
  const audioUrls = params.texts.map(
    (_, index) =>
      createAudioUrl(
        params.bookId,
        params.chapterId,
        params.voiceId,
        index
      )
  );

  return buildPreparedNarrationManifest({
    bookId: params.bookId,
    chapterId: params.chapterId,
    title: params.title,
    voiceId: params.voiceId,
    texts: params.texts,
    audioUrls,
  });
}