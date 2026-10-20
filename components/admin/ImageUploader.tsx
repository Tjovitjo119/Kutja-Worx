"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { sanityConfigured } from "@/sanity/env";
import { cn } from "@/lib/utils";

const preview = (img: any) => (sanityConfigured && img?.asset?._ref ? urlFor(img).width(320).height(240).fit("crop").url() : null);

export default function ImageUploader({ value, multiple, onChange }: { value: any; multiple?: boolean; onChange: (v: any) => void }) {
  const list: any[] = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const commit = (next: any[]) => onChange(multiple ? next : next[0]);

  async function upload(files: FileList | File[]) {
    const arr = Array.from(files);
    if (!arr.length) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    (multiple ? arr : arr.slice(0, 1)).forEach((f) => fd.append("file", f));
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      commit(multiple ? [...list, ...data.images] : [data.images[0]]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const move = (i: number, d: number) => {
    const next = [...list];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };
  const makePrimary = (i: number) => commit([list[i], ...list.filter((_, n) => n !== i)]);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          drag ? "border-brand-red bg-red-50" : "border-gray-300 bg-gray-50",
        )}
      >
        {busy ? <Loader2 className="h-6 w-6 animate-spin text-brand-red" /> : <UploadCloud className="h-6 w-6 text-gray-400" />}
        <p className="mt-2 text-sm text-gray-600">Upload images or drag and drop</p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
        >
          Choose {multiple ? "files" : "file"}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
      {list.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {list.map((img, i) => {
            const src = preview(img);
            return (
              <li
                key={img._key ?? img.asset?._ref ?? i}
                className="group relative aspect-[4/3] overflow-hidden rounded-md border border-gray-200 bg-gray-100"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-gray-400">Image</span>
                )}
                {multiple && i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-brand-red px-1.5 py-0.5 text-[9px] font-bold text-white">PRIMARY</span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <div className="flex gap-0.5">
                    {multiple && (
                      <button
                        type="button"
                        aria-label="Move left"
                        onClick={() => move(i, -1)}
                        className="rounded p-1 text-white hover:bg-white/20"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </button>
                    )}
                    {multiple && (
                      <button
                        type="button"
                        aria-label="Move right"
                        onClick={() => move(i, 1)}
                        className="rounded p-1 text-white hover:bg-white/20"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    {multiple && i !== 0 && (
                      <button
                        type="button"
                        aria-label="Make primary"
                        onClick={() => makePrimary(i)}
                        className="rounded p-1 text-white hover:bg-white/20"
                      >
                        <Star className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => commit(list.filter((_, n) => n !== i))}
                    className="rounded p-1 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
