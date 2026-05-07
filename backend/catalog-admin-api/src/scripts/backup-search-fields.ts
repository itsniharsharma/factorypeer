import "../bootstrap-env.js";
import { createWriteStream, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";

const BACKUP_DIR = process.env["BACKUP_DIR"]?.trim() || "./backups";
const BATCH_SIZE = Number(process.env["BACKUP_BATCH_SIZE"] ?? 500);

function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "_" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

async function main() {
  const cfg = loadConfig();
  const models = await connectMongo(cfg);
  try {
    const timestamp = formatTimestamp();
    const filename = `search-fields-backup-${timestamp}.ndjson`;
    const filepath = join(BACKUP_DIR, filename);

    // Ensure backup directory exists
    mkdirSync(BACKUP_DIR, { recursive: true });

    console.log(`Backing up search fields to ${filepath}`);
    const writeStream = createWriteStream(filepath, { encoding: "utf-8" });

    let processed = 0;
    let batchCount = 0;

    const cursor = models.Product.find(
      {},
      {
        _id: 1,
        searchTokens: 1,
        searchBlob: 1,
        searchableBrands: 1,
        searchableCategories: 1,
        searchableSpecs: 1,
      },
      { batchSize: BATCH_SIZE },
    ).cursor();

    for await (const doc of cursor) {
      const record = {
        _id: String(doc._id),
        searchTokens: doc.searchTokens ?? [],
        searchBlob: doc.searchBlob ?? "",
        searchableBrands: doc.searchableBrands ?? [],
        searchableCategories: doc.searchableCategories ?? [],
        searchableSpecs: doc.searchableSpecs ?? [],
      };
      writeStream.write(JSON.stringify(record) + "\n");
      processed++;

      if (processed % BATCH_SIZE === 0) {
        batchCount++;
        console.log(`Exported ${processed} products (${batchCount} batches)`);
      }
    }

    writeStream.end();

    await new Promise<void>((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log(`Backup complete: ${processed} products exported to ${filename}`);
    console.log(
      `To restore: cat ${filename} | while read line; do mongosh --eval "restore($line)"; done`,
    );
  } finally {
    await disconnectMongo();
  }
}

process.on("SIGINT", () => {
  console.log("Interrupted");
  process.exit(1);
});

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
