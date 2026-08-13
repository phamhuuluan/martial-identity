#!/usr/bin/env npx tsx
/**
 * Optional helper: dump raw Fanpage posts via Facebook MCP → data/facebook-raw.json
 *
 * NO AI. Cursor Agent performs analysis / Markdown generation.
 * Prefer asking the Agent: "Đồng bộ Fanpage vào website" (uses MCP directly).
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { resolve } from "node:path";
import { loadSyncConfig } from "../src/sync/config";
import { createFacebookPostReader } from "../src/sync/facebook/createFacebookPostReader";
import { monthsAgo } from "../src/sync/facebook/GraphClient";
import { PostFilter } from "../src/sync/filter/PostFilter";
import { blank, log, step } from "../src/sync/logging/logger";

loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local") });

async function main(): Promise<void> {
  blank();
  step("🚀", "Facebook raw fetch (MCP only — no AI)");
  blank();

  const config = loadSyncConfig();
  const reader = await createFacebookPostReader(config);
  const since = monthsAgo(config.lookbackMonths);
  const filter = new PostFilter(config);

  try {
    step("✔", "Reading Page via MCP");
    const fetched = await reader.fetchPostsSince(since);
    const eligible = filter.filter(fetched);
    step("✔", `Found ${fetched.length} posts (${eligible.length} after filter)`);

    const outPath = path.resolve(process.cwd(), "data/facebook-raw.json");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(
      outPath,
      `${JSON.stringify(
        {
          fetchedAt: new Date().toISOString(),
          since: since.toISOString(),
          source: reader.sourceName,
          count: eligible.length,
          posts: eligible,
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    step("✔", `Saved data/facebook-raw.json`);
    blank();
    step("✅", "Raw fetch completed — ask Cursor Agent to generate content/*.md");
  } finally {
    await reader.dispose?.();
  }
}

main().catch((err) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
