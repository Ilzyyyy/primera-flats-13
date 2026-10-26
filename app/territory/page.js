import TerritoryMap from "../../components/TerritoryMap";
import { getTerritory } from "../../lib/data";

export const metadata = { title: "Territory | Primera Flats 13" };

export default function TerritoryPage() {
  return (
    <section className="page">
      <h2 className="h2">Territory</h2>
      <TerritoryMap lots={getTerritory()} />
    </section>
  );
}
