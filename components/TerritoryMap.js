"use client";
import Link from "next/link";
import { useState } from "react";
import { statusLabel } from "../data/content";
import Photo from "./Photo";

export default function TerritoryMap({ lots }) {
  const [sel, setSel] = useState(lots[0]?.slug);
  const cur = lots.find((l) => l.slug === sel) || lots[0];
  if (!cur) return <p className="empty">No territory added yet.</p>;
  return (
    <div className="terr">
      <div>
        <div className="mapbox">
          <svg className="map" viewBox="0 0 600 400" role="img" aria-label="Territory map">
            {lots.map((l) => (
              <g key={l.slug}>
                <rect
                  className={`lot ${l.status}${cur.slug === l.slug ? " sel" : ""}`}
                  x={l.x}
                  y={l.y}
                  width={l.w}
                  height={l.h}
                  tabIndex={0}
                  role="button"
                  aria-label={l.name}
                  data-hot
                  onClick={() => setSel(l.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSel(l.slug);
                    }
                  }}
                />
                <text className={l.status === "neutral" ? "dark" : "light"} x={l.x + 10} y={l.y + 22}>
                  {l.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="legend">
          <span><i style={{ background: "var(--blue)" }} />Held</span>
          <span><i style={{ background: "var(--brick)" }} />Contested</span>
          <span><i style={{ background: "var(--line)" }} />Neutral</span>
        </div>
      </div>
      <div className="panel">
        {cur.photo && <Photo src={cur.photo} name={cur.name} className="panel-ph" />}
        <span className={`pill ${cur.status}`}>{statusLabel[cur.status]}</span>
        <h3>{cur.name}</h3>
        <p>{cur.text}</p>
        {cur.note && <p className="code">{cur.note}</p>}
        <Link href={`/territory/${cur.slug}`} className="more">Open page &rarr;</Link>
      </div>
    </div>
  );
}
