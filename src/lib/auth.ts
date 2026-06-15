const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_strong_secret";
export const JWT_COOKIE_NAME = "buildify_session";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function timingSafeEqual(a: string, b: string) {
  const first = new TextEncoder().encode(a);
  const second = new TextEncoder().encode(b);

  if (first.length !== second.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < first.length; i += 1) {
    result |= first[i] ^ second[i];
  }

  return result === 0;
}

async function getCryptoKey(secret: string) {
  const keyData = textEncoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function hashPassword(password: string) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(password));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function signJwt(payload: Record<string, unknown>, expiresInSeconds = 60 * 60) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const encodedHeader = base64UrlEncode(textEncoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(textEncoder.encode(JSON.stringify(fullPayload)));
  const signatureInput = textEncoder.encode(`${encodedHeader}.${encodedPayload}`);
  const key = await getCryptoKey(JWT_SECRET);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, signatureInput);
  const encodedSignature = base64UrlEncode(signatureBuffer);
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifyJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signatureInput = textEncoder.encode(`${encodedHeader}.${encodedPayload}`);
    const key = await getCryptoKey(JWT_SECRET);
    const signatureBytes = base64UrlDecode(encodedSignature);
    const verified = await crypto.subtle.verify("HMAC", key, signatureBytes, signatureInput);
    if (!verified) return null;

    const payloadText = textDecoder.decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadText) as { exp?: number } & Record<string, unknown>;

    if (!payload.exp || typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function safeCompareHash(a: string, b: string) {
  return timingSafeEqual(a, b);
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && emailPattern.test(email);
}

export function parseCookies(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, cookie) => {
    const [rawName, ...rest] = cookie.split("=");
    const name = rawName?.trim();
    const value = rest.join("=").trim();
    if (name) {
      cookies[name] = value;
    }
    return cookies;
  }, {});
}

export function getTokenFromRequest(request: Request) {
  const cookies = parseCookies(request);
  return cookies[JWT_COOKIE_NAME] || null;
}

export async function getUserFromRequest(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = await verifyJwt(token);
  if (!payload) return null;
  if (typeof payload.id !== "string" || typeof payload.email !== "string") return null;

  return {
    id: payload.id,
    email: payload.email,
    displayName: typeof payload.displayName === "string" ? payload.displayName : "",
  };
}
