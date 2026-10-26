import { redirect } from "next/navigation";
import { guides } from "../../data/content";
import { isAdmin } from "../../lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Guides | Primera Flats 13", robots: { index: false } };

// Guides are private: they only open after the admin login.
export default function GuidesPage() {
  if (!isAdmin()) redirect("/admin");
  return (
    <section className="page">
      <h2 className="h2">Guides</h2>
      <div className="guides">
        {guides.map((g, i) => (
          <details key={g.id} open={i === 0}>
            <summary>
              <span className="tg">{g.id}</span>
              {g.title}
            </summary>
            <div className="body">
              {g.body && <p>{g.body}</p>}
              {g.list && (
                <ul>
                  {g.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
