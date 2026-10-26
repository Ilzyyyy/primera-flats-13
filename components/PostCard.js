import Link from "next/link";
import { postTags } from "../data/content";
import { formatDate } from "../lib/slug";

export default function PostCard({ post, members = [], territory = [], hide = "" }) {
  const m = members.find((x) => x.slug === post.member);
  const t = territory.find((x) => x.slug === post.territory);
  return (
    <article className={`post ${post.tag}`}>
      <div className="hd">
        <span className="tgp">{postTags[post.tag] || post.tag}</span>
        <strong>{post.author}</strong>
        <span>{formatDate(post.date)}</span>
      </div>
      <p>{post.text}</p>
      {((m && hide !== "member") || (t && hide !== "territory")) && (
        <div className="refs">
          {m && hide !== "member" && <Link href={`/members/${m.slug}`}>@{m.name}</Link>}
          {t && hide !== "territory" && <Link href={`/territory/${t.slug}`}>{t.name}</Link>}
        </div>
      )}
    </article>
  );
}
