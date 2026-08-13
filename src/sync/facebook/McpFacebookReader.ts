import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { SyncConfig } from "../config";
import type { FacebookPostReader } from "./FacebookPostReader";
import type { NormalizedFacebookPost } from "./types";

/**
 * MCP-backed Facebook reader for optional raw fetch (npm run fetch:facebook).
 * Cursor Agent prefers calling Facebook MCP tools directly — no external AI.
 */
export class McpFacebookReader implements FacebookPostReader {
  readonly sourceName = "mcp" as const;

  private constructor(
    private readonly client: Client,
    private readonly transport: StdioClientTransport,
    private readonly config: SyncConfig
  ) {}

  static async tryConnect(config: SyncConfig): Promise<McpFacebookReader | null> {
    if (!config.mcpCommand) {
      return null;
    }

    const transport = new StdioClientTransport({
      command: config.mcpCommand,
      args: config.mcpArgs,
      cwd: config.projectRoot,
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string"
          )
        ),
        FACEBOOK_PAGE_ID: config.facebookPageId,
        FACEBOOK_ACCESS_TOKEN: config.facebookAccessToken,
        FB_PAGE_ID: config.facebookPageId,
        FB_PAGE_ACCESS_TOKEN: config.facebookAccessToken,
        FACEBOOK_GRAPH_VERSION: config.graphApiVersion,
      },
    });

    const client = new Client(
      { name: "phat-quang-quyen-sync", version: "1.0.0" },
      { capabilities: {} }
    );

    await client.connect(transport);
    return new McpFacebookReader(client, transport, config);
  }

  async fetchPostsSince(since: Date): Promise<NormalizedFacebookPost[]> {
    const result = await this.client.callTool({
      name: this.config.mcpToolName,
      arguments: {
        pageId: this.config.facebookPageId,
        since: since.toISOString(),
        lookbackMonths: this.config.lookbackMonths,
        maxImages: this.config.maxImagesPerPost,
      },
    });

    const text = extractToolText(result);
    const parsed = JSON.parse(text) as unknown;
    const rawPosts = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { posts?: unknown }).posts)
        ? (parsed as { posts: unknown[] }).posts
        : Array.isArray((parsed as { data?: unknown }).data)
          ? (parsed as { data: unknown[] }).data
          : null;

    if (!rawPosts) {
      throw new Error(
        `MCP tool "${this.config.mcpToolName}" did not return a posts array`
      );
    }

    return rawPosts.map((item) =>
      normalizeMcpPost(item, this.config.maxImagesPerPost)
    );
  }

  async dispose(): Promise<void> {
    await this.client.close();
    await this.transport.close();
  }
}

function extractToolText(result: unknown): string {
  const content = (result as { content?: Array<{ type?: string; text?: string }> })
    .content;
  if (!content?.length) {
    throw new Error("MCP tool returned empty content");
  }
  const textParts = content
    .filter((c) => c.type === "text" && typeof c.text === "string")
    .map((c) => c.text as string);
  if (textParts.length === 0) {
    throw new Error("MCP tool returned no text content");
  }
  return textParts.join("\n");
}

function normalizeMcpPost(
  item: unknown,
  maxImages: number
): NormalizedFacebookPost {
  const p = item as Record<string, unknown>;
  const facebookPostId = String(p.facebookPostId ?? p.id ?? "");
  if (!facebookPostId) {
    throw new Error("MCP post missing id / facebookPostId");
  }

  const reactionsCount = Number(p.reactionsCount ?? p.reactions ?? 0) || 0;
  const commentsCount = Number(p.commentsCount ?? p.comments ?? 0) || 0;
  const sharesCount = Number(p.sharesCount ?? p.shares ?? 0) || 0;
  const engagementScore =
    Number(p.engagementScore) ||
    reactionsCount + commentsCount * 2 + sharesCount * 3;

  const remoteImages = Array.isArray(p.remoteImages)
    ? (p.remoteImages as unknown[]).map(String)
    : Array.isArray(p.images)
      ? (p.images as unknown[]).map(String)
      : [];

  return {
    facebookPostId,
    message: String(p.message ?? p.content ?? "").trim(),
    publishedAt: String(p.publishedAt ?? p.created_time ?? new Date().toISOString()),
    updatedAt: String(
      p.updatedAt ?? p.updated_time ?? p.publishedAt ?? p.created_time ?? ""
    ),
    facebookUrl: String(
      p.facebookUrl ?? p.permalink_url ?? `https://www.facebook.com/${facebookPostId}`
    ),
    remoteImages: remoteImages.slice(0, maxImages),
    engagementScore,
    reactionsCount,
    commentsCount,
    sharesCount,
    statusType:
      typeof p.statusType === "string"
        ? p.statusType
        : typeof p.status_type === "string"
          ? p.status_type
          : undefined,
  };
}
