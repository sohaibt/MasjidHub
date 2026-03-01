import { getSiteData } from "@/lib/get-data";
import { MasjidHubApp } from "@/components/MasjidHubApp";

export default async function Home() {
  const data = await getSiteData();
  return <MasjidHubApp data={data} />;
}
