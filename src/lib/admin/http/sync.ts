import { NextResponse } from "next/server";
import { dispatchFacebookSync, latestFacebookWorkflowRun, storageMode } from "@/lib/admin/github";

export async function GET() {
  try {
    let mode: "github" | "local" | "unconfigured" = "unconfigured";
    try {
      mode = storageMode();
    } catch {
      mode = "unconfigured";
    }
    if (mode !== "github") {
      return NextResponse.json({
        run: null,
        limitation:
          "Chưa có GITHUB_ADMIN_TOKEN nên không đọc được trạng thái workflow trên GitHub.",
      });
    }
    const run = await latestFacebookWorkflowRun();
    return NextResponse.json({
      run,
      limitation: run
        ? "Đây là lần chạy gần nhất GitHub trả về. Nút đồng bộ chỉ xác nhận đã gửi lệnh, không xác nhận Action đã chạy xong."
        : "GitHub không trả về lần chạy nào của workflow sync-facebook.yml.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không đọc được trạng thái";
    return NextResponse.json({ run: null, error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      lookbackMonths?: number;
    };
    const months = Number(body.lookbackMonths ?? 4);
    if (!Number.isInteger(months) || months < 1 || months > 24) {
      return NextResponse.json({ error: "Số tháng phải từ 1 đến 24" }, { status: 400 });
    }
    const result = await dispatchFacebookSync(months);
    return NextResponse.json({
      ...result,
      note: "Đã gửi lệnh đồng bộ. Bài mới xuất hiện trên web sau khi Action chạy xong và host build lại.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không đồng bộ được";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
