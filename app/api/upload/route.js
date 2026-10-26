import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { writePhoto } from "../../../lib/store";
import { slugify } from "../../../lib/slug";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  const { dataUrl, name } = await req.json().catch(() => ({}));
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || "");
  if (!m) return NextResponse.json({ error: "Send a JPEG image." }, { status: 400 });
  const buf = Buffer.from(m[1], "base64");
  if (buf.length > 1_500_000) return NextResponse.json({ error: "Image too large." }, { status: 413 });
  const file = `${slugify(name) || "photo"}-${Date.now().toString(36)}.jpg`;
  try {
    const photoPath = await writePhoto(file, buf);
    return NextResponse.json({ ok: true, path: photoPath });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
