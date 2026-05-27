const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(
  process.cwd(),
  "public",
  "audio",
  "dracula-cache"
);

function updateGenerationStatus() {
  if (!fs.existsSync(CACHE_DIR)) {
    console.error("ERROR: cache folder missing");
    process.exit(1);
  }

  const files = fs
    .readdirSync(CACHE_DIR)
    .filter((file) => file.endsWith(".json"));

  files.forEach((file) => {
    const filePath = path.join(CACHE_DIR, file);

    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    data.status = "generating";
    data.startedGenerationAt =
      new Date().toISOString();

    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2)
    );

    console.log(`UPDATED: ${file}`);
    console.log(`STATUS: ${data.status}`);
  });

  console.log("");
  console.log("GENERATION PIPELINE STARTED");
}

updateGenerationStatus();
