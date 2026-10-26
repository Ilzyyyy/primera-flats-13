import Roster from "../../components/Roster";
import { getMembers } from "../../lib/data";

export const metadata = { title: "Members | Primera Flats 13" };

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembers();
  return (
    <section className="page">
      <h2 className="h2">Members</h2>
      <Roster members={members} />
    </section>
  );
}
