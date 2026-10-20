import { notFound } from "next/navigation";
import EntityForm from "@/components/admin/EntityForm";
import { entityByKey } from "@/lib/admin-config";

export default function NewEntityPage({ params }: { params: { entity: string } }) {
  const entity = entityByKey(params.entity);
  if (!entity || entity.singleton) notFound();
  return <EntityForm entityKey={entity.key} />;
}
