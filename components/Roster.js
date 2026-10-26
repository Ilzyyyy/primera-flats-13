"use client";
import Link from "next/link";
import { useState } from "react";
import { ranks } from "../data/content";
import Photo from "./Photo";

export default function Roster({ members }) {
  const [rank, setRank] = useState("All");
  const list = members.filter((m) => rank === "All" || m.rank === rank);
  return (
    <>
      <div className="chips">
        {["All", ...ranks].map((r) => (
          <button key={r} className="chip" aria-pressed={rank === r} onClick={() => setRank(r)}>
            {r}
          </button>
        ))}
      </div>
      <div className="roster">
        {list.map((m) => (
          <Link key={m.slug} href={`/members/${m.slug}`} className="mem">
            <Photo src={m.photo} name={m.name} className="mem-ph" />
            <div className="top">
              <div className="tag">{m.name}</div>
              <span className="rk">{m.rank}</span>
            </div>
            {m.alias && <div className="aka">aka {m.alias}</div>}
            <p>{m.bio}</p>
            <div className="meta">
              <span>Since: {m.since}</span>
              <span>
                <i className={"dot" + (m.online ? " on" : "")} />
                {m.online ? "online" : "offline"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
