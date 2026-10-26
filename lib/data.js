import { readJSON } from "./store";

// Live data comes from storage (Supabase); data/*.json is only the seed / fallback.
export const getMembers = () => readJSON("members");
export const getTerritory = () => readJSON("territory");
export const getStreet = async () => [...(await readJSON("street"))].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
export const getMember = async (slug) => (await getMembers()).find((m) => m.slug === slug);
export const getLot = async (slug) => (await getTerritory()).find((t) => t.slug === slug);
