const COOKIE = "pqq_admin";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function bytesToB64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToB64Url(new Uint8Array(sig));
}

function constantEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const length = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

export function adminCookieName(): string {
  return COOKIE;
}

export function adminCookieMaxAge(): number {
  return MAX_AGE_SEC;
}

export async function signSession(secret: string): Promise<string> {
  const payload = bytesToB64Url(
    new TextEncoder().encode(
      JSON.stringify({ exp: Date.now() + MAX_AGE_SEC * 1000 })
    )
  );
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifySession(
  secret: string,
  token: string | undefined
): Promise<boolean> {
  if (!secret || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(secret, payload);
  if (!constantEqual(sig, expected)) return false;
  try {
    const json = JSON.parse(new TextDecoder().decode(b64UrlToBytes(payload))) as {
      exp?: number;
    };
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}

export async function passwordsMatch(input: string, expected: string): Promise<boolean> {
  const digest = async (value: string) =>
    bytesToB64Url(
      new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))
    );
  return constantEqual(await digest(input), await digest(expected));
}
