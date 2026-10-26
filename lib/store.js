import fs from "fs/promises";
import path from "path";
import { bundled } from "./data";

// Storage: in dev, files are written to disk. In production (Vercel / Netlify)
// the disk is read-only, so changes are committed to the GitHub repo through
// the API and the host redeploys automatically.

const API = "https://api.github.com";

function gh() {
  const token = process.env.PF_GITHUB_TOKEN;
  if (!token) return null;
  return {
    token,
    repo: process.env.PF_GITHUB_REPO || "Ilzyyyy/primera-flats-13",
    branch: process.env.PF_GITHUB_BRANCH || "main",
  };
}

export const storageMode = () => (gh() ? "github" : process.env.NODE_ENV === "production" ? "none" : "local");

function call(g, url, opts = {}) {
  return fetch(url, {
    ...opts,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${g.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
  });
}

async function ghGet(g, rel) {
  const r = await call(g, `${API}/repos/${g.repo}/contents/${rel}?ref=${g.branch}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub read failed (${r.status})`);
  return r.json();
}

async function ghPut(g, rel, buf, message) {
  const existing = await ghGet(g, rel);
  const r = await call(g, `${API}/repos/${g.repo}/contents/${rel}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: buf.toString("base64"),
      branch: g.branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(`GitHub write failed (${r.status}) ${j.message || ""}`.trim());
  }
}

export async function readJSON(name) {
  const g = gh();
  if (g) {
    const f = await ghGet(g, `data/${name}.json`);
    if (f) return JSON.parse(Buffer.from(f.content, "base64").toString("utf8"));
    return bundled[name];
  }
  if (storageMode() === "local") {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "data", `${name}.json`), "utf8"));
  }
  return bundled[name];
}

function assertWritable() {
  if (storageMode() === "none") {
    throw new Error("Saving is off. Set PF_GITHUB_TOKEN in the host environment variables.");
  }
}

export async function writeBuffer(rel, buf, message) {
  assertWritable();
  const g = gh();
  if (g) return ghPut(g, rel, buf, message);
  const full = path.join(process.cwd(), rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buf);
}

export async function writeJSON(name, data) {
  await writeBuffer(`data/${name}.json`, Buffer.from(JSON.stringify(data, null, 2) + "\n"), `Update ${name} from admin`);
}
