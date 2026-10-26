"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ListEditor from "./ListEditor";
import { ranks, postTags } from "../data/content";
import { uniqueSlug, formatDate } from "../lib/slug";

const today = () => new Date().toISOString().slice(0, 10);
const opts = (arr) => arr.map((x) => ({ v: x, l: x }));

export default function Admin() {
  const [me, setMe] = useState(undefined);
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState("street");
  const [data, setData] = useState(null);
  const [dirty, setDirty] = useState({});
  const [status, setStatus] = useState({});
  const [loadErr, setLoadErr] = useState("");

  const refreshMe = () =>
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ admin: false }));
  useEffect(() => {
    refreshMe();
  }, []);

  useEffect(() => {
    if (!me?.admin) return;
    Promise.all(
      ["members", "street", "territory"].map((n) =>
        fetch("/api/data/" + n).then(async (r) => {
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || "Could not load data.");
          return j;
        })
      )
    )
      .then(([members, street, territory]) => setData({ members, street, territory }))
      .catch((e) => setLoadErr(e.message));
  }, [me]);

  async function login(e) {
    e.preventDefault();
    setLoginErr("");
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setLoginErr(j.error || "Login failed.");
    setPw("");
    refreshMe();
    window.dispatchEvent(new Event("pf-auth"));
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setData(null);
    setMe({ admin: false });
    window.dispatchEvent(new Event("pf-auth"));
  }

  const setItems = (name) => (items) => {
    setData((d) => ({ ...d, [name]: items }));
    setDirty((d) => ({ ...d, [name]: true }));
    setStatus((s) => ({ ...s, [name]: {} }));
  };

  async function save(name) {
    setStatus((s) => ({ ...s, [name]: { busy: true } }));
    const r = await fetch("/api/data/" + name, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data[name]),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      return setStatus((s) => ({ ...s, [name]: { error: true, msg: j.error || "Save failed." } }));
    }
    setDirty((d) => ({ ...d, [name]: false }));
    setStatus((s) => ({
      ...s,
      [name]: { msg: j.storage === "github" ? "Saved to GitHub. The site updates after the redeploy, about a minute." : "Saved." },
    }));
  }

  if (me === undefined) return <p className="empty">Loading...</p>;

  if (!me.admin) {
    return (
      <form className="login" onSubmit={login}>
        <label className="lab" htmlFor="pw">Admin password</label>
        <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" autoFocus />
        <button type="submit" className="btn">Log in</button>
        {loginErr && <p className="err">{loginErr}</p>}
      </form>
    );
  }

  if (loadErr) return <p className="err">{loadErr}</p>;
  if (!data) return <p className="empty">Loading...</p>;

  const memberOpts = [{ v: "", l: "None" }, ...data.members.map((m) => ({ v: m.slug, l: m.name }))];
  const lotOpts = [{ v: "", l: "None" }, ...data.territory.map((t) => ({ v: t.slug, l: t.name }))];

  const editors = {
    street: (
      <ListEditor
        noun="post"
        items={data.street}
        setItems={setItems("street")}
        makeBlank={() => ({ id: Date.now().toString(36), date: today(), tag: "rumor", author: "", member: "", territory: "", text: "" })}
        itemTitle={(p) => (p.text ? p.text.slice(0, 48) : "New post")}
        itemSub={(p) => `${postTags[p.tag] || p.tag} · ${formatDate(p.date)}`}
        fields={[
          { key: "text", label: "Post", type: "textarea", rows: 4 },
          { key: "author", label: "Posted by", half: true },
          { key: "tag", label: "Type", type: "select", options: Object.entries(postTags).map(([v, l]) => ({ v, l })), half: true },
          { key: "date", label: "Date", type: "date", half: true },
          { key: "member", label: "About member", type: "select", options: memberOpts, half: true },
          { key: "territory", label: "About territory", type: "select", options: lotOpts, half: true },
        ]}
        dirty={dirty.street}
        status={status.street || {}}
        onSave={() => save("street")}
      />
    ),
    members: (
      <ListEditor
        noun="member"
        items={data.members}
        setItems={setItems("members")}
        makeBlank={(list) => ({
          slug: uniqueSlug("new-member", list.map((x) => x.slug)),
          name: "New member",
          rank: "Rookie",
          since: "New",
          online: false,
          alias: "",
          photo: "",
          bio: "",
          development: "",
        })}
        itemTitle={(m) => m.name || "New member"}
        itemSub={(m) => m.rank}
        fields={[
          { key: "name", label: "Full name", half: true },
          { key: "alias", label: "Alias (aka), e.g. Snichy#3", half: true },
          { key: "rank", label: "Rank", type: "select", options: opts(ranks), half: true },
          { key: "since", label: "Since", half: true },
          { key: "online", label: "Online", type: "checkbox" },
          { key: "photo", label: "Photo", type: "image" },
          { key: "bio", label: "Short bio", type: "textarea", rows: 2 },
          { key: "development", label: "Character development (blank line = new paragraph)", type: "textarea", rows: 8 },
        ]}
        dirty={dirty.members}
        status={status.members || {}}
        onSave={() => save("members")}
      />
    ),
    territory: (
      <ListEditor
        noun="territory"
        items={data.territory}
        setItems={setItems("territory")}
        makeBlank={(list) => ({
          slug: uniqueSlug("new-territory", list.map((x) => x.slug)),
          name: "New territory",
          status: "neutral",
          x: 250,
          y: 170,
          w: 100,
          h: 80,
          photo: "",
          text: "",
          note: "",
        })}
        itemTitle={(t) => t.name || "New territory"}
        itemSub={(t) => t.status}
        fields={[
          { key: "name", label: "Name", half: true },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { v: "held", l: "Held by PF13" },
              { v: "contested", l: "Contested" },
              { v: "neutral", l: "Neutral" },
            ],
            half: true,
          },
          { key: "photo", label: "Photo", type: "image" },
          { key: "text", label: "Description", type: "textarea", rows: 3 },
          { key: "note", label: "Note" },
          { key: "x", label: "Map X (0-600)", type: "number", half: true },
          { key: "y", label: "Map Y (0-400)", type: "number", half: true },
          { key: "w", label: "Map width", type: "number", half: true },
          { key: "h", label: "Map height", type: "number", half: true },
        ]}
        dirty={dirty.territory}
        status={status.territory || {}}
        onSave={() => save("territory")}
      />
    ),
  };

  const anyDirty = Object.values(dirty).some(Boolean);

  return (
    <>
      <div className="admin-top">
        <div className="chips">
          {[
            ["street", "Word on the Street"],
            ["members", "Members"],
            ["territory", "Territory"],
          ].map(([k, l]) => (
            <button key={k} className="chip" aria-pressed={tab === k} onClick={() => setTab(k)}>
              {l}
              {dirty[k] ? " *" : ""}
            </button>
          ))}
          <Link href="/guides" className="chip">Guides</Link>
        </div>
        <button className="btn2" onClick={logout} disabled={anyDirty} title={anyDirty ? "Save your changes first" : ""}>
          Log out
        </button>
      </div>
      {me.storage === "none" && (
        <p className="err">Saving is off on this server. Set PF_GITHUB_TOKEN in the host environment variables.</p>
      )}
      {editors[tab]}
    </>
  );
}
