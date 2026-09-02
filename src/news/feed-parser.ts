export interface FeedItem {
  id: string;
  title: string;
  url: string;
  publishedAt: string | null;
}

const itemPattern = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;

export function parseFeed(xml: string): readonly FeedItem[] {
  return Array.from(xml.matchAll(itemPattern), (match) => parseItem(match[1] ?? "")).filter((item): item is FeedItem => item !== null);
}

function parseItem(xml: string): FeedItem | null {
  const title = cleanText(readElement(xml, "title"));
  const rawUrl = cleanText(readElement(xml, "link"));
  const url = normalizeHttpsUrl(rawUrl);

  if (!title || !url) return null;

  const rawDate = cleanText(readElement(xml, "pubDate")) || cleanText(readElement(xml, "dc:date"));
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const publishedAt = parsedDate && !Number.isNaN(parsedDate.valueOf()) ? parsedDate.toISOString() : null;
  const id = cleanText(readElement(xml, "guid")) || url;

  return { id, title, url, publishedAt };
}

function readElement(xml: string, name: string): string {
  const escapedName = name.replace(":", "\\:");
  const match = new RegExp(`<${escapedName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedName}>`, "i").exec(xml);
  return match?.[1] ?? "";
}

function cleanText(value: string): string {
  return decodeXmlEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeXmlEntities(value: string): string {
  const named: Readonly<Record<string, string>> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
    nbsp: " ",
  };

  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith("#x")) return safeCodePoint(Number.parseInt(code.slice(2), 16), entity);
    if (code.startsWith("#")) return safeCodePoint(Number.parseInt(code.slice(1), 10), entity);
    return named[code.toLowerCase()] ?? entity;
  });
}

function safeCodePoint(codePoint: number, fallback: string): string {
  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return fallback;
  }
}

function normalizeHttpsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol === "http:") url.protocol = "https:";
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
