export function money(cents: number) {
  const abs = Math.abs(Math.round(cents));
  const dollars = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return `${cents < 0 ? "-" : ""}$${dollars}.${rest}`;
}

export function parseTracks(value: unknown): { title: string; duration: string }[] {
  const raw = typeof value === "string" ? safeJson(value) : value;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const title = "title" in row ? String(row.title ?? "") : "";
      const duration = "duration" in row ? String(row.duration ?? "") : "";
      if (!title) return null;
      return { title, duration };
    })
    .filter((row): row is { title: string; duration: string } => row !== null);
}

function safeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function clip(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export const MARKET_ALL = { q: "", genre: "", aisle: "all" as const };

export const GENRES = [
  "Ambient soul",
  "Folk",
  "Electronic",
  "Hip-hop",
  "Post-punk",
  "Gospel",
] as const;

export const RESERVED_HANDLES = new Set([
  "mira-sol",
  "night-dispatch",
  "juniper-hale",
  "kestrel",
  "sable-choir",
  "rio-pell",
]);
