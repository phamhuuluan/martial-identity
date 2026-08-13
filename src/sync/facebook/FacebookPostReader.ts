import type { NormalizedFacebookPost } from "./types";

/**
 * Abstraction for reading Fanpage posts during manual sync only.
 * Website runtime must never call this.
 */
export interface FacebookPostReader {
  readonly sourceName: "mcp" | "graph";
  fetchPostsSince(since: Date): Promise<NormalizedFacebookPost[]>;
  dispose?(): Promise<void>;
}
