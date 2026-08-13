import path from "node:path";

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid integer for ${name}: ${raw}`);
  }
  return n;
}

function parseArgs(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface SyncConfig {
  projectRoot: string;
  facebookPageId: string;
  facebookAccessToken: string;
  forceGraph: boolean;
  mcpCommand: string;
  mcpArgs: string[];
  mcpToolName: string;
  graphApiVersion: string;
  lookbackMonths: number;
  maxImagesPerPost: number;
  minMessageLength: number;
}

/**
 * Config for optional raw MCP fetch only.
 * No OpenAI / external LLM keys.
 */
export function loadSyncConfig(cwd = process.cwd()): SyncConfig {
  const projectRoot = cwd;
  return {
    projectRoot,
    facebookPageId:
      process.env.FACEBOOK_PAGE_ID?.trim() ||
      process.env.FB_PAGE_ID?.trim() ||
      "",
    facebookAccessToken:
      process.env.FACEBOOK_ACCESS_TOKEN?.trim() ||
      process.env.FB_PAGE_ACCESS_TOKEN?.trim() ||
      "",
    forceGraph: process.env.FACEBOOK_FORCE_GRAPH === "1",
    mcpCommand: process.env.FACEBOOK_MCP_COMMAND?.trim() || "npx",
    mcpArgs: process.env.FACEBOOK_MCP_ARGS?.trim()
      ? parseArgs(process.env.FACEBOOK_MCP_ARGS)
      : ["tsx", path.resolve(projectRoot, "mcp/facebook-page/server.ts")],
    mcpToolName: process.env.FACEBOOK_MCP_TOOL?.trim() || "get_page_posts",
    graphApiVersion: process.env.FACEBOOK_GRAPH_VERSION?.trim() || "v21.0",
    lookbackMonths: optionalInt("FACEBOOK_LOOKBACK_MONTHS", 6),
    /** No artificial gallery cap — sync all stills Graph/MCP returns. */
    maxImagesPerPost: optionalInt("FACEBOOK_MAX_IMAGES", 100),
    minMessageLength: optionalInt("FACEBOOK_MIN_MESSAGE_LENGTH", 80),
  };
}
