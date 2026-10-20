/**
 * Original placeholder illustrations (SVG strings), served by /api/art/[kind].
 * Shown only where a document has no uploaded photo yet.
 */
const RED = "#E60012";

const defs = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050505"/><stop offset=".62" stop-color="#16161a"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1c22"/><stop offset="1" stop-color="#050505"/></linearGradient>
<linearGradient id="redwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a000b"/><stop offset="1" stop-color="${RED}"/></linearGradient>
<linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa0ae"/><stop offset=".5" stop-color="#40454f"/><stop offset="1" stop-color="#17191f"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f3544"/><stop offset="1" stop-color="#0b0d13"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${RED}" stop-opacity=".55"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
<radialGradient id="spot" cx=".5" cy="0" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="blur"><feGaussianBlur stdDeviation="6"/></filter></defs>`;

const wrap = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs}${body}</svg>`;

function bay(w: number, h: number, stripes = true) {
  let s = `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  for (let i = 0; i < 9; i++)
    s += `<rect x="${(i * w) / 9}" y="${h * 0.12}" width="${w / 9 - 4}" height="${h * 0.5}" fill="#101014" opacity=".8"/>`;
  if (stripes) {
    s += `<polygon points="${w * 0.78},0 ${w * 0.86},0 ${w * 0.7},${h * 0.66} ${w * 0.62},${h * 0.66}" fill="url(#redwall)" opacity=".9"/>`;
    s += `<polygon points="${w * 0.9},0 ${w * 0.93},0 ${w * 0.77},${h * 0.66} ${w * 0.74},${h * 0.66}" fill="${RED}" opacity=".7"/>`;
  }
  for (let i = 0; i < 4; i++) {
    const x = w * (0.08 + i * 0.22);
    s += `<rect x="${x}" y="${h * 0.06}" width="${w * 0.14}" height="7" fill="#fff"/><ellipse cx="${x + w * 0.07}" cy="${h * 0.3}" rx="${w * 0.1}" ry="${h * 0.3}" fill="url(#spot)"/>`;
  }
  s += `<rect x="${w * 0.03}" y="${h * 0.4}" width="${w * 0.12}" height="${h * 0.26}" fill="#8f0010"/>`;
  for (let i = 0; i < 5; i++)
    s += `<rect x="${w * 0.035}" y="${h * 0.405 + i * h * 0.05}" width="${w * 0.11}" height="${h * 0.04}" fill="#b80013" stroke="#5d0008"/>`;
  s += `<rect y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="url(#floor)"/><rect y="${h * 0.66}" width="${w}" height="3" fill="${RED}" opacity=".8"/>`;
  return s;
}

function car(x: number, y: number, scale: number, color: string, accent = RED, id = "c") {
  const wheels = [190, 622]
    .map(
      (cx) =>
        `<g><circle cx="${cx}" cy="214" r="52" fill="#06080c"/><circle cx="${cx}" cy="214" r="38" fill="#9aa3b5"/><circle cx="${cx}" cy="214" r="31" fill="#10141d"/>${[
          0, 1, 2, 3, 4,
        ]
          .map((k) => `<rect x="${cx - 3}" y="183" width="6" height="31" fill="#b8c0d0" transform="rotate(${k * 72} ${cx} 214)"/>`)
          .join("")}<circle cx="${cx}" cy="214" r="7" fill="${accent}"/></g>`,
    )
    .join("");
  return `<g transform="translate(${x} ${y}) scale(${scale})" id="${id}">
<path d="M40,210 L40,182 Q40,166 72,160 L192,142 Q244,94 336,82 L520,82 Q604,90 654,142 L742,160 Q774,168 774,196 L774,214 L40,214 Z" fill="${color}" stroke="#2c2f3a" stroke-width="2"/>
<path d="M254,138 Q288,104 342,96 L432,96 L432,140 Z" fill="url(#glass)"/><path d="M446,96 L520,96 Q570,104 604,140 L446,140 Z" fill="url(#glass)"/>
<path d="M74,162 L192,144 Q244,96 336,84 L520,84 Q600,92 650,142" stroke="#fff" stroke-opacity=".3" stroke-width="3" fill="none"/>
<path d="M60,176 L760,176" stroke="#2c2f3a" stroke-width="2"/><path d="M52,196 L190,196 M640,196 L760,196" stroke="${accent}" stroke-width="3"/>
<rect x="748" y="168" width="26" height="10" rx="3" fill="#fff"/><rect x="40" y="168" width="16" height="10" rx="3" fill="${accent}"/>${wheels}</g>`;
}

const hex = (c?: string | null) => (c && /^[0-9a-fA-F]{3,8}$/.test(c) ? `#${c}` : "#0d0f15");

function carScene(w: number, h: number, color: string, redbay = false) {
  const reflect = `<g transform="translate(0 ${h * 0.66 * 2 + 40}) scale(1 -1)" opacity=".16" filter="url(#blur)">${car(w * 0.1, h * 0.42, 1.25, color, RED, "r")}</g>`;
  return `${bay(w, h, !redbay)}<ellipse cx="${w / 2}" cy="${h * 0.74}" rx="${w * 0.4}" ry="60" fill="url(#glow)"/>${reflect}${car(w * 0.1, h * 0.42, 1.25, color)}`;
}

const dark = (w: number, h: number, extra = "") =>
  `<rect width="${w}" height="${h}" fill="url(#bg)"/><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.38}" ry="${h * 0.42}" fill="url(#glow)"/>${extra}`;

const ring = (cx: number, cy: number, r: number, f = "none", s = "#40454f", sw = 6) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`;

const kinds: Record<string, (color: string) => string> = {
  car: (c) => wrap(1200, 900, carScene(1200, 900, c)),
  hero: (c) => wrap(1600, 900, carScene(1600, 900, c).replaceAll("scale(1.25)", "scale(1.6)")),
  lift: () => {
    const w = 1200,
      h = 900;
    return wrap(
      w,
      h,
      `${bay(w, h)}<rect x="${w * 0.2}" y="${h * 0.12}" width="26" height="${h * 0.56}" fill="${RED}"/><rect x="${w * 0.8}" y="${h * 0.12}" width="26" height="${h * 0.56}" fill="${RED}"/><rect x="${w * 0.2}" y="${h * 0.4}" width="${w * 0.6 + 26}" height="10" fill="#9aa0ae"/>${car(w * 0.09, 70, 1.12, "#d9dde6")}`,
    );
  },
  workshop: () => {
    const w = 1200,
      h = 900;
    let s = bay(w, h, false);
    s += `<rect x="${w * 0.3}" y="${h * 0.3}" width="${w * 0.4}" height="${h * 0.4}" fill="#a30010" stroke="#5d0008" stroke-width="4"/>`;
    for (let i = 0; i < 6; i++)
      s += `<rect x="${w * 0.31}" y="${h * 0.31 + i * h * 0.065}" width="${w * 0.38}" height="${h * 0.055}" fill="#c70014" stroke="#5d0008"/><rect x="${w * 0.46}" y="${h * 0.325 + i * h * 0.065}" width="${w * 0.08}" height="6" rx="3" fill="#ddd"/>`;
    s += ring(w * 0.2, h * 0.78, h * 0.1, "#06080c", "#40454f", 10);
    return wrap(w, h, s);
  },
  engine: () => {
    const w = 1200,
      h = 900,
      cx = w / 2;
    let s = dark(w, h);
    s += `<rect x="${cx - 260}" y="${h * 0.62}" width="520" height="${h * 0.2}" rx="14" fill="url(#metal)"/><rect x="${cx - 280}" y="${h * 0.34}" width="560" height="${h * 0.3}" rx="12" fill="#1b1c23" stroke="#40454f" stroke-width="3"/><rect x="${cx - 250}" y="${h * 0.28}" width="500" height="${h * 0.1}" rx="8" fill="${RED}"/>`;
    for (let i = 0; i < 4; i++) {
      const x = cx - 225 + i * 150;
      s += `<rect x="${x}" y="${h * 0.4}" width="90" height="${h * 0.2}" rx="6" fill="url(#metal)"/>${ring(x + 45, h * 0.5, 22, "#0b0d13", "#9aa0ae", 4)}`;
    }
    s += `<path d="M${cx - 280},${h * 0.5} Q${cx - 380},${h * 0.5} ${cx - 380},${h * 0.7}" stroke="${RED}" stroke-width="16" fill="none"/><path d="M${cx + 280},${h * 0.45} Q${cx + 400},${h * 0.45} ${cx + 400},${h * 0.2}" stroke="#9aa0ae" stroke-width="18" fill="none"/>${ring(cx + 330, h * 0.72, h * 0.12, "url(#metal)", "#0b0d13")}<circle cx="${cx + 330}" cy="${h * 0.72}" r="${h * 0.05}" fill="${RED}"/>`;
    return wrap(w, h, s);
  },
  suspension: () => {
    const w = 1200,
      h = 900,
      cx = w / 2;
    let s = dark(
      w,
      h,
      `<rect x="${cx - 8}" y="${h * 0.08}" width="16" height="${h * 0.84}" rx="8" fill="url(#metal)"/><rect x="${cx - 60}" y="${h * 0.06}" width="120" height="${h * 0.06}" rx="8" fill="#40454f"/><rect x="${cx - 48}" y="${h * 0.86}" width="96" height="${h * 0.07}" rx="8" fill="#40454f"/>`,
    );
    for (let i = 0; i < 9; i++)
      s += `<ellipse cx="${cx}" cy="${h * 0.2 + i * h * 0.075}" rx="${w * 0.1}" ry="${h * 0.035}" fill="none" stroke="${RED}" stroke-width="14"/>`;
    return wrap(w, h, s);
  },
  coilover: () => kinds.suspension(""),
  clutch: () => {
    const w = 1200,
      h = 900,
      cx = w / 2,
      cy = h / 2;
    let s =
      dark(w, h) + ring(cx, cy, h * 0.38, "url(#metal)", "#0b0d13", 8) + `<circle cx="${cx}" cy="${cy}" r="${h * 0.3}" fill="#1a1b22"/>`;
    for (let i = 0; i < 24; i++)
      s += `<circle cx="${cx + Math.cos((i * Math.PI) / 12) * h * 0.34}" cy="${cy + Math.sin((i * Math.PI) / 12) * h * 0.34}" r="9" fill="#0b0d13"/>`;
    for (let i = 0; i < 9; i++)
      s += `<rect x="${cx - 7}" y="${cy - h * 0.28}" width="14" height="${h * 0.2}" fill="#b8c0d0" transform="rotate(${i * 40} ${cx} ${cy})"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${h * 0.11}" fill="${RED}" stroke="#0b0d13" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="${h * 0.05}" fill="#0b0d13"/>`;
    return wrap(w, h, s);
  },
  brakes: () => {
    const w = 1200,
      h = 900,
      cx = w / 2,
      cy = h / 2;
    let s = dark(w, h) + ring(cx, cy, h * 0.38, "url(#metal)", "#0b0d13", 8) + ring(cx, cy, h * 0.14, "#1a1b22", "#0b0d13", 6);
    for (let i = 0; i < 16; i++)
      s += `<circle cx="${cx + Math.cos((i * Math.PI) / 8) * h * 0.26}" cy="${cy + Math.sin((i * Math.PI) / 8) * h * 0.26}" r="12" fill="#0b0d13"/>`;
    s += `<path d="M${cx + 120},${cy - 250} Q${cx + 330},${cy - 160} ${cx + 330},${cy} Q${cx + 330},${cy + 160} ${cx + 120},${cy + 250} L${cx + 120},${cy + 160} Q${cx + 220},${cy + 100} ${cx + 220},${cy} Q${cx + 220},${cy - 100} ${cx + 120},${cy - 160} Z" fill="${RED}" stroke="#5d0008" stroke-width="5"/>`;
    return wrap(w, h, s);
  },
  turbo: () => {
    const w = 1200,
      h = 900,
      cx = w / 2,
      cy = h / 2;
    let s = dark(w, h) + ring(cx - 80, cy, h * 0.3, "url(#metal)", "#0b0d13", 8) + ring(cx - 80, cy, h * 0.17, "#17181e", "#9aa0ae", 5);
    for (let i = 0; i < 12; i++)
      s += `<rect x="${cx - 86}" y="${cy - h * 0.16}" width="12" height="${h * 0.15}" fill="#b8c0d0" transform="rotate(${i * 30} ${cx - 80} ${cy})"/>`;
    s += `<rect x="${cx + 150}" y="${cy - 90}" width="300" height="180" rx="30" fill="url(#metal)" stroke="#0b0d13" stroke-width="6"/><rect x="${cx + 430}" y="${cy - 110}" width="40" height="220" fill="${RED}"/>`;
    return wrap(w, h, s);
  },
  intake: () => {
    const w = 1200,
      h = 900;
    let s =
      dark(w, h) +
      `<path d="M200,560 Q420,560 520,440 Q620,320 860,320 L1000,320 L1000,520 L860,520 Q760,520 700,600 Q620,700 400,700 L200,700 Z" fill="url(#metal)" stroke="#0b0d13" stroke-width="6"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${230 + i * 22}" y="560" width="8" height="140" fill="#0b0d13" opacity=".5"/>`;
    s += `<rect x="1000" y="300" width="60" height="240" fill="${RED}"/><ellipse cx="200" cy="630" rx="60" ry="90" fill="#17181e" stroke="${RED}" stroke-width="10"/>`;
    return wrap(w, h, s);
  },
  exhaust: () => {
    const w = 1200,
      h = 900;
    const s =
      dark(w, h) +
      `<path d="M120,620 L520,620 Q620,620 620,520 L620,420 Q620,360 680,360 L1000,360" stroke="url(#metal)" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M120,620 L520,620 Q620,620 620,520 L620,420 Q620,360 680,360 L1000,360" stroke="#0b0d13" stroke-width="10" fill="none" opacity=".4"/>` +
      ring(1040, 360, 54, "#0b0d13", "#d4d8e0", 12) +
      `<ellipse cx="520" cy="560" rx="170" ry="90" fill="url(#metal)" stroke="#0b0d13" stroke-width="6" opacity=".95"/><rect x="480" y="470" width="80" height="22" fill="${RED}"/>`;
    return wrap(w, h, s);
  },
  mounts: () => {
    const w = 1200,
      h = 900,
      cx = w / 2;
    const s =
      dark(w, h) +
      `<rect x="${cx - 240}" y="${h * 0.6}" width="480" height="70" rx="10" fill="url(#metal)"/><rect x="${cx - 190}" y="${h * 0.34}" width="380" height="${h * 0.28}" rx="40" fill="${RED}" stroke="#5d0008" stroke-width="6"/><rect x="${cx - 120}" y="${h * 0.22}" width="240" height="${h * 0.14}" rx="14" fill="url(#metal)"/>` +
      ring(cx, h * 0.5, 50, "#17181e", "#0b0d13", 8);
    return wrap(w, h, s);
  },
  ecu: () => {
    const w = 1200,
      h = 900,
      cx = w / 2;
    let s =
      dark(w, h) +
      `<rect x="${cx - 300}" y="${h * 0.3}" width="600" height="${h * 0.4}" rx="22" fill="#1b1c23" stroke="#40454f" stroke-width="6"/><rect x="${cx - 300}" y="${h * 0.3}" width="600" height="60" rx="22" fill="${RED}"/>`;
    for (let i = 0; i < 12; i++) s += `<rect x="${cx - 260 + i * 44}" y="${h * 0.66}" width="18" height="40" fill="#d4d8e0"/>`;
    s += `<rect x="${cx - 120}" y="${h * 0.44}" width="240" height="120" rx="8" fill="#0b0d13" stroke="#9aa0ae" stroke-width="4"/><text x="${cx}" y="${h * 0.54}" text-anchor="middle" font-family="Impact,sans-serif" font-size="56" fill="#fff" letter-spacing="4">ECU</text>`;
    return wrap(w, h, s);
  },
  diagnostics: () => {
    const w = 1200,
      h = 900,
      x = w * 0.2,
      y = h * 0.15,
      sw = w * 0.6,
      sh = h * 0.5;
    let s =
      dark(w, h) +
      `<rect x="${x}" y="${y}" width="${sw}" height="${sh}" rx="14" fill="#0b0d13" stroke="#40454f" stroke-width="6"/><rect x="${x + 20}" y="${y + 20}" width="${sw - 40}" height="${sh - 40}" fill="#071018"/>`;
    let p = "";
    for (let i = 0; i <= 60; i++)
      p += `${i ? "L" : "M"}${x + 30 + (i * (sw - 60)) / 60},${y + sh / 2 + Math.sin(i / 3) * 40 * Math.cos(i / 11)} `;
    s += `<path d="${p}" stroke="#2cff8a" stroke-width="4" fill="none"/>`;
    let p2 = "";
    for (let i = 0; i <= 60; i++) p2 += `${i ? "L" : "M"}${x + 30 + (i * (sw - 60)) / 60},${y + sh / 2 + 70 + Math.sin(i / 2) * 22} `;
    s += `<path d="${p2}" stroke="${RED}" stroke-width="4" fill="none"/><path d="M${x - 60},${y + sh + 20} L${x + sw + 60},${y + sh + 20} L${x + sw + 10},${y + sh + 80} L${x + 50},${y + sh + 80} Z" fill="url(#metal)"/>`;
    return wrap(w, h, s);
  },
};

export const artKinds = Object.keys(kinds);

export function renderArt(kind: string, color?: string | null): string | null {
  const fn = kinds[kind];
  return fn ? fn(hex(color)) : null;
}

const palette = ["0d0f15", "b3000f", "d9dde6", "1b2a4a", "2a2d36", "6b0a12", "e8e8ea", "243a2f"];
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const partKinds: [RegExp, string][] = [
  [/turbo/i, "turbo"],
  [/intake/i, "intake"],
  [/brake|disc|pad/i, "brakes"],
  [/coil|suspension|shock|spring/i, "coilover"],
  [/exhaust/i, "exhaust"],
  [/mount/i, "mounts"],
  [/clutch|gearbox/i, "clutch"],
  [/ecu|tune|tuning|sensor|electr/i, "ecu"],
  [/engine|piston|head/i, "engine"],
];

/** Placeholder art URL for a document that has no uploaded photo. */
export function artFor(type: string, doc: Record<string, any>, index = 0): string {
  const text = `${doc.title ?? ""} ${doc.category ?? ""} ${doc.caption ?? ""}`;
  if (type === "part") {
    const k = partKinds.find(([re]) => re.test(text))?.[1] ?? "engine";
    return `/api/art/${k}`;
  }
  if (type === "service") {
    const k = partKinds.find(([re]) => re.test(text))?.[1];
    if (/diagnos/i.test(text)) return "/api/art/diagnostics";
    if (/service/i.test(text) && !k) return "/api/art/workshop";
    return `/api/art/${k ?? "engine"}`;
  }
  if (type === "galleryImage") {
    if (/lift/i.test(text)) return "/api/art/lift";
    if (/diagnos/i.test(text)) return "/api/art/diagnostics";
    if (/clutch/i.test(text)) return "/api/art/clutch";
    if (/suspension/i.test(text)) return "/api/art/suspension";
    if (/engine/i.test(text)) return "/api/art/engine";
    const c = palette[(hash(text) + index) % palette.length];
    return `/api/art/car?c=${c}`;
  }
  // vehicle
  const c = palette[hash(text) % palette.length];
  return `/api/art/car?c=${c}`;
}
