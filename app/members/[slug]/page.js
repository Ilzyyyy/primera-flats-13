import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "../../../components/Photo";
import PostCard from "../../../components/PostCard";
import { getMember, getMembers, getStreet, getTerritory } from "../../../lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const m = await getMember(params.slug);
  return { title: m ? `${m.name} | Primera Flats 13` : "Member" };
}

export default async function MemberPage({ params }) {
  const m = await getMember(params.slug);
  if (!m) notFound();
  const [street, members, territory] = await Promise.all([getStreet(), getMembers(), getTerritory()]);
  const posts = street.filter((p) => p.member === m.slug);
  const paragraphs = (m.development || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <section className="page">
      <Link href="/members" className="back">&larr; Members</Link>
      <div className="profile">
        <Photo src={m.photo} name={m.name} className="profile-ph" />
        <div className="profile-info">
          <span className="rk">{m.rank}</span>
          <h2 className="h2">{m.name}</h2>
          {m.alias && <div className="aka big">{m.alias}</div>}
          <dl className="facts">
            <div><dt>Since</dt><dd>{m.since}</dd></div>
            <div><dt>Status</dt><dd><i className={"dot" + (m.online ? " on" : "")} />{m.online ? "online" : "offline"}</dd></div>
          </dl>
          <p className="bio">{m.bio}</p>
        </div>
      </div>

      <h3 className="h3">Character development</h3>
      <div className="prose">
        {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p className="empty">Nothing written yet.</p>}
      </div>

      <h3 className="h3">Word on the street</h3>
      <div className="feed">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} members={members} territory={territory} hide="member" />
        ))}
        {posts.length === 0 && <p className="empty">Nothing about {m.name} yet.</p>}
      </div>
    </section>
  );
}
