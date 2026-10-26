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
          <Image src="/story.png" alt="Primera Flats screenshots collage" width={800} height={600} priority />
        </figure>
      </div>

      <h2 className="h2">Story</h2>
      <div className="story">
        {story.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </section>
  );
}
