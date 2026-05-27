const fs = require("fs");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

const CHUNKS_DIR = path.join(
  process.cwd(),
  "public",
  "books",
  "dracula-chunks"
);

const AUDIO_DIR = path.join(
  process.cwd(),
  "public",
  "audio",
  "dracula"
);

const CACHE_DIR = path.join(
  process.cwd(),
  "public",
  "audio",
  "dracula-cache"
);

async function generateChunkAudio(chunkFile, index) {
  const chunkNumber = index + 1;

  const chunkPath = path.join(CHUNKS_DIR, chunkFile);
  const outputFile = path.join(AUDIO_DIR, `chunk-${chunkNumber}.mp3`);
  const cacheFile = path.join(CACHE_DIR, `chunk-${chunkNumber}.json`);

  if (fs.existsSync(outputFile)) {
    console.log(`SKIP: chunk-${chunkNumber}.mp3 already exists`);
    return;
  }

  const text = fs.readFileSync(chunkPath, "utf8").trim();

  if (!text) {
    console.log(`SKIP: chunk-${chunkNumber}.txt is empty`);
    return;
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  updateCache(cacheFile, {
    id: chunkNumber,
    textFile: chunkFile,
    mp3: `chunk-${chunkNumber}.mp3`,
    audioPath: `/audio/dracula/chunk-${chunkNumber}.mp3`,
    status: "generating",
    textLength: text.length,
    startedGenerationAt: new Date().toISOString(),
  });

  console.log(`GENERATING: chunk-${chunkNumber}.mp3`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    updateCache(cacheFile, {
      id: chunkNumber,
      textFile: chunkFile,
      mp3: `chunk-${chunkNumber}.mp3`,
      audioPath: `/audio/dracula/chunk-${chunkNumber}.mp3`,
      status: "error",
      textLength: text.length,
      error: errorText,
      failedAt: new Date().toISOString(),
    });

    console.error("ElevenLabs error:", errorText);
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputFile, buffer);

  updateCache(cacheFile, {
    id: chunkNumber,
    textFile: chunkFile,
    mp3: `chunk-${chunkNumber}.mp3`,
    audioPath: `/audio/dracula/chunk-${chunkNumber}.mp3`,
    status: "ready",
    textLength: text.length,
    fileSize: buffer.length,
    generatedAt: new Date().toISOString(),
  });

  console.log(`DONE: ${outputFile}`);
}

function updateCache(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function generateAllAudio() {
  if (!ELEVENLABS_API_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY is missing.");
    process.exit(1);
  }

  if (!fs.existsSync(CHUNKS_DIR)) {
    console.error("ERROR: Dracula chunks folder is missing.");
    process.exit(1);
  }

  const chunkFiles = fs
    .readdirSync(CHUNKS_DIR)
    .filter((file) => file.endsWith(".txt"))
    .sort((a, b) => {
      const aNumber = Number(a.match(/\d+/)?.[0] || 0);
      const bNumber = Number(b.match(/\d+/)?.[0] || 0);
      return aNumber - bNumber;
    });

  if (chunkFiles.length === 0) {
    console.error("ERROR: No Dracula chunks found.");
    process.exit(1);
  }

  console.log(`TOTAL CHUNKS: ${chunkFiles.length}`);

  for (let i = 0; i < chunkFiles.length; i += 1) {
    await generateChunkAudio(chunkFiles[i], i);
  }

  console.log("");
  console.log("DRACULA AUDIO GENERATION COMPLETE");
}

generateAllAudio();