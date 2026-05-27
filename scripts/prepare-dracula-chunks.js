const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(
  process.cwd(),
  "public",
  "books",
  "dracula.txt"
);

const OUTPUT_DIR = path.join(
  process.cwd(),
  "public",
  "books",
  "dracula-chunks"
);

const CHUNK_SIZE = 3500;

function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitIntoChunks(text) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + CHUNK_SIZE;

    if (end >= text.length) {
      chunks.push(text.slice(start).trim());
      break;
    }

    const sentenceEnd = text.lastIndexOf(".", end);
    const paragraphEnd = text.lastIndexOf("\n\n", end);

    const bestEnd = Math.max(sentenceEnd, paragraphEnd);

    if (bestEnd > start + 1000) {
      end = bestEnd + 1;
    }

    chunks.push(text.slice(start, end).trim());
    start = end;
  }

  return chunks.filter(Boolean);
}

function prepareChunks() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error("ERROR: dracula.txt not found");
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  fs.readdirSync(OUTPUT_DIR)
    .filter((file) => file.endsWith(".txt"))
    .forEach((file) => {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    });

  const rawText = fs.readFileSync(INPUT_FILE, "utf8");
  const cleanedText = cleanText(rawText);
  const chunks = splitIntoChunks(cleanedText);

  chunks.forEach((chunk, index) => {
    const chunkPath = path.join(
      OUTPUT_DIR,
      `chunk-${index + 1}.txt`
    );

    fs.writeFileSync(chunkPath, chunk, "utf8");

    console.log(`DONE: ${chunkPath}`);
  });

  console.log("");
  console.log(`TOTAL CHUNKS: ${chunks.length}`);
}

prepareChunks();