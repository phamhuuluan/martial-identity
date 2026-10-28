"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fieldClass } from "./ui";

export function LoginForm({
  configured,
  nextPath,
}: {
  configured: boolean;
  nextPath?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const requested = nextPath ?? params.get("next") ?? "";
  const destination =
    requested.startsWith("/admin") && !requested.startsWith("//") ? requested : "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="adm-login">
      <form
        className="adm-login-card"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError(null);
          try {
            const response = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ password }),
            });
            const body = (await response.json()) as { error?: string };
            if (!response.ok) {
              setError(body.error || "Không đăng nhập được");
              return;
            }
            router.replace(destination);
            router.refresh();
          } catch {
            setError("Không kết nối được máy chủ");
          } finally {
            setPending(false);
          }
        }}
      >
        <p className="adm-muted">Phật Quang Quyền</p>
        <h1>Đăng nhập quản trị</h1>
        {configured ? (
          <label className="adm-field" style={{ marginTop: 20 }}>
            <span className="adm-label">Mật khẩu</span>
            <input
              className={fieldClass}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        ) : (
          <p className="adm-note is-warning" style={{ marginTop: 20 }}>
            Host chưa đặt ADMIN_PASSWORD nên chưa đăng nhập được.
          </p>
        )}
        {error ? <p className="adm-note is-error" style={{ marginTop: 12 }}>{error}</p> : null}
        <button className="btn btn-primary" style={{ marginTop: 16 }} type="submit" disabled={!configured || pending}>
          {pending ? "Đang vào…" : "Vào trang quản trị"}
        </button>
      </form>
    </div>
  );
}
