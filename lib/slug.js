export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function uniqueSlug(base, taken) {
  const root = slugify(base) || "item";
  let s = root;
  let n = 2;
  while (taken.includes(s)) s = `${root}-${n++}`;
  return s;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
