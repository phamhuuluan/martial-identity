import { parseLocations } from "@/data/siteSchema";
import { LocationsForm } from "@/components/admin/LocationsForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function LocationsAdminPage() {
  const file = await readRepoFileOrThrow("content/site/locations.json");
  return <LocationsForm initial={parseLocations(JSON.parse(file.content))} sha={file.sha} />;
}
