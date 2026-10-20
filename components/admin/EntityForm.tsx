"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { entityByKey, type FieldDef } from "@/lib/admin-config";
import { getPath, setPath } from "@/lib/path";
import { slugify } from "@/lib/utils";
import { AButton, ALink, PageHeader, Panel, inputCls } from "./ui";
import ImageUploader from "./ImageUploader";
import IconPicker from "./IconPicker";

const defaultsFor = (fields: FieldDef[]) => {
  let v: any = {};
  for (const f of fields) if (f.type === "toggle" && ["published", "active"].includes(f.name)) v = setPath(v, f.name, true);
  for (const f of fields) if (f.type === "select" && f.options?.length && !f.optionsFrom) v = setPath(v, f.name, f.options[0]);
  return v;
};

export default function EntityForm({ entityKey, id }: { entityKey: string; id?: string }) {
  const entity = entityByKey(entityKey)!;
  const router = useRouter();
  const isNew = !id && !entity.singleton;
  const docId = entity.singleton ? entity.singletonId! : id;

  const [values, setValues] = useState<any>(() => defaultsFor(entity.fields));
  const [linesText, setLinesText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [optionsFrom, setOptionsFrom] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/${entityKey}/${docId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setValues((cur: any) => ({ ...cur, ...d.doc }));
        const lt: Record<string, string> = {};
        for (const f of entity.fields) if (f.type === "lines") lt[f.name] = (getPath(d.doc, f.name) ?? []).join("\n");
        setLinesText(lt);
        setSlugTouched(true);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [entityKey, docId, isNew, entity.fields]);

  useEffect(() => {
    for (const f of entity.fields) {
      if (!f.optionsFrom) continue;
      fetch(`/api/admin/${f.optionsFrom}`)
        .then((r) => r.json())
        .then((d) =>
          setOptionsFrom((o) => ({
            ...o,
            [f.name]: (d.docs ?? []).sort((a: any, b: any) => (a.order ?? 100) - (b.order ?? 100)).map((x: any) => x.title),
          })),
        )
        .catch(() => {});
    }
  }, [entity.fields]);

  const set = (name: string, value: any) =>
    setValues((cur: any) => {
      let next = setPath(cur, name, value);
      const slugField = entity.fields.find((f) => f.slugFrom === name);
      if (slugField && !slugTouched) next = setPath(next, slugField.name, slugify(String(value ?? "")));
      return next;
    });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(isNew ? `/api/admin/${entityKey}` : `/api/admin/${entityKey}/${docId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      if (entity.singleton) {
        setSaved(true);
        router.refresh();
      } else {
        router.push(`/admin/${entityKey}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  const main = entity.fields.filter((f) => !f.side);
  const side = entity.fields.filter((f) => f.side);
  const id_ = (f: FieldDef) => `f-${f.name.replace(/\./g, "-")}`;

  const renderField = (f: FieldDef) => {
    const v = getPath(values, f.name);
    const common = { id: id_(f), required: f.required && f.type !== "password" };
    let control: React.ReactNode;
    switch (f.type) {
      case "textarea":
        control = <textarea {...common} rows={4} value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />;
        break;
      case "number":
        control = (
          <input {...common} type="number" step="any" value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
        );
        break;
      case "date":
        control = <input {...common} type="date" value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />;
        break;
      case "password":
        control = (
          <input
            id={id_(f)}
            type="password"
            autoComplete="new-password"
            value={values.password ?? ""}
            onChange={(e) => set("password", e.target.value)}
            className={inputCls}
            placeholder={values.hasPassword ? "••••••••" : ""}
          />
        );
        break;
      case "select": {
        const opts = f.optionsFrom ? (optionsFrom[f.name] ?? []) : (f.options ?? []);
        const all = v && !opts.includes(v) ? [v, ...opts] : opts;
        control = (
          <select {...common} value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            {all.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
        break;
      }
      case "toggle":
        control = (
          <label className="flex cursor-pointer items-center gap-3">
            <input
              id={id_(f)}
              type="checkbox"
              checked={Boolean(v)}
              onChange={(e) => set(f.name, e.target.checked)}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-brand-red peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-red" />
            <span className="text-sm">{f.label}</span>
          </label>
        );
        break;
      case "lines":
        control = (
          <textarea
            {...common}
            rows={3}
            value={linesText[f.name] ?? (getPath(values, f.name) ?? []).join("\n")}
            onChange={(e) => {
              setLinesText((t) => ({ ...t, [f.name]: e.target.value }));
              set(
                f.name,
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              );
            }}
            className={inputCls}
          />
        );
        break;
      case "specs": {
        const rows: { label: string; value: string }[] = v ?? [];
        control = (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input
                  aria-label="Spec name"
                  placeholder="Label"
                  value={r.label}
                  onChange={(e) =>
                    set(
                      f.name,
                      rows.map((x, n) => (n === i ? { ...x, label: e.target.value } : x)),
                    )
                  }
                  className={inputCls}
                />
                <input
                  aria-label="Spec value"
                  placeholder="Value"
                  value={r.value}
                  onChange={(e) =>
                    set(
                      f.name,
                      rows.map((x, n) => (n === i ? { ...x, value: e.target.value } : x)),
                    )
                  }
                  className={inputCls}
                />
                <button
                  type="button"
                  aria-label="Remove row"
                  onClick={() =>
                    set(
                      f.name,
                      rows.filter((_, n) => n !== i),
                    )
                  }
                  className="rounded p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <AButton type="button" variant="outline" onClick={() => set(f.name, [...rows, { label: "", value: "" }])}>
              <Plus className="h-4 w-4" /> Add spec
            </AButton>
          </div>
        );
        break;
      }
      case "icon":
        control = <IconPicker value={v} onChange={(n) => set(f.name, n)} />;
        break;
      case "image":
        control = <ImageUploader value={v} onChange={(n) => set(f.name, n)} />;
        break;
      case "images":
        control = <ImageUploader multiple value={v} onChange={(n) => set(f.name, n)} />;
        break;
      default:
        control = (
          <input
            {...common}
            value={v ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => {
              if (f.name === "slug") setSlugTouched(true);
              set(f.name, e.target.value);
            }}
            className={inputCls}
          />
        );
    }
    return (
      <div key={f.name} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
        {f.type !== "toggle" && (
          <label htmlFor={id_(f)} className="mb-1 block text-sm font-medium text-gray-700">
            {f.label}
            {f.required && <span className="text-brand-red"> *</span>}
          </label>
        )}
        {control}
        {f.help && <p className="mt-1 text-xs text-gray-500">{f.help}</p>}
      </div>
    );
  };

  const title = entity.singleton ? entity.label : isNew ? `Add ${entity.singular}` : `Edit ${entity.singular}`;

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );

  return (
    <form onSubmit={save}>
      <PageHeader title={title} sub={entity.hint} />
      <div className={side.length ? "grid gap-6 lg:grid-cols-[1.5fr_1fr]" : "max-w-3xl"}>
        <Panel>
          <div className="grid gap-4 sm:grid-cols-2">{main.map(renderField)}</div>
        </Panel>
        {side.length > 0 && (
          <Panel>
            <div className="grid gap-4">{side.map(renderField)}</div>
          </Panel>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved. Changes appear on the website within about a minute.
        </p>
      )}
      <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-gray-200 bg-gray-100/95 py-4 backdrop-blur">
        {!entity.singleton && (
          <ALink href={`/admin/${entityKey}`} variant="outline">
            Cancel
          </ALink>
        )}
        <AButton type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
        </AButton>
      </div>
    </form>
  );
}
