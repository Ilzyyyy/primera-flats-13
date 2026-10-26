"use client";
import { useState } from "react";

// Photos uploaded in this session, so the preview works before the host redeploys.
const previews = {};

function resize(file, max = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * r);
      c.height = Math.round(img.height * r);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = url;
  });
}

function ImageField({ value, onChange, slug }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      const dataUrl = await resize(f);
      const r = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, name: slug || "photo" }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed.");
      previews[j.path] = dataUrl;
      onChange(j.path);
    } catch (x) {
      setErr(x.message);
    }
    setBusy(false);
  }

  const src = value ? previews[value] || value : "";
  return (
    <div className="imgf">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="" /> : <div className="imgph">No photo</div>}
      <div className="imgbtns">
        <label className="btn2">
          {busy ? "Uploading..." : "Choose photo"}
          <input type="file" accept="image/*" hidden onChange={pick} disabled={busy} />
        </label>
        {value && (
          <button type="button" className="btn2" onClick={() => onChange("")}>
            Remove
          </button>
        )}
        {err && <p className="err">{err}</p>}
      </div>
    </div>
  );
}

function Field({ f, item, set }) {
  const id = `f-${f.key}`;
  const v = item[f.key] ?? "";
  let input;
  if (f.type === "textarea") {
    input = <textarea id={id} rows={f.rows || 4} value={v} onChange={(e) => set(f.key, e.target.value)} />;
  } else if (f.type === "select") {
    input = (
      <select id={id} value={v} onChange={(e) => set(f.key, e.target.value)}>
        {f.options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    );
  } else if (f.type === "checkbox") {
    input = <input id={id} type="checkbox" checked={!!item[f.key]} onChange={(e) => set(f.key, e.target.checked)} />;
  } else if (f.type === "number") {
    input = <input id={id} type="number" value={v} onChange={(e) => set(f.key, Number(e.target.value))} />;
  } else if (f.type === "image") {
    return (
      <div className="fld">
        <span className="lab">{f.label}</span>
        <ImageField value={item[f.key]} slug={item.slug} onChange={(p) => set(f.key, p)} />
      </div>
    );
  } else {
    input = <input id={id} type={f.type || "text"} value={v} onChange={(e) => set(f.key, e.target.value)} />;
  }
  return (
    <div className={"fld" + (f.type === "checkbox" ? " chk" : "") + (f.half ? " half" : "")}>
      <label className="lab" htmlFor={id}>
        {f.label}
      </label>
      {input}
    </div>
  );
}

export default function ListEditor({ items, setItems, fields, makeBlank, itemTitle, itemSub, onSave, dirty, status, noun }) {
  const [sel, setSel] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const idx = Math.min(sel, items.length - 1);
  const cur = items[idx];

  const set = (k, v) => setItems(items.map((it, i) => (i === idx ? { ...it, [k]: v } : it)));
  const add = () => {
    setItems([makeBlank(items), ...items]);
    setSel(0);
    setConfirm(false);
  };
  const remove = () => {
    setItems(items.filter((_, i) => i !== idx));
    setSel(0);
    setConfirm(false);
  };

  return (
    <div className="ed">
      <div className="ed-list">
        <button type="button" className="btn" onClick={add}>
          + Add {noun}
        </button>
        <ul>
          {items.map((it, i) => (
            <li key={it.slug || it.id || i}>
              <button
                type="button"
                className="ed-row"
                aria-current={i === idx}
                onClick={() => {
                  setSel(i);
                  setConfirm(false);
                }}
              >
                <strong>{itemTitle(it)}</strong>
                <small>{itemSub(it)}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ed-form">
        {cur ? (
          <>
            <div className="fields">
              {fields.map((f) => (
                <Field key={f.key} f={f} item={cur} set={set} />
              ))}
            </div>
            <div className="ed-actions">
              <button type="button" className="btn" onClick={onSave} disabled={!dirty || status.busy}>
                {status.busy ? "Saving..." : dirty ? "Save changes" : "Saved"}
              </button>
              {confirm ? (
                <>
                  <button type="button" className="btn danger" onClick={remove}>
                    Yes, delete
                  </button>
                  <button type="button" className="btn2" onClick={() => setConfirm(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" className="btn2" onClick={() => setConfirm(true)}>
                  Delete {noun}
                </button>
              )}
            </div>
            {status.msg && <p className={status.error ? "err" : "ok"}>{status.msg}</p>}
          </>
        ) : (
          <p className="empty">Nothing here. Add the first {noun}.</p>
        )}
      </div>
    </div>
  );
}
