import Image from "next/image";
import { story } from "../data/content";

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
      {story.map((sec, i) => (
        <div key={i} className={"story" + (i % 2 ? " flip" : "")}>
          <div className="story-text">
            {sec.text.map((t, j) => (
              <p key={j}>{t}</p>
            ))}
          </div>
          <figure className="photo story-ph" data-hot>
            <Image src={sec.image} alt={sec.alt} width={sec.w} height={sec.h} />
          </figure>
        </div>
      ))}
    </section>
  );
}
