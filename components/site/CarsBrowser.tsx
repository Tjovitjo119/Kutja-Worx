"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import VehicleCard, { type VehicleWithImg } from "./VehicleCard";
import { cn } from "@/lib/utils";

export default function CarsBrowser({ vehicles }: { vehicles: VehicleWithImg[] }) {
  const makes = Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean)));
  const [make, setMake] = useState("All Makes");
  const shown = make === "All Makes" ? vehicles : vehicles.filter((v) => v.make === make);
  const menu = ["All Makes", ...makes];

  return (
    <section className="bg-ink py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[230px_1fr]">
        <aside>
          <h2 className="mb-3 font-display text-lg font-bold uppercase">
            Car <span className="text-brand-red">Makes</span>
          </h2>
          <nav aria-label="Car makes" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {menu.map((m) => (
              <button
                key={m}
                onClick={() => setMake(m)}
                aria-pressed={make === m}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors",
                  make === m ? "bg-brand-red text-white" : "bg-ink-panel text-white/80 hover:bg-white/10",
                )}
              >
                <Car className="h-4 w-4" /> {m}
                <span className="ml-auto text-xs opacity-70">
                  {m === "All Makes" ? vehicles.length : vehicles.filter((v) => v.make === m).length}
                </span>
              </button>
            ))}
          </nav>
        </aside>
        <div>
          {shown.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {shown.map((v) => (
                <VehicleCard key={v._id} v={v} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-ink-line2 p-10 text-center text-muted">No car types in this make yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
