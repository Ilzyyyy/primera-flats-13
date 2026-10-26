import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";
import { readJSON, writeJSON, storageMode } from "../../../../lib/store";

export const dynamic = "force-dynamic";
const NAMES = ["members", "street", "territory"];

export async function GET(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  if (!NAMES.includes(params.name)) return NextResponse.json({ error: "Unknown data" }, { status: 404 });
  try {
    return NextResponse.json(await readJSON(params.name));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  if (!NAMES.includes(params.name)) return NextResponse.json({ error: "Unknown data" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body) || body.length > 500 || !body.every((x) => x && typeof x === "object" && !Array.isArray(x))) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  try {
    await writeJSON(params.name, body);
    return NextResponse.json({ ok: true, storage: storageMode() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
