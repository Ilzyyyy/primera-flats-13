import Image from "next/image";
import { turf } from "../../data/content";

export const metadata = { title: "Territory | Primera Flats 13" };

export default function TerritoryPage() {
  return (
    <section className="page">
      <h2 className="h2">Territory</h2>
      <div className="story">
        <div className="story-text">
          <h3 className="h3">{turf.name}</h3>
          {turf.text.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          <h3 className="h3">Allies &amp; Rivals</h3>
          {turf.allies.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        <figure className="photo story-ph" data-hot>
          <Image src={turf.image} alt={turf.alt} width={turf.w} height={turf.h} priority />
        </figure>
      </div>
    </section>
  );
}
