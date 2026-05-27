const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const ffmpegPath = require("ffmpeg-static");

const PUBLIC_DIR = path.join(process.cwd(), "public");
const BACKUP_DIR = path.join(PUBLIC_DIR, "_audio-backup-before-normalize");

const TARGET_I = "-16";
const TARGET_TP = "-1.5";
const TARGET_LRA = "11";

function isMp3(fileName) {
  return fileName.toLowerCase().endsWith(".mp3");
}

function getAllMp3Files(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "_audio-backup-before-normalize") return [];
      return getAllMp3Files(fullPath);
    }

    if (entry.isFile() && isMp3(entry.name)) {
      return [fullPath];
    }

    return [];
  });
}

function ensureBackup(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupFolder = path.dirname(backupPath);

  fs.mkdirSync(backupFolder, { recursive: true });

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
}

function normalizeFile(filePath) {
  const tempPath = filePath.replace(/\.mp3$/i, ".normalized.tmp.mp3");

  const args = [
    "-y",
    "-i",
    filePath,
    "-af",
    `loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=${TARGET_LRA}`,
    "-ar",
    "44100",
    "-b:a",
    "192k",
    tempPath,
  ];

  const result = spawnSync(ffmpegPath, args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    throw new Error(`Failed to normalize: ${filePath}`);
  }

  fs.renameSync(tempPath, filePath);
}

function main() {
  const mp3Files = getAllMp3Files(PUBLIC_DIR);

  if (mp3Files.length === 0) {
    console.log("No mp3 files found in public folder.");
    return;
  }

  console.log(`Found ${mp3Files.length} mp3 files.`);
  console.log("Creating backups and normalizing loudness...");

  for (const filePath of mp3Files) {
    const relativePath = path.relative(process.cwd(), filePath);

    console.log(`\nNormalizing: ${relativePath}`);

    ensureBackup(filePath);
    normalizeFile(filePath);
  }

  console.log("\nDone.");
  console.log(`Backup folder: ${path.relative(process.cwd(), BACKUP_DIR)}`);
}

main();