import { notFound } from "next/navigation";
import EntityForm from "@/components/admin/EntityForm";
import { entityByKey } from "@/lib/admin-config";

export default function EditEntityPage({ params }: { params: { entity: string; id: string } }) {
  const entity = entityByKey(params.entity);
  if (!entity || entity.singleton) notFound();
  return <EntityForm entityKey={entity.key} id={params.id} />;
}
