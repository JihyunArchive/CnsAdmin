const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const FILE_BASE =
    import.meta.env.VITE_FILE_BASE_URL?.replace(/\/$/, "") ||
    (API_BASE?.replace(/\/api$/, "") || "");

export function toIconUrl(iconKeyOrPath) {
    if (!iconKeyOrPath) return null;
    const s = String(iconKeyOrPath).trim();

    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith("/")) return `${FILE_BASE}${s}`;
    if (/^(icons|uploads|images)\//i.test(s)) return `${FILE_BASE}/${s}`;

    const base = s.startsWith("ic_") ? `image_${s.slice(3)}` : s;
    const file = base.includes(".") ? base : `${base}.png`;
    return `${FILE_BASE}/icons/${file}`;
}
