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

function prepareCacheStructure() {
  if (!fs.existsSync(CHUNKS_DIR)) {
    console.error("ERROR: chunks folder not found");
    process.exit(1);
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const files = fs
    .readdirSync(CHUNKS_DIR)
    .filter((file) => file.endsWith(".txt"));

  if (files.length === 0) {
    console.error("ERROR: no chunk files found");
    process.exit(1);
  }

  files.forEach((file, index) => {
    const cacheMetaPath = path.join(
      CACHE_DIR,
      `chunk-${index + 1}.json`
    );

    const meta = {
      id: index + 1,
      textFile: file,
      futureMp3: `chunk-${index + 1}.mp3`,
      status: "pending-generation",
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      cacheMetaPath,
      JSON.stringify(meta, null, 2)
    );

    console.log(`CACHE READY: ${cacheMetaPath}`);
  });

  console.log("");
  console.log(`TOTAL CACHE FILES: ${files.length}`);
}

prepareCacheStructure();
