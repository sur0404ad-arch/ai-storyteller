const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(
  process.cwd(),
  "public",
  "audio",
  "dracula-cache"
);

function verifyPipeline() {
  if (!fs.existsSync(CACHE_DIR)) {
    console.error("ERROR: cache folder missing");
    process.exit(1);
  }

  const files = fs
    .readdirSync(CACHE_DIR)
    .filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.error("ERROR: no cache json files");
    process.exit(1);
  }

  files.forEach((file) => {
    const filePath = path.join(CACHE_DIR, file);

    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    console.log("");
    console.log("CACHE FILE:", file);
    console.log("STATUS:", data.status);
    console.log("FUTURE MP3:", data.futureMp3);
    console.log("TEXT FILE:", data.textFile);
  });

  console.log("");
  console.log("PIPELINE VERIFIED");
}

verifyPipeline();
