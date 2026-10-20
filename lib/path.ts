export function getPath(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Immutable set for dotted paths. */
export function setPath<T extends Record<string, any>>(obj: T, path: string, value: any): T {
  const [head, ...rest] = path.split(".");
  const copy: any = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[head] = rest.length ? setPath(copy[head] ?? {}, rest.join("."), value) : value;
  return copy;
}
