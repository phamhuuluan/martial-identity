import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { isAllowedRepoPath } from "./paths";

const execFileAsync = promisify(execFile);

export class RepoConflictError extends Error {
  constructor(message = "Nội dung trên main đã đổi. Tải lại trang rồi lưu lại.") {
    super(message);
    this.name = "RepoConflictError";
  }
}

export type RepoTextFile = {
  path: string;
  content: string;
  sha: string;
};

export type RepoWrite = {
  path: string;
  content: string | Buffer;
  /** Blob sha from the last read. Null when creating a new file. */
  sha: string | null;
};

export type RepoDelete = {
  path: string;
  sha: string;
};

export type CommitResult = {
  mode: "github" | "local";
  commitSha: string | null;
  commitUrl: string | null;
  files: { path: string; sha: string }[];
  note: string;
};

type GitHubConfig = {
  token: string;
  repo: string;
  branch: string;
};

type GitIdentity = {
  name: string;
  email: string;
  date: string;
};

function githubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_ADMIN_TOKEN?.trim() || "";
  if (!token) return null;
  return {
    token,
    repo: process.env.GITHUB_REPO?.trim() || "phamhuuluan/martial-identity",
    branch: process.env.GITHUB_BRANCH?.trim() || "main",
  };
}

/** Author Vercel đối chiếu với tài khoản Hobby. Email phải đã xác minh trên GitHub. */
function commitIdentity(): GitIdentity | null {
  const email = process.env.GITHUB_COMMIT_EMAIL?.trim() || "";
  if (!email) return null;
  return {
    name: process.env.GITHUB_COMMIT_NAME?.trim() || "luan16",
    email,
    date: new Date().toISOString(),
  };
}

export function storageMode(): "github" | "local" {
  if (githubConfig()) return "github";
  if (process.env.NODE_ENV !== "production") return "local";
  throw new Error("Thiếu GITHUB_ADMIN_TOKEN trên host.");
}

function assertPath(relPath: string) {
  if (!isAllowedRepoPath(relPath)) {
    throw new Error(`Đường dẫn không được phép: ${relPath}`);
  }
}

function localAbs(relPath: string): string {
  const abs = path.resolve(process.cwd(), relPath);
  const root = path.resolve(process.cwd());
  if (!abs.startsWith(`${root}${path.sep}`)) {
    throw new Error("Đường dẫn không hợp lệ");
  }
  return abs;
}

function hashBuffer(buf: Buffer): string {
  return createHash("sha1").update(buf).digest("hex");
}

async function githubFetch(pathname: string, init?: RequestInit): Promise<Response> {
  const config = githubConfig();
  if (!config) throw new Error("Thiếu GITHUB_ADMIN_TOKEN");
  return fetch(`https://api.github.com${pathname}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "phat-quang-quyen-admin",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
}

async function readGithubFile(relPath: string): Promise<RepoTextFile | null> {
  const config = githubConfig();
  if (!config) throw new Error("Thiếu GITHUB_ADMIN_TOKEN");
  const res = await githubFetch(
    `/repos/${config.repo}/contents/${encodePath(relPath)}?ref=${encodeURIComponent(config.branch)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub không đọc được ${relPath} (${res.status})`);
  }
  const data = (await res.json()) as {
    type?: string;
    sha?: string;
    content?: string;
    encoding?: string;
  };
  if (data.type !== "file" || !data.sha || !data.content) {
    throw new Error(`Không đọc được nội dung ${relPath}`);
  }
  const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  return { path: relPath, content, sha: data.sha };
}

async function readLocalFile(relPath: string): Promise<RepoTextFile | null> {
  try {
    const buf = await fs.readFile(localAbs(relPath));
    return { path: relPath, content: buf.toString("utf8"), sha: hashBuffer(buf) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function readRepoFile(relPath: string): Promise<RepoTextFile | null> {
  assertPath(relPath);
  if (storageMode() === "github") return readGithubFile(relPath);
  return readLocalFile(relPath);
}

export async function readRepoFileOrThrow(relPath: string): Promise<RepoTextFile> {
  const file = await readRepoFile(relPath);
  if (!file) throw new Error(`Không thấy ${relPath}`);
  return file;
}

function encodePath(relPath: string): string {
  return relPath.split("/").map(encodeURIComponent).join("/");
}

async function currentSha(relPath: string): Promise<string | null> {
  if (storageMode() === "github") {
    const file = await readGithubFile(relPath);
    return file?.sha ?? null;
  }
  const file = await readLocalFile(relPath);
  return file?.sha ?? null;
}

async function assertExpectedSha(relPath: string, expected: string | null) {
  const actual = await currentSha(relPath);
  if (expected === null) {
    if (actual !== null) throw new RepoConflictError(`${relPath} đã tồn tại. Tải lại trang.`);
    return;
  }
  if (actual !== expected) throw new RepoConflictError();
}

export async function commitRepoChanges(options: {
  message: string;
  files?: RepoWrite[];
  deletions?: RepoDelete[];
}): Promise<CommitResult> {
  const files = options.files ?? [];
  const deletions = options.deletions ?? [];
  if (!options.message.trim()) throw new Error("Thiếu nội dung commit");
  if (files.length === 0 && deletions.length === 0) {
    throw new Error("Không có thay đổi để lưu");
  }
  for (const file of files) assertPath(file.path);
  for (const file of deletions) assertPath(file.path);

  for (const file of files) await assertExpectedSha(file.path, file.sha);
  for (const file of deletions) await assertExpectedSha(file.path, file.sha);

  if (storageMode() === "local") return commitLocal(options.message, files, deletions);
  return commitGitHub(options.message, files, deletions);
}

async function commitLocal(
  message: string,
  files: RepoWrite[],
  deletions: RepoDelete[]
): Promise<CommitResult> {
  const written: { path: string; sha: string }[] = [];
  for (const file of files) {
    const abs = localAbs(file.path);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    const buf = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, "utf8");
    await fs.writeFile(abs, buf);
    written.push({ path: file.path, sha: hashBuffer(buf) });
  }
  for (const file of deletions) {
    await fs.rm(localAbs(file.path), { force: true });
  }
  return {
    mode: "local",
    commitSha: null,
    commitUrl: null,
    files: written,
    note: `Đã ghi trên máy (${message}). Chưa có GITHUB_ADMIN_TOKEN nên chưa commit lên GitHub.`,
  };
}

async function commitGitHub(
  message: string,
  files: RepoWrite[],
  deletions: RepoDelete[]
): Promise<CommitResult> {
  const config = githubConfig();
  if (!config) throw new Error("Thiếu GITHUB_ADMIN_TOKEN");

  const refRes = await githubFetch(
    `/repos/${config.repo}/git/ref/heads/${encodeURIComponent(config.branch)}`
  );
  if (!refRes.ok) throw new Error(`Không đọc được nhánh ${config.branch}`);
  const ref = (await refRes.json()) as { object?: { sha?: string } };
  const parentSha = ref.object?.sha;
  if (!parentSha) throw new Error("Không thấy commit hiện tại");

  const commitRes = await githubFetch(`/repos/${config.repo}/git/commits/${parentSha}`);
  if (!commitRes.ok) throw new Error("Không đọc được cây git");
  const parent = (await commitRes.json()) as { tree?: { sha?: string } };
  const baseTree = parent.tree?.sha;
  if (!baseTree) throw new Error("Không thấy cây git");

  const tree: { path: string; mode: "100644"; type: "blob"; sha: string | null }[] = [];
  const written: { path: string; sha: string }[] = [];

  for (const file of files) {
    const buf = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, "utf8");
    const blobRes = await githubFetch(`/repos/${config.repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: buf.toString("base64"), encoding: "base64" }),
    });
    if (!blobRes.ok) throw new Error(`Không tạo được blob cho ${file.path}`);
    const blob = (await blobRes.json()) as { sha?: string };
    if (!blob.sha) throw new Error(`GitHub không trả sha cho ${file.path}`);
    tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    written.push({ path: file.path, sha: blob.sha });
  }

  for (const file of deletions) {
    tree.push({ path: file.path, mode: "100644", type: "blob", sha: null });
  }

  const treeRes = await githubFetch(`/repos/${config.repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });
  if (!treeRes.ok) throw new Error("Không tạo được cây git");
  const nextTree = (await treeRes.json()) as { sha?: string };
  if (!nextTree.sha) throw new Error("Cây git thiếu sha");

  const identity = commitIdentity();
  const newCommitRes = await githubFetch(`/repos/${config.repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: nextTree.sha,
      parents: [parentSha],
      ...(identity ? { author: identity, committer: identity } : {}),
    }),
  });
  if (!newCommitRes.ok) throw new Error("Không tạo được commit");
  const newCommit = (await newCommitRes.json()) as { sha?: string; html_url?: string };
  if (!newCommit.sha) throw new Error("Commit thiếu sha");

  const updateRes = await githubFetch(
    `/repos/${config.repo}/git/refs/heads/${encodeURIComponent(config.branch)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ sha: newCommit.sha }),
    }
  );
  if (!updateRes.ok) throw new RepoConflictError();

  return {
    mode: "github",
    commitSha: newCommit.sha,
    commitUrl: newCommit.html_url ?? `https://github.com/${config.repo}/commit/${newCommit.sha}`,
    files: written,
    note: "Đã commit lên main. Website cập nhật sau khi build xong.",
  };
}

export type CommitSummary = {
  sha: string;
  message: string;
  url: string;
  date: string;
};

export async function latestCommit(): Promise<CommitSummary | null> {
  if (storageMode() === "local") {
    try {
      const { stdout } = await execFileAsync("git", ["log", "-1", "--format=%H%n%s%n%cI"], {
        cwd: process.cwd(),
      });
      const [sha, message, date] = stdout.trim().split("\n");
      if (!sha) return null;
      return {
        sha,
        message: message || "",
        date: date || "",
        url: "",
      };
    } catch {
      return null;
    }
  }
  const config = githubConfig();
  if (!config) return null;
  const res = await githubFetch(
    `/repos/${config.repo}/commits/${encodeURIComponent(config.branch)}`
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    sha?: string;
    html_url?: string;
    commit?: { message?: string; committer?: { date?: string } };
  };
  if (!data.sha) return null;
  return {
    sha: data.sha,
    message: data.commit?.message?.split("\n")[0] || "",
    url: data.html_url || "",
    date: data.commit?.committer?.date || "",
  };
}

export async function listRepoDir(relDir: string): Promise<{ path: string; name: string; sha: string }[]> {
  if (relDir.includes("..")) throw new Error("Đường dẫn không hợp lệ");
  if (storageMode() === "local") {
    const abs = localAbs(relDir);
    let names: string[] = [];
    try {
      names = await fs.readdir(abs);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    return names
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({ path: `${relDir}/${name}`, name, sha: "" }));
  }
  const config = githubConfig();
  if (!config) throw new Error("Thiếu GITHUB_ADMIN_TOKEN");
  const res = await githubFetch(
    `/repos/${config.repo}/contents/${encodePath(relDir)}?ref=${encodeURIComponent(config.branch)}`
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Không đọc được thư mục ${relDir}`);
  const data = (await res.json()) as { type?: string; path?: string; name?: string; sha?: string }[];
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item.type === "file" && item.path && item.name && item.sha)
    .map((item) => ({ path: item.path as string, name: item.name as string, sha: item.sha as string }));
}

export type WorkflowRunSummary = {
  id: number;
  status: string;
  conclusion: string | null;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export async function latestFacebookWorkflowRun(): Promise<WorkflowRunSummary | null> {
  const config = githubConfig();
  if (!config) return null;
  const res = await githubFetch(
    `/repos/${config.repo}/actions/workflows/sync-facebook.yml/runs?per_page=1`
  );
  if (!res.ok) {
    throw new Error(`Không đọc được trạng thái workflow (${res.status}).`);
  }
  const data = (await res.json()) as {
    workflow_runs?: {
      id?: number;
      status?: string;
      conclusion?: string | null;
      html_url?: string;
      name?: string;
      display_title?: string;
      created_at?: string;
      updated_at?: string;
    }[];
  };
  const run = data.workflow_runs?.[0];
  if (!run?.id || !run.status) return null;
  return {
    id: run.id,
    status: run.status,
    conclusion: run.conclusion ?? null,
    url: run.html_url || `https://github.com/${config.repo}/actions/workflows/sync-facebook.yml`,
    name: run.display_title || run.name || "Sync Facebook",
    createdAt: run.created_at || "",
    updatedAt: run.updated_at || "",
  };
}

export async function dispatchFacebookSync(lookbackMonths: number): Promise<{ url: string }> {
  const config = githubConfig();
  if (!config) {
    throw new Error("Nút đồng bộ cần GITHUB_ADMIN_TOKEN và workflow trên GitHub.");
  }
  const res = await githubFetch(
    `/repos/${config.repo}/actions/workflows/sync-facebook.yml/dispatches`,
    {
      method: "POST",
      body: JSON.stringify({
        ref: config.branch,
        inputs: { lookbackMonths: String(lookbackMonths) },
      }),
    }
  );
  if (res.status !== 204) {
    const detail = (await res.text()).slice(0, 240);
    throw new Error(`Không kích hoạt được đồng bộ (${res.status}). ${detail}`);
  }
  return {
    url: `https://github.com/${config.repo}/actions/workflows/sync-facebook.yml`,
  };
}
