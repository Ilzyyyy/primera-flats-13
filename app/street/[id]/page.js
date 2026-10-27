import Link from "next/link";
import { notFound } from "next/navigation";
import { postTags } from "../../../data/content";
import { getStreet } from "../../../lib/data";
import { formatDate } from "../../../lib/slug";

export const dynamic = "force-dynamic";

async function find(id) {
  return (await getStreet()).find((p) => String(p.id) === id);
}

export async function generateMetadata({ params }) {
  const p = await find(params.id);
  return { title: p ? `${p.author || "Post"} | Word on the Street` : "Word on the Street" };
}

export default async function PostPage({ params }) {
  const p = await find(params.id);
  if (!p) notFound();
  return (
    <section className="page">
      <Link href="/street" className="back">&larr; Word on the Street</Link>
      <article className={`post post-full ${p.tag}`}>
        <div className="hd">
          <span className="tgp">{postTags[p.tag] || p.tag}</span>
          <strong>{p.author}</strong>
          <span>{formatDate(p.date)}</span>
        </div>
        {p.text && <p>{p.text}</p>}
        {p.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-ph-full" src={p.photo} alt="" />
        )}
      </article>
    </section>
  );
}
