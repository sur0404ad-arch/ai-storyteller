const fs = require("fs");
const path = require("path");

const CHUNKS_DIR = path.join(
  process.cwd(),
  "public",
  "books",
  "dracula-chunks"
);

const CACHE_DIR = path.join(
  process.cwd(),
  "public",
  "audio",
  "dracula-cache"
);

const AUDIO_DIR = path.join(
  process.cwd(),
  "public",
  "audio",
  "dracula"
);

function prepareAudioGeneration() {
  if (!fs.existsSync(CHUNKS_DIR)) {
    console.error("ERROR: chunks folder not found");
    process.exit(1);
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const chunkFiles = fs
    .readdirSync(CHUNKS_DIR)
    .filter((file) => file.endsWith(".txt"));

  chunkFiles.forEach((file, index) => {
    const chunkPath = path.join(CHUNKS_DIR, file);

    const text = fs.readFileSync(chunkPath, "utf8");

    const audioPath = path.join(
      AUDIO_DIR,
      `chunk-${index + 1}.mp3`
    );

    const cacheMetaPath = path.join(
      CACHE_DIR,
      `chunk-${index + 1}.json`
    );

    const updatedMeta = {
      id: index + 1,
      textFile: file,
      futureMp3: `chunk-${index + 1}.mp3`,
      status: "ready-for-generation",
      textLength: text.length,
      audioPath: audioPath,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      cacheMetaPath,
      JSON.stringify(updatedMeta, null, 2)
    );

    console.log(`READY: ${cacheMetaPath}`);
  });

  console.log("");
  console.log(`TOTAL READY FILES: ${chunkFiles.length}`);
}

prepareAudioGeneration();
