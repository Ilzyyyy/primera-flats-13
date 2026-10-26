import Feed from "../../components/Feed";
import { getStreet, getMembers, getTerritory } from "../../lib/data";

export const metadata = { title: "Word on the Street | Primera Flats 13" };

export default function StreetPage() {
  return (
    <section className="page">
      <h2 className="h2">Word on the Street</h2>
      <Feed posts={getStreet()} members={getMembers()} territory={getTerritory()} />
    </section>
  );
}
