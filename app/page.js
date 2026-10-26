import Image from "next/image";
import { timeline } from "../data/content";

export const metadata = { title: "Story | Primera Flats 13" };

export default function StoryPage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>
          Primera
          <br />
          Flats <span>13</span>
        </h1>
        <figure className="photo" data-hot>
          <Image src="/wall.jpg" alt="Primera Flats wall with painted lettering" width={712} height={532} priority />
        </figure>
      </div>

      <h2 className="h2">Story</h2>
      <ol className="timeline">
        {timeline.map((t) => (
          <li key={t.title}>
            <div className="yr">{t.year}</div>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
