import { NextResponse } from "next/server";
import {
  adminCookieMaxAge,
  adminCookieName,
  passwordsMatch,
  signSession,
} from "@/lib/admin/session";

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD?.trim() || "";
  if (!expected) {
    return NextResponse.json(
      { error: "Host chưa đặt ADMIN_PASSWORD" },
      { status: 503 }
    );
  }
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = String(body.password ?? "");
  if (!(await passwordsMatch(password, expected))) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }
  const token = await signSession(expected);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminCookieMaxAge(),
  });
  return response;
}
