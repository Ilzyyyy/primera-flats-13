import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "pf_admin";
const dev = process.env.NODE_ENV !== "production";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || (dev ? "pf13admin" : "");
}

function secret() {
  return process.env.ADMIN_SECRET || adminPassword();
}

export function makeToken() {
  return crypto.createHmac("sha256", secret()).update("pf13-admin").digest("hex");
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function isAdmin() {
  if (!secret()) return false;
  const c = cookies().get(COOKIE_NAME)?.value;
  return !!c && safeEqual(c, makeToken());
}
