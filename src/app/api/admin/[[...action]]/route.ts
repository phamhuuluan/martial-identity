import { NextResponse } from "next/server";
import { POST as commit } from "@/lib/admin/http/commit";
import { POST as login } from "@/lib/admin/http/login";
import { POST as logout } from "@/lib/admin/http/logout";
import { GET as syncStatus, POST as syncDispatch } from "@/lib/admin/http/sync";
import { POST as upload } from "@/lib/admin/http/upload";

type Context = { params: Promise<{ action?: string[] }> };

async function actionName(context: Context): Promise<string> {
  const { action = [] } = await context.params;
  return action.join("/");
}

export async function GET(_request: Request, context: Context) {
  if ((await actionName(context)) === "sync") return syncStatus();
  return NextResponse.json({ error: "Không có đường dẫn này" }, { status: 404 });
}

export async function POST(request: Request, context: Context) {
  const action = await actionName(context);
  if (action === "login") return login(request);
  if (action === "logout") return logout();
  if (action === "upload") return upload(request);
  if (action === "commit") return commit(request);
  if (action === "sync") return syncDispatch(request);
  return NextResponse.json({ error: "Không có đường dẫn này" }, { status: 404 });
}
