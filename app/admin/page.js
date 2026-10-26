import Admin from "../../components/Admin";

export const metadata = { title: "Admin | Primera Flats 13", robots: { index: false } };

export default function AdminPage() {
  return (
    <section className="page">
      <h2 className="h2">Admin</h2>
      <Admin />
    </section>
  );
}
