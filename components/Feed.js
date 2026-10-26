"use client";
import { useState } from "react";
import PostCard from "./PostCard";
import { postTags } from "../data/content";

export default function Feed({ posts, members, territory }) {
  const [tag, setTag] = useState("all");
  const tags = { all: "All", ...postTags };
  const list = posts.filter((p) => tag === "all" || p.tag === tag);
  return (
    <>
      <div className="chips">
        {Object.entries(tags).map(([k, label]) => (
          <button key={k} className="chip" aria-pressed={tag === k} onClick={() => setTag(k)}>
            {label}
          </button>
        ))}
      </div>
      <div className="feed">
        {list.map((p) => (
          <PostCard key={p.id} post={p} members={members} territory={territory} />
        ))}
        {list.length === 0 && <p className="empty">Nothing here yet.</p>}
      </div>
    </>
  );
}
