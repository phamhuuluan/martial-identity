"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, type NewsCategory } from "@/domain/news";
import { slugifyNewsTitle, validateNewsDraft, type NewsDraft } from "@/lib/admin/newsDocument";
import { ConfirmDialog } from "./dialog";
import { MarkdownPreview } from "./MarkdownPreview";
import {
  Area,
  BindFieldErrors,
  Field,
  ImageField,
  ImageListField,
  LineList,
  SaveBar,
  saveResultMessage,
  SelectField,
  useDraft,
  type SaveTone,
} from "./ui";

function emptyDraft(): NewsDraft {
  return {
    title: "",
    summary: "",
    date: new Date().toISOString().slice(0, 10),
    category: "activities",
    tags: [],
    facebookUrl: "",
    facebookPostId: "",
    engagementScore: 0,
    coverImage: "",
    gallery: [],
    locked: false,
    body: "",
  };
}

function prefixNewsError(message: string): string {
  if (message === "Thiếu tiêu đề") return `title: ${message}`;
  if (message.startsWith("Ngày")) return `date: ${message}`;
  if (message === "Thiếu nội dung") return `body: ${message}`;
  if (message.startsWith("Ảnh bìa")) return `coverImage: ${message}`;
  if (message.startsWith("Link Facebook")) return `facebookUrl: ${message}`;
  if (message.startsWith("Ảnh ")) return `gallery: ${message}`;
  if (message.startsWith("Chuyên mục")) return `category: ${message}`;
  return message;
}

export function NewsEditor({
  initial,
  sha,
  originalPath,
}: {
  initial?: NewsDraft;
  sha?: string;
  originalPath?: string;
}) {
  const router = useRouter();
  const editor = useDraft(initial ?? emptyDraft());
  const draft = editor.data;
  const setDraft = editor.setData;
  const [fileSha, setFileSha] = useState<string | null>(sha ?? null);
  const [path, setPath] = useState(originalPath ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<SaveTone>("success");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function filenameOf(currentPath: string, next: NewsDraft): string {
    if (currentPath) return currentPath.split("/").pop() || "";
    return `${next.date}-${slugifyNewsTitle(next.title)}.md`;
  }

  async function commit(options: {
    messageText: string;
    files: { path: string; sha: string | null; json: NewsDraft }[];
    deletions?: { path: string; sha: string }[];
  }) {
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/commit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: options.messageText,
          files: options.files,
          deletions: options.deletions ?? [],
        }),
      });
      const body = (await response.json()) as {
        error?: string;
        note?: string;
        mode?: string;
        files?: { path: string; sha: string }[];
      };
      if (!response.ok) {
        setError(body.error || "Không lưu được");
        return null;
      }
      const result = saveResultMessage(body);
      setTone(result.tone);
      setMessage(result.text);
      return body;
    } catch {
      setError("Không kết nối được máy chủ");
      return null;
    } finally {
      setPending(false);
    }
  }

  async function onSave() {
    const snapshot = draft;
    try {
      validateNewsDraft(snapshot);
    } catch (validationError) {
      const text = validationError instanceof Error ? validationError.message : "Bài viết không hợp lệ";
      setError(prefixNewsError(text));
      setMessage(null);
      return;
    }
    const filename = filenameOf(path, snapshot);
    const nextPath = `content/${snapshot.category}/${filename}`;
    const sameFile = path === nextPath;
    const result = await commit({
      messageText: path ? `Cập nhật bài ${snapshot.title}` : `Thêm bài ${snapshot.title}`,
      files: [{ path: nextPath, sha: sameFile ? fileSha : null, json: snapshot }],
      deletions: path && !sameFile && fileSha ? [{ path, sha: fileSha }] : [],
    });
    if (!result) return;
    editor.markSaved(snapshot);
    const nextSha = result.files?.find((file) => file.path === nextPath)?.sha;
    if (nextSha) setFileSha(nextSha);
    setPath(nextPath);
    if (!originalPath) {
      router.replace(`/admin/hoat-dong/sua?path=${encodeURIComponent(nextPath)}`);
    }
  }

  async function onDelete() {
    if (!path || !fileSha) return;
    const result = await commit({
      messageText: `Xóa bài ${draft.title}`,
      files: [],
      deletions: [{ path, sha: fileSha }],
    });
    if (result) router.push("/admin/hoat-dong");
  }

  return (
    <BindFieldErrors error={error}>
      <div className="adm-split">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onSave();
          }}
        >
          <div className="adm-section">
            <h2>Bài viết</h2>
            <div className="adm-section-body">
              {path ? <p className="adm-hint">{path}</p> : null}
              <Field field="title" required label="Tiêu đề" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
              <Area
                field="summary"
                optional
                label="Tóm tắt"
                value={draft.summary}
                rows={3}
                onChange={(summary) => setDraft({ ...draft, summary })}
              />
              <Field field="date" required label="Ngày" value={draft.date} hint="Định dạng YYYY-MM-DD" onChange={(date) => setDraft({ ...draft, date })} />
              <SelectField
                field="category"
                required
                label="Chuyên mục"
                value={draft.category}
                options={NEWS_CATEGORIES.map((category) => ({
                  value: category,
                  label: NEWS_CATEGORY_LABELS[category],
                }))}
                onChange={(category) => setDraft({ ...draft, category: category as NewsCategory })}
              />
              <Area field="body" required label="Nội dung" value={draft.body} rows={14} onChange={(body) => setDraft({ ...draft, body })} />
              <ImageField
                field="coverImage"
                optional
                label="Ảnh bìa"
                folder="uploads"
                frame="banner"
                value={draft.coverImage}
                hint="Bài không có ảnh bìa sẽ không hiện trong danh sách hoạt động công khai."
                onChange={(coverImage) => setDraft({ ...draft, coverImage })}
              />
              <ImageListField
                field="gallery"
                optional
                label="Ảnh thêm"
                folder="uploads"
                value={draft.gallery}
                onChange={(gallery) => setDraft({ ...draft, gallery })}
              />
              <LineList optional label="Thẻ" value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
              <Field
                field="facebookUrl"
                optional
                label="Link Facebook"
                value={draft.facebookUrl}
                onChange={(facebookUrl) => setDraft({ ...draft, facebookUrl })}
              />
              <Field
                optional
                readOnly={Boolean(initial?.facebookPostId)}
                label="Mã bài Facebook"
                value={draft.facebookPostId}
                hint="Bài tạo tay không có mã này nên lần đồng bộ không đụng tới. Bài từ Fanpage nên bật khóa nếu đã sửa tay."
                onChange={(facebookPostId) => setDraft({ ...draft, facebookPostId })}
              />
              <label className="adm-check">
                <input
                  type="checkbox"
                  checked={draft.locked}
                  onChange={(event) => setDraft({ ...draft, locked: event.target.checked })}
                />
                <span>Khóa bài — lần đồng bộ Facebook không ghi đè</span>
              </label>
            </div>
          </div>
          <SaveBar
            pending={pending}
            message={message}
            tone={tone}
            error={error}
            dirty={editor.dirty}
            onReset={editor.reset}
            onSave={() => void onSave()}
            extra={
              path ? (
                <button type="button" className="btn btn-outline" disabled={pending} onClick={() => setConfirmDelete(true)}>
                  Xóa bài
                </button>
              ) : null
            }
          />
        </form>
        <MarkdownPreview
          title={draft.title}
          summary={draft.summary}
          body={draft.body}
          cover={draft.coverImage}
          gallery={draft.gallery}
        />
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Xóa bài viết"
        body="Bài sẽ bị xóa khỏi nguồn lưu hiện tại. Nếu đang ở chế độ GitHub, thao tác tạo commit xóa file. Không hoàn tác trên giao diện."
        confirmLabel="Xóa bài"
        cancelLabel="Giữ bài"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          void onDelete();
        }}
      />
    </BindFieldErrors>
  );
}
