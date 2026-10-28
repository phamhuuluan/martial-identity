import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { commitRepoChanges, RepoConflictError } from "@/lib/admin/github";

const FOLDERS = new Set(["uploads", "site", "curriculum"]);
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const folder = String(form.get("folder") ?? "uploads");
    const file = form.get("file");
    if (!FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Thư mục ảnh không hợp lệ" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Thiếu file ảnh" }, { status: 400 });
    }
    const ext = TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Chỉ nhận ảnh JPEG, PNG, WebP hoặc GIF" },
        { status: 400 }
      );
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ảnh phải nhỏ hơn 8MB" }, { status: 400 });
    }
    const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
    const repoPath = `public/images/${folder}/${name}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await commitRepoChanges({
      message: `Thêm ảnh ${name}`,
      files: [{ path: repoPath, content: bytes, sha: null }],
    });
    return NextResponse.json({ path: `/images/${folder}/${name}` });
  } catch (error) {
    if (error instanceof RepoConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Không tải được ảnh";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
