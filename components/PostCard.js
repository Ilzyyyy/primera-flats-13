import Link from "next/link";
import { postTags } from "../data/content";
import { formatDate } from "../lib/slug";

export default function PostCard({ post }) {
  return (
    <Link href={`/street/${encodeURIComponent(post.id)}`} className="post-link">
      <article className={`post ${post.tag}`}>
        <div className="hd">
          <span className="tgp">{postTags[post.tag] || post.tag}</span>
          <strong>{post.author}</strong>
          <span>{formatDate(post.date)}</span>
        </div>
        {post.text && <p>{post.text}</p>}
        {post.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-ph" src={post.photo} alt="" loading="lazy" />
        )}
        <span className="post-open">Open &rarr;</span>
      </article>
    </Link>
  );
}
