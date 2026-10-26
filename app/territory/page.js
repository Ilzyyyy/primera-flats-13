import TerritoryMap from "../../components/TerritoryMap";
import { getTerritory } from "../../lib/data";

export const metadata = { title: "Territory | Primera Flats 13" };

export const dynamic = "force-dynamic";

export default async function TerritoryPage() {
  const lots = await getTerritory();
  return (
    <section className="page">
      <h2 className="h2">Territory</h2>
      <TerritoryMap lots={lots} />
    </section>
  );
}
