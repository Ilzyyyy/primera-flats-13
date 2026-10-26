import Feed from "../../components/Feed";
import { getStreet, getMembers, getTerritory } from "../../lib/data";

export const metadata = { title: "Word on the Street | Primera Flats 13" };

export const dynamic = "force-dynamic";

export default async function StreetPage() {
  const [posts, members, territory] = await Promise.all([getStreet(), getMembers(), getTerritory()]);
  return (
    <section className="page">
      <h2 className="h2">Word on the Street</h2>
      <Feed posts={posts} members={members} territory={territory} />
    </section>
  );
}
