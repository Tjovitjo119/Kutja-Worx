import type { Service } from "@/lib/content";
import { Check, Engine } from "./Icons";

export default function EngineManagementList({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <div id="engine-management" className="card flex flex-col bg-brand-red/10 p-5">
      <div className="flex items-center gap-3">
        <span className="text-brand-red">
          <Engine className="h-8 w-8" />
        </span>
        <h3 className="text-sm font-bold leading-tight">Engine Management Installations</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {services.map((s) => (
          <li key={s._id} className="flex items-center gap-3 text-sm font-semibold">
            <Check className="h-4 w-4 shrink-0 text-brand-red" /> {s.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
