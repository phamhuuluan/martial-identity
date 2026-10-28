import { NextResponse } from "next/server";
import {
  ContentShapeError,
  SITE_FILE_PARSERS,
  type SiteFilePath,
} from "@/data/siteSchema";
import { commitRepoChanges, RepoConflictError } from "@/lib/admin/github";
import { isNewsMarkdownPath, isSiteJsonPath } from "@/lib/admin/paths";
import { serializeNewsMarkdown, validateNewsDraft } from "@/lib/admin/newsDocument";

const MAX_FILES = 8;

function errorResponse(error: unknown) {
  if (error instanceof RepoConflictError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
  if (error instanceof ContentShapeError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const message = error instanceof Error ? error.message : "Lỗi không xác định";
  const status = /phải|Thiếu|không hợp lệ|không được|Ngày|Chuyên|tồn tại/.test(message)
    ? 400
    : 500;
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: string;
      files?: { path?: string; sha?: string | null; json?: unknown }[];
      deletions?: { path?: string; sha?: string }[];
    };
    const message = String(body.message ?? "").trim();
    if (!message || message.length > 200) {
      return NextResponse.json({ error: "Nội dung commit không hợp lệ" }, { status: 400 });
    }
    const filesIn = Array.isArray(body.files) ? body.files : [];
    const deletionsIn = Array.isArray(body.deletions) ? body.deletions : [];
    if (filesIn.length + deletionsIn.length === 0) {
      return NextResponse.json({ error: "Không có thay đổi để lưu" }, { status: 400 });
    }
    if (filesIn.length + deletionsIn.length > MAX_FILES) {
      return NextResponse.json({ error: "Quá nhiều file trong một lần lưu" }, { status: 400 });
    }

    const files = filesIn.map((file) => {
      const path = String(file.path ?? "");
      const sha =
        file.sha === null || file.sha === undefined || file.sha === ""
          ? null
          : String(file.sha);
      let content: string;
      if (isSiteJsonPath(path)) {
        const parser = SITE_FILE_PARSERS[path as SiteFilePath] as (
          value: unknown
        ) => unknown;
        content = `${JSON.stringify(parser(file.json), null, 2)}\n`;
      } else if (isNewsMarkdownPath(path)) {
        const draft = validateNewsDraft(file.json);
        const folder = path.split("/")[1];
        if (folder !== draft.category) {
          throw new Error("Thư mục không khớp chuyên mục");
        }
        content = serializeNewsMarkdown(draft);
      } else {
        throw new Error(`Đường dẫn không được phép: ${path}`);
      }
      if (content.length > 500_000) throw new Error("Nội dung quá dài");
      return { path, sha, content };
    });

    const deletions = deletionsIn.map((file) => ({
      path: String(file.path ?? ""),
      sha: String(file.sha ?? ""),
    }));
    if (deletions.some((file) => !file.sha || !isNewsMarkdownPath(file.path))) {
      return NextResponse.json({ error: "Chỉ xóa được bài viết Markdown" }, { status: 400 });
    }

    const result = await commitRepoChanges({ message, files, deletions });
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
