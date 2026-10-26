import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "../../../components/Photo";
import PostCard from "../../../components/PostCard";
import { statusLabel } from "../../../data/content";
import { getLot, getMembers, getStreet, getTerritory } from "../../../lib/data";

export function generateStaticParams() {
  return getTerritory().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getLot(params.slug);
  return { title: t ? `${t.name} | Primera Flats 13` : "Territory" };
}

export default function LotPage({ params }) {
  const t = getLot(params.slug);
  if (!t) notFound();
  const posts = getStreet().filter((p) => p.territory === t.slug);

  return (
    <section className="page">
      <Link href="/territory" className="back">&larr; Territory</Link>
      <div className="profile">
        <Photo src={t.photo} name={t.name} className="profile-ph wide" />
        <div className="profile-info">
          <span className={`pill ${t.status}`}>{statusLabel[t.status]}</span>
          <h2 className="h2">{t.name}</h2>
          <p className="bio">{t.text}</p>
          {t.note && <p className="code">{t.note}</p>}
        </div>
      </div>

      <h3 className="h3">Word on the street</h3>
      <div className="feed">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} members={getMembers()} territory={getTerritory()} hide="territory" />
        ))}
        {posts.length === 0 && <p className="empty">Nothing about {t.name} yet.</p>}
      </div>
    </section>
  );
}
