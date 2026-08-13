#!/usr/bin/env npx tsx
/**
 * Smoke-test the project Facebook MCP server (stdio).
 * Usage: npm run test:facebook-mcp
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

loadEnv({ path: resolve(process.cwd(), ".env") });

async function main() {
  const cwd = process.cwd();
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", resolve(cwd, "mcp/facebook-page/server.ts")],
    cwd,
    env: Object.fromEntries(
      Object.entries(process.env).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string"
      )
    ),
  });

  const client = new Client(
    { name: "facebook-mcp-smoke-test", version: "1.0.0" },
    { capabilities: {} }
  );

  console.log("✔ Connecting Facebook MCP...");
  await client.connect(transport);
  console.log("✔ Facebook MCP Connected");

  console.log("✔ Reading Page");
  const pageInfo = await client.callTool({
    name: "get_page_info",
    arguments: {},
  });
  const pageText = extractText(pageInfo);
  const page = JSON.parse(pageText) as { name?: string; id?: string };
  console.log(`✔ Page: ${page.name ?? "?"} (${page.id ?? "?"})`);

  console.log("✔ Fetching posts (4 months)...");
  const postsResult = await client.callTool({
    name: "get_page_posts",
    arguments: { lookbackMonths: 4, maxImages: 3 },
  });
  const postsPayload = JSON.parse(extractText(postsResult)) as {
    count: number;
    posts: Array<{
      facebookPostId: string;
      message: string;
      remoteImages: string[];
      engagementScore: number;
    }>;
  };

  console.log(`✔ Found ${postsPayload.count} posts`);

  const withImages = postsPayload.posts.filter((p) => p.remoteImages.length > 0);
  console.log(`✔ Posts with images/thumbnails: ${withImages.length}`);
  if (withImages[0]) {
    console.log(
      `✔ Sample image URL: ${withImages[0].remoteImages[0]?.slice(0, 80)}...`
    );
  }

  await client.close();
  await transport.close();
  console.log("✔ MCP smoke test passed");
}

function extractText(result: unknown): string {
  const content = (result as { content?: Array<{ type?: string; text?: string }> })
    .content;
  const parts = (content ?? [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text as string);
  if (!parts.length) throw new Error("Empty MCP tool response");
  return parts.join("\n");
}

main().catch((err) => {
  console.error("❌", err instanceof Error ? err.message : err);
  process.exit(1);
});
