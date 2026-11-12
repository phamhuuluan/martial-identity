import Link from "next/link";
import { listNewsIndex } from "@/lib/admin/newsIndex";
import { latestCommit, latestFacebookWorkflowRun, storageMode } from "@/lib/admin/github";
import { adminDashboardCards } from "@/lib/admin/routes";

function workflowLabel(status: string, conclusion: string | null): string {
  if (status === "in_progress") return "Đang chạy";
  if (status === "queued" || status === "waiting" || status === "pending" || status === "requested") {
    return "Đang chờ";
  }
  if (status === "completed" && conclusion === "success") return "Lần chạy gần nhất đã hoàn tất";
  if (status === "completed" && conclusion === "failure") return "Lần chạy gần nhất thất bại";
  if (status === "completed" && conclusion === "cancelled") return "Lần chạy gần nhất bị hủy";
  if (status === "completed") return `Đã kết thúc (${conclusion || "không rõ kết quả"})`;
  return status;
}

export default async function AdminHomePage() {
  let mode: "github" | "local" | "unconfigured" = "unconfigured";
  try {
    mode = storageMode();
  } catch {
    mode = "unconfigured";
  }

  const commit = mode === "unconfigured" ? null : await latestCommit().catch(() => null);

  let articleCount: number | null = null;
  let articleError = "";
  try {
    articleCount = (await listNewsIndex("")).length;
  } catch (error) {
    articleError = error instanceof Error ? error.message : "Không đếm được bài";
  }

  let syncLabel = "Chưa có GITHUB_ADMIN_TOKEN nên không đọc được workflow.";
  let syncUrl = "";
  if (mode === "github") {
    try {
      const run = await latestFacebookWorkflowRun();
      if (!run) {
        syncLabel = "GitHub không trả về lần chạy nào của sync-facebook.yml.";
      } else {
        syncLabel = workflowLabel(run.status, run.conclusion);
        syncUrl = run.url;
      }
    } catch (error) {
      syncLabel = error instanceof Error ? error.message : "Không đọc được trạng thái workflow.";
    }
  }

  return (
    <div className="adm-section-body">
      <div className="adm-stat-grid">
        <div className="adm-card">
          <strong>{articleCount === null ? "Không đọc được" : `${articleCount} bài`}</strong>
          <span>{articleError || "Số file Markdown trong các thư mục hoạt động."}</span>
        </div>
        <div className="adm-card">
          <strong>
            {mode === "github" ? "Commit GitHub" : mode === "local" ? "Lưu trên máy" : "Chưa cấu hình lưu"}
          </strong>
          <span>
            {commit
              ? `${commit.message || commit.sha.slice(0, 7)}${commit.date ? ` — ${commit.date.slice(0, 16).replace("T", " ")}` : ""}`
              : "Chưa đọc được commit gần nhất."}
            {commit?.url ? (
              <>
                {" "}
                <a href={commit.url} target="_blank" rel="noreferrer">
                  Xem commit
                </a>
              </>
            ) : null}
          </span>
        </div>
        <div className="adm-card">
          <strong>Fanpage</strong>
          <span>
            {syncLabel}
            {syncUrl ? (
              <>
                {" "}
                <a href={syncUrl} target="_blank" rel="noreferrer">
                  Mở Actions
                </a>
              </>
            ) : null}
          </span>
        </div>
      </div>
      <div className="adm-cards">
        {adminDashboardCards().map((card) => (
          <Link key={card.href} href={card.href} className="adm-card">
            <strong>{card.title}</strong>
            <span>{card.detail}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
