import { SyncPanel } from "@/components/admin/SyncPanel";
import { latestFacebookWorkflowRun, storageMode, type WorkflowRunSummary } from "@/lib/admin/github";

export default async function SyncAdminPage() {
  let mode: "github" | "local" | "unconfigured" = "unconfigured";
  try {
    mode = storageMode();
  } catch {
    mode = "unconfigured";
  }

  let run: WorkflowRunSummary | null = null;
  let note: string | null = null;
  if (mode === "github") {
    try {
      run = await latestFacebookWorkflowRun();
      note = run
        ? "Trạng thái bên dưới là lần chạy gần nhất GitHub trả về, không phải một kết quả giả lập."
        : "GitHub không trả về lần chạy nào của workflow này.";
    } catch (error) {
      note = error instanceof Error ? error.message : "Không đọc được trạng thái workflow.";
    }
  } else {
    note = "Chưa có GITHUB_ADMIN_TOKEN nên không kích hoạt và không đọc được workflow trên GitHub.";
  }

  return <SyncPanel enabled={mode === "github"} initialRun={run} initialNote={note} />;
}
