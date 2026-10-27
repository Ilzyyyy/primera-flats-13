import { postTags } from "../data/content";
import { formatDate } from "../lib/slug";

export default function PostCard({ post, members = [], territory = [], hide = "" }) {
  return (
    <article className={`post ${post.tag}`}>
      <div className="hd">
        <span className="tgp">{postTags[post.tag] || post.tag}</span>
        <strong>{post.author}</strong>
        <span>{formatDate(post.date)}</span>
      </div>
      <p>{post.text}</p>
    </article>
  );
}
