import { notFound } from "next/navigation";
import EntityForm from "@/components/admin/EntityForm";
import EntityList from "@/components/admin/EntityList";
import { entityByKey } from "@/lib/admin-config";

export default function EntityPage({ params }: { params: { entity: string } }) {
  const entity = entityByKey(params.entity);
  if (!entity) notFound();
  return entity.singleton ? <EntityForm entityKey={entity.key} /> : <EntityList entityKey={entity.key} />;
}
