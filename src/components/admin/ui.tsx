"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ContentShapeError } from "@/data/siteSchema";
import { useUnsavedGuard } from "./dirty";
import { ImageGallery, ImagePreview, type PreviewFrame } from "./ImagePreview";

export const fieldClass = "adm-input";

type FieldError = { path: string; message: string } | null;
const FieldErrorContext = createContext<FieldError>(null);

export function BindFieldErrors({
  error,
  children,
}: {
  error: string | null;
  children: ReactNode;
}) {
  const value = useMemo<FieldError>(() => {
    if (!error) return null;
    const index = error.indexOf(": ");
    if (index <= 0) return null;
    return { path: error.slice(0, index), message: error.slice(index + 2) };
  }, [error]);
  return <FieldErrorContext.Provider value={value}>{children}</FieldErrorContext.Provider>;
}

function useFieldMessage(field?: string) {
  const ctx = useContext(FieldErrorContext);
  const ref = useRef<HTMLLabelElement>(null);
  const message = field && ctx && ctx.path === field ? ctx.message : null;
  useEffect(() => {
    if (message) ref.current?.scrollIntoView({ block: "center" });
  }, [message]);
  return { ref, message };
}

function LabelText({
  label,
  required,
  optional,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <span className="adm-label">
      {label}
      {required ? <span className="adm-required">*</span> : null}
      {optional ? <span className="adm-optional">Không bắt buộc</span> : null}
    </span>
  );
}

export function Field({
  label,
  value,
  onChange,
  hint,
  field,
  required,
  optional,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  field?: string;
  required?: boolean;
  optional?: boolean;
  readOnly?: boolean;
}) {
  const { ref, message } = useFieldMessage(field);
  return (
    <label className="adm-field" ref={ref} data-field={field}>
      <LabelText label={label} required={required} optional={optional} />
      <input
        className={`adm-input${message ? " is-invalid" : ""}`}
        value={value}
        readOnly={readOnly}
        aria-invalid={message ? true : undefined}
        aria-required={required || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="adm-hint">{hint}</span> : null}
      {message ? <span className="adm-error">{message}</span> : null}
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
  hint,
  field,
  required,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  field?: string;
  required?: boolean;
  optional?: boolean;
}) {
  const { ref, message } = useFieldMessage(field);
  return (
    <label className="adm-field" ref={ref} data-field={field}>
      <LabelText label={label} required={required} optional={optional} />
      <textarea
        className={`adm-input${message ? " is-invalid" : ""}`}
        rows={rows}
        value={value}
        aria-invalid={message ? true : undefined}
        aria-required={required || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="adm-hint">{hint}</span> : null}
      {message ? <span className="adm-error">{message}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  field,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  field?: string;
  required?: boolean;
}) {
  const { ref, message } = useFieldMessage(field);
  return (
    <label className="adm-field" ref={ref}>
      <LabelText label={label} required={required} />
      <select
        className={`adm-input${message ? " is-invalid" : ""}`}
        value={value}
        aria-invalid={message ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {message ? <span className="adm-error">{message}</span> : null}
    </label>
  );
}

export function LineList({
  label,
  value,
  onChange,
  hint = "Mỗi dòng một mục",
  field,
  required,
  optional,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  field?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <Area
      label={label}
      field={field}
      required={required}
      optional={optional}
      value={value.join("\n")}
      rows={Math.min(10, Math.max(3, value.length + 1))}
      hint={hint}
      onChange={(next) => onChange(next.split("\n"))}
    />
  );
}

export type SaveTone = "success" | "warning";

export function saveResultMessage(body: { note?: string; mode?: string }): {
  tone: SaveTone;
  text: string;
} {
  if (body.mode === "local") {
    return {
      tone: "warning",
      text:
        body.note ||
        "Đã ghi trên máy. Chưa có GITHUB_ADMIN_TOKEN nên chưa commit lên GitHub. Website công khai chưa đổi.",
    };
  }
  if (body.mode === "github") {
    return {
      tone: "success",
      text: body.note || "Đã commit lên GitHub. Website công khai đổi sau khi host build xong.",
    };
  }
  return { tone: "success", text: body.note || "Đã lưu." };
}

export function SaveBar({
  pending,
  message,
  tone = "success",
  error,
  onSave,
  dirty = false,
  onReset,
  extra,
}: {
  pending: boolean;
  message: string | null;
  tone?: SaveTone;
  error: string | null;
  onSave: () => void;
  dirty?: boolean;
  onReset?: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="adm-savebar">
      <button type="button" className="btn btn-primary" disabled={pending} onClick={onSave}>
        {pending ? "Đang lưu…" : "Lưu"}
      </button>
      {onReset ? (
        <button type="button" className="btn btn-outline" disabled={pending || !dirty} onClick={onReset}>
          Hủy thay đổi
        </button>
      ) : null}
      {extra}
      {dirty ? <span className="adm-dirty">Có chỉnh sửa chưa lưu</span> : null}
      {message ? <p className={`adm-note is-${tone}`}>{message}</p> : null}
      {error ? <p className="adm-note is-error">{error}</p> : null}
    </div>
  );
}

export function useRepoSave(
  path: string,
  initialSha: string,
  parse?: (value: unknown) => unknown
) {
  const [sha, setSha] = useState(initialSha);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<SaveTone>("success");
  const [error, setError] = useState<string | null>(null);

  async function saveJson(data: unknown, commitMessage: string): Promise<boolean> {
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      if (parse) parse(data);
    } catch (parseError) {
      const text =
        parseError instanceof ContentShapeError || parseError instanceof Error
          ? parseError.message
          : "Dữ liệu không hợp lệ";
      setError(text);
      setPending(false);
      return false;
    }
    try {
      const response = await fetch("/api/admin/commit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: commitMessage,
          files: [{ path, sha, json: data }],
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
        return false;
      }
      const next = body.files?.find((file) => file.path === path);
      if (next?.sha) setSha(next.sha);
      const result = saveResultMessage(body);
      setTone(result.tone);
      setMessage(result.text);
      return true;
    } catch {
      setError("Không kết nối được máy chủ");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { saveJson, pending, message, tone, error };
}

export function useDraft<T>(initial: T) {
  const [data, setData] = useState(initial);
  const saved = useRef(JSON.stringify(initial));
  const [version, setVersion] = useState(0);
  const dirty = version >= 0 && JSON.stringify(data) !== saved.current;
  useUnsavedGuard(dirty);

  function reset() {
    setData(JSON.parse(saved.current) as T);
  }

  function markSaved(snapshot: T) {
    saved.current = JSON.stringify(snapshot);
    setVersion((current) => current + 1);
  }

  return { data, setData, dirty, reset, markSaved };
}

export function useContentForm<T>(options: {
  initial: T;
  sha: string;
  path: string;
  message: string;
  parse: (value: unknown) => unknown;
}) {
  const draft = useDraft(options.initial);
  const save = useRepoSave(options.path, options.sha, options.parse);

  async function onSave() {
    const snapshot = draft.data;
    const ok = await save.saveJson(snapshot, options.message);
    if (ok) draft.markSaved(snapshot);
  }

  return { ...draft, save, onSave };
}

export function ImageField({
  label,
  value,
  folder,
  onChange,
  field,
  required,
  optional,
  frame = "wide",
  hint,
}: {
  label: string;
  value: string;
  folder: "uploads" | "site" | "curriculum";
  onChange: (value: string) => void;
  field?: string;
  required?: boolean;
  optional?: boolean;
  frame?: PreviewFrame;
  hint?: string;
}) {
  const { ref, message } = useFieldMessage(field);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<{ url: string; path: string | null } | null>(null);
  const previewUrl = uploadPreview?.url ?? null;

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (uploadPreview?.path && uploadPreview.path === value) setUploadPreview(null);
  }, [uploadPreview, value]);

  const showingUpload = Boolean(uploadPreview && uploadPreview.path !== value);

  return (
    <div className="adm-image-field">
      <label className="adm-field" ref={ref} data-field={field}>
        <LabelText label={label} required={required} optional={optional} />
        <input
          className={`adm-input${message ? " is-invalid" : ""}`}
          value={value}
          spellCheck={false}
          aria-invalid={message ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          ref={fileRef}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const localUrl = URL.createObjectURL(file);
            setUploadPreview({ url: localUrl, path: null });
            setBusy(true);
            setError(null);
            try {
              const body = new FormData();
              body.set("file", file);
              body.set("folder", folder);
              const response = await fetch("/api/admin/upload", { method: "POST", body });
              const data = (await response.json()) as { path?: string; error?: string };
              if (!response.ok || !data.path) {
                throw new Error(data.error || "Không tải được ảnh");
              }
              setUploadPreview({ url: localUrl, path: data.path });
              onChange(data.path);
            } catch (uploadError) {
              setUploadPreview(null);
              setError(
                uploadError instanceof Error
                  ? `${uploadError.message} Đường dẫn hiện tại được giữ nguyên.`
                  : "Không tải được ảnh. Đường dẫn hiện tại được giữ nguyên."
              );
            } finally {
              setBusy(false);
            }
          }}
        />
        <button
          type="button"
          className="btn btn-outline"
          style={{ justifySelf: "start" }}
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "Đang tải ảnh…" : "Tải ảnh lên"}
        </button>
        {hint ? <span className="adm-hint">{hint}</span> : null}
        {busy ? <span className="adm-hint">Ảnh vừa chọn chỉ là bản xem trước cho đến khi tải lên xong.</span> : null}
        {error ? <span className="adm-error">{error}</span> : null}
        {message ? <span className="adm-error">{message}</span> : null}
      </label>
      <ImagePreview value={showingUpload && uploadPreview ? uploadPreview.url : value} frame={frame} />
    </div>
  );
}

export function ImageListField({
  label,
  value,
  folder,
  onChange,
  field,
  optional,
  hint = "Mỗi dòng một đường dẫn. Thứ tự dòng là thứ tự được lưu.",
}: {
  label: string;
  value: string[];
  folder?: "uploads" | "site" | "curriculum";
  onChange: (value: string[]) => void;
  field?: string;
  optional?: boolean;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div className="adm-field">
      <LineList
        label={label}
        value={value}
        field={field}
        optional={optional}
        hint={hint}
        onChange={onChange}
      />
      {folder ? (
        <>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setBusy(true);
              setError(null);
              try {
                const body = new FormData();
                body.set("file", file);
                body.set("folder", folder);
                const response = await fetch("/api/admin/upload", { method: "POST", body });
                const data = (await response.json()) as { path?: string; error?: string };
                if (!response.ok || !data.path) throw new Error(data.error || "Không tải được ảnh");
                onChange([...value.map((item) => item.trim()).filter(Boolean), data.path]);
              } catch (uploadError) {
                setError(uploadError instanceof Error ? uploadError.message : "Không tải được ảnh");
              } finally {
                setBusy(false);
              }
            }}
          />
          <button
            type="button"
            className="btn btn-outline"
            style={{ justifySelf: "start" }}
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "Đang tải ảnh…" : "Thêm ảnh tải lên"}
          </button>
        </>
      ) : null}
      {error ? <span className="adm-error">{error}</span> : null}
      <div className="adm-gallery">
        {value.map((item, index) =>
          item.trim() ? (
            <div key={`${item}-${index}`} className="adm-gallery-item">
              <ImagePreview value={item} frame="thumb" />
              <div className="adm-gallery-tools">
                <button
                  type="button"
                  className="adm-icon-btn"
                  aria-label="Đưa ảnh lên trước"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  aria-label="Đưa ảnh xuống sau"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>
              </div>
            </div>
          ) : null
        )}
      </div>
      {value.every((item) => !item.trim()) ? <ImageGallery paths={[]} /> : null}
    </div>
  );
}

export function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="adm-section">
      <h2>{title}</h2>
      <div className="adm-section-body">{children}</div>
    </section>
  );
}
