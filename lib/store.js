import fs from "fs/promises";
import path from "path";
import members from "../data/members.json";
import street from "../data/street.json";
import territory from "../data/territory.json";

const bundled = { members, street, territory };

// Storage:
// - Production (Vercel / Netlify): Supabase. Data lives in the `pf_data` table and
//   photos in the public `pf-uploads` bucket, so saving in /admin never triggers a redeploy.
// - Local dev without Supabase env vars: files are written to data/ and public/uploads/.

const BUCKET = "pf-uploads";

function sb() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export const storageMode = () => (sb() ? "supabase" : process.env.NODE_ENV === "production" ? "none" : "local");

function headers(s, extra = {}) {
  // New-style keys (sb_secret_...) are not JWTs, so they go in `apikey` only.
  // Legacy service_role keys are JWTs and also need the Bearer header.
  const auth = s.key.startsWith("sb_") ? {} : { Authorization: `Bearer ${s.key}` };
  return { apikey: s.key, ...auth, ...extra };
}

export async function readJSON(name) {
  const s = sb();
  if (s) {
    const r = await fetch(`${s.url}/rest/v1/pf_data?name=eq.${encodeURIComponent(name)}&select=data`, {
      cache: "no-store",
      headers: headers(s),
    });
    if (!r.ok) throw new Error(`Supabase read failed (${r.status})`);
    const rows = await r.json();
    return rows.length ? rows[0].data : bundled[name];
  }
  if (storageMode() === "local") {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "data", `${name}.json`), "utf8"));
  }
  return bundled[name];
}

function assertWritable() {
  if (storageMode() === "none") {
    throw new Error("Saving is off. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the host environment variables.");
  }
}

export async function writeJSON(name, data) {
  assertWritable();
  const s = sb();
  if (s) {
    const r = await fetch(`${s.url}/rest/v1/pf_data?on_conflict=name`, {
      method: "POST",
      cache: "no-store",
      headers: headers(s, {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify({ name, data, updated_at: new Date().toISOString() }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(`Supabase write failed (${r.status}) ${j.message || ""}`.trim());
    }
    return;
  }
  const full = path.join(process.cwd(), "data", `${name}.json`);
  await fs.writeFile(full, JSON.stringify(data, null, 2) + "\n");
}

// Saves a photo and returns the path / URL the site should use to show it.
export async function writePhoto(file, buf) {
  assertWritable();
  const s = sb();
  if (s) {
    const r = await fetch(`${s.url}/storage/v1/object/${BUCKET}/${encodeURIComponent(file)}`, {
      method: "POST",
      cache: "no-store",
      headers: headers(s, { "Content-Type": "image/jpeg", "x-upsert": "true" }),
      body: buf,
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(`Photo upload failed (${r.status}) ${j.message || j.error || ""}`.trim());
    }
    return `${s.url}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(file)}`;
  }
  const full = path.join(process.cwd(), "public", "uploads", file);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buf);
  return `/uploads/${file}`;
}
