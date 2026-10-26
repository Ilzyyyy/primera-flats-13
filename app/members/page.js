import Roster from "../../components/Roster";
import { getMembers } from "../../lib/data";

export const metadata = { title: "Members | Primera Flats 13" };

export default function MembersPage() {
  return (
    <section className="page">
      <h2 className="h2">Members</h2>
      <Roster members={getMembers()} />
    </section>
  );
}
