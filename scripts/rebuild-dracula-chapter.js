const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = process.cwd();

const inputDir = path.join(
  rootDir,
  "public",
  "audio",
  "dracula"
);

const outputFile = path.join(
  inputDir,
  "chapter-1.mp3"
);

const concatListFile = path.join(
  inputDir,
  "chapter-1-concat-list.txt"
);

function getChunkNumber(fileName) {
  const match = fileName.match(/^chunk-(\d+)\.mp3$/i);

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(match[1]);
}

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory not found: ${directoryPath}`);
    process.exit(1);
  }
}

function createConcatList(chunkFiles) {
  const concatLines = chunkFiles.map((fileName) => {
    const absoluteFilePath = path
      .join(inputDir, fileName)
      .replace(/\\/g, "/");

    return `file '${absoluteFilePath}'`;
  });

  fs.writeFileSync(
    concatListFile,
    concatLines.join("\n"),
    "utf8"
  );
}

function rebuildChapter() {
  ensureDirectoryExists(inputDir);

  const chunkFiles = fs
    .readdirSync(inputDir)
    .filter((fileName) =>
      /^chunk-\d+\.mp3$/i.test(fileName)
    )
    .sort(
      (a, b) =>
        getChunkNumber(a) - getChunkNumber(b)
    );

  if (chunkFiles.length === 0) {
    console.error(
      `No chunk-*.mp3 files found in: ${inputDir}`
    );

    process.exit(1);
  }

  console.log(`Found chunks: ${chunkFiles.length}`);
  console.log(`Input directory: ${inputDir}`);

  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  createConcatList(chunkFiles);

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatListFile,
      "-ac",
      "2",
      "-b:a",
      "128k",
      "-write_xing",
      "1",
      outputFile,
    ],
    {
      stdio: "inherit",
    }
  );

  if (result.status !== 0) {
    console.error(
      "Failed to rebuild Dracula chapter."
    );

    process.exit(result.status || 1);
  }

  console.log("Done:");
  console.log(outputFile);
}

rebuildChapter();