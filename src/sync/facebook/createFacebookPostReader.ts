import type { SyncConfig } from "../config";
import { step } from "../logging/logger";
import type { FacebookPostReader } from "./FacebookPostReader";
import { FacebookGraphClient } from "./GraphClient";
import { McpFacebookReader } from "./McpFacebookReader";

/**
 * Prefer Facebook MCP. Fall back to Meta Graph API only when MCP fails
 * or FACEBOOK_FORCE_GRAPH=1.
 */
export async function createFacebookPostReader(
  config: SyncConfig
): Promise<FacebookPostReader> {
  if (config.forceGraph) {
    step("⚠", "FACEBOOK_FORCE_GRAPH=1 — using Meta Graph API");
    return createGraphReader(config);
  }

  try {
    const mcp = await McpFacebookReader.tryConnect(config);
    if (mcp) {
      step("✔", "Facebook MCP Connected");
      return mcp;
    }
    step("⚠", "MCP not configured — falling back to Meta Graph API");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    step("⚠", `MCP unavailable (${msg}) — falling back to Meta Graph API`);
  }

  return createGraphReader(config);
}

function createGraphReader(config: SyncConfig): FacebookGraphClient {
  if (!config.facebookPageId) {
    throw new Error("FACEBOOK_PAGE_ID is required for Graph API fallback");
  }
  if (!config.facebookAccessToken) {
    throw new Error(
      "FACEBOOK_ACCESS_TOKEN is required for Graph API fallback"
    );
  }
  return new FacebookGraphClient(config);
}
