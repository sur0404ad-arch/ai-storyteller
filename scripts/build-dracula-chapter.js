const fs = require("fs");
const path = require("path");

const AUDIO_DIR = path.join(process.cwd(), "public", "audio", "dracula");
const OUTPUT_FILE = path.join(AUDIO_DIR, "chapter-1.mp3");

const files = fs
  .readdirSync(AUDIO_DIR)
  .filter((file) => /^chunk-\d+\.mp3$/.test(file))
  .sort((a, b) => {
    const aNum = Number(a.match(/\d+/)[0]);
    const bNum = Number(b.match(/\d+/)[0]);
    return aNum - bNum;
  });

if (files.length === 0) {
  console.error("ERROR: no mp3 chunks found");
  process.exit(1);
}

const buffers = files.map((file) =>
  fs.readFileSync(path.join(AUDIO_DIR, file))
);

fs.writeFileSync(OUTPUT_FILE, Buffer.concat(buffers));

console.log(`DONE: ${OUTPUT_FILE}`);
console.log(`TOTAL PARTS: ${files.length}`);
