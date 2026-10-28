"use client";

import { useState } from "react";
import type { WorkflowRunSummary } from "@/lib/admin/github";

function statusText(run: WorkflowRunSummary): string {
  if (run.status === "queued" || run.status === "waiting" || run.status === "requested" || run.status === "pending") {
    return "Đang chờ trên GitHub";
  }
  if (run.status === "in_progress") return "Đang chạy";
  if (run.status === "completed" && run.conclusion === "success") return "Lần chạy gần nhất đã hoàn tất";
  if (run.status === "completed" && run.conclusion === "failure") return "Lần chạy gần nhất thất bại";
  if (run.status === "completed" && run.conclusion === "cancelled") return "Lần chạy gần nhất bị hủy";
  if (run.status === "completed") return `Lần chạy gần nhất đã kết thúc (${run.conclusion || "không rõ kết quả"})`;
  return `GitHub trả về trạng thái: ${run.status}`;
}

export function SyncPanel({
  enabled,
  initialRun,
  initialNote,
}: {
  enabled: boolean;
  initialRun: WorkflowRunSummary | null;
  initialNote: string | null;
}) {
  const [months, setMonths] = useState(4);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [run, setRun] = useState<WorkflowRunSummary | null>(initialRun);
  const [note, setNote] = useState<string | null>(initialNote);
  const [refreshing, setRefreshing] = useState(false);

  async function refreshStatus() {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/sync");
      const body = (await response.json()) as {
        run?: WorkflowRunSummary | null;
        limitation?: string;
        error?: string;
      };
      if (!response.ok) {
        setNote(body.error || "Không đọc được trạng thái workflow.");
        return;
      }
      setRun(body.run ?? null);
      setNote(body.limitation || null);
    } catch {
      setNote("Không kết nối được máy chủ để đọc trạng thái workflow.");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <section className="adm-section">
      <h2>Đồng bộ Fanpage</h2>
      <div className="adm-section-body">
        <p className="adm-hint">
          Nút này chạy workflow sync-facebook.yml: Graph API và bộ phân loại sẵn có, rồi commit bài mới.
          Không gọi mô hình ngôn ngữ ngoài. Bài khóa và bài tạo tay không có mã Facebook được giữ theo script hiện tại.
          Website công khai đổi sau khi Action chạy xong và host build lại.
        </p>
        <label className="adm-field">
          <span className="adm-label">Số tháng lấy bài (1–24)</span>
          <input
            className="adm-input"
            style={{ maxWidth: 120 }}
            type="number"
            min={1}
            max={24}
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
          />
        </label>
        <div className="adm-toolbar" style={{ marginTop: 0 }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!enabled || pending}
            onClick={async () => {
              setPending(true);
              setError(null);
              setMessage(null);
              try {
                const response = await fetch("/api/admin/sync", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ lookbackMonths: months }),
                });
                const body = (await response.json()) as { error?: string; note?: string; url?: string };
                if (!response.ok) {
                  setError(body.error || "Không gửi được lệnh");
                  return;
                }
                setMessage(
                  body.note ||
                    "Đã gửi lệnh kích hoạt workflow. Chưa có xác nhận Action đã chạy xong."
                );
                setUrl(body.url || null);
                await refreshStatus();
              } catch {
                setError("Không kết nối được máy chủ");
              } finally {
                setPending(false);
              }
            }}
          >
            {pending ? "Đang gửi lệnh…" : "Đồng bộ Fanpage"}
          </button>
          <button type="button" className="btn btn-outline" disabled={refreshing} onClick={() => void refreshStatus()}>
            {refreshing ? "Đang đọc…" : "Đọc trạng thái"}
          </button>
        </div>
        {!enabled ? (
          <p className="adm-note is-warning">
            Cần GITHUB_ADMIN_TOKEN trên host thì nút này mới kích hoạt được Action. Chưa có trạng thái workflow để hiển thị.
          </p>
        ) : null}
        {run ? (
          <p className="adm-note">
            {statusText(run)}
            {run.updatedAt ? ` — ${run.updatedAt.slice(0, 16).replace("T", " ")}` : ""}
            {run.url ? (
              <>
                {" "}
                <a href={run.url} target="_blank" rel="noreferrer">
                  Mở trên GitHub Actions
                </a>
              </>
            ) : null}
          </p>
        ) : null}
        {note ? <p className="adm-hint">{note}</p> : null}
        {message ? <p className="adm-note is-warning">{message}</p> : null}
        {url ? (
          <p className="adm-hint">
            <a href={url} target="_blank" rel="noreferrer">
              Xem workflow trên GitHub Actions
            </a>
          </p>
        ) : null}
        {error ? <p className="adm-note is-error">{error}</p> : null}
      </div>
    </section>
  );
}
