import { NextResponse } from "next/server";
import { COOKIE_NAME, adminPassword, makeToken, safeEqual } from "../../../lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const real = adminPassword();
  if (!real) {
    return NextResponse.json({ error: "Admin password is not set on the server." }, { status: 503 });
  }
  if (typeof password !== "string" || !safeEqual(password, real)) {
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
