import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { storageMode } from "../../../lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = isAdmin();
  return NextResponse.json({ admin, storage: admin ? storageMode() : undefined });
}
