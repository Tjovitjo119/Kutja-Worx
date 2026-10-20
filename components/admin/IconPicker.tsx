"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { iconChoices } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

export default function IconPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-brand-red">
          <Icon name={value} className="h-5 w-5" />
        </span>
        <span className="flex-1">{value || "Select icon"}</span>
        <span className="text-xs text-gray-400">Change</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose an icon"
        >
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Select icon</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {iconChoices.map((n) => (
                <button
                  key={n}
                  type="button"
                  title={n}
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg border",
                    value === n ? "border-brand-red bg-red-50 text-brand-red" : "border-gray-200 hover:border-brand-red",
                  )}
                >
                  <Icon name={n} className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
