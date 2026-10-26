import members from "../data/members.json";
import street from "../data/street.json";
import territory from "../data/territory.json";

export const bundled = { members, street, territory };

export const getMembers = () => members;
export const getTerritory = () => territory;
export const getStreet = () => [...street].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
export const getMember = (slug) => members.find((m) => m.slug === slug);
export const getLot = (slug) => territory.find((t) => t.slug === slug);
