import { type Headline } from "./preview-headlines";
import { parseFeed } from "./feed-parser";

export interface NewsSource {
  id: string;
  name: string;
  region: Headline["region"];
  language: string;
  languageCode: string;
  translationCode: string;
  feedUrl: string;
  articleHosts: readonly string[];
}

export interface Translator {
  translate(text: string, sourceLanguage: string): Promise<string>;
}

export interface SourceStatus {
  id: string;
  name: string;
  state: "live" | "error";
  headlineCount: number;
  message: string;
}

export interface HeadlineSnapshot {
  state: "live" | "partial" | "error";
  headlines: readonly Headline[];
  sources: readonly SourceStatus[];
  retrievedAt: string;
}

interface LoadHeadlineOptions {
  sources: readonly NewsSource[];
  fetchFeed: (url: string) => Promise<string>;
  translator: Translator;
  now?: () => Date;
  itemsPerSource?: number;
}

export async function loadHeadlines({
  sources,
  fetchFeed,
  translator,
  now = () => new Date(),
  itemsPerSource = 2,
}: LoadHeadlineOptions): Promise<HeadlineSnapshot> {
  const results = await Promise.all(sources.map((source) => loadSource(source, fetchFeed, translator, itemsPerSource)));
  const headlines = results
    .flatMap((result) => result.headlines)
    .sort((left, right) => (right.publishedAt ?? "").localeCompare(left.publishedAt ?? ""));
  const sourceStatuses = results.map((result) => result.status);
  const liveCount = sourceStatuses.filter((source) => source.state === "live").length;

  return {
    state: liveCount === sources.length ? "live" : liveCount === 0 ? "error" : "partial",
    headlines,
    sources: sourceStatuses,
    retrievedAt: now().toISOString(),
  };
}

async function loadSource(
  source: NewsSource,
  fetchFeed: (url: string) => Promise<string>,
  translator: Translator,
  limit: number,
): Promise<{ headlines: readonly Headline[]; status: SourceStatus }> {
  try {
    const items = parseFeed(await fetchFeed(source.feedUrl))
      .map((item) => ({ ...item, url: normalizePublisherUrl(item.url, source.articleHosts) }))
      .filter((item): item is typeof item & { url: string } => item.url !== null)
      .filter(uniqueByCanonicalUrl())
      .slice(0, limit);

    if (items.length === 0) throw new Error("No valid headlines returned");

    const headlines = await Promise.all(
      items.map(async (item): Promise<Headline> => {
        const translatedHeadline =
          source.languageCode === "EN" ? item.title : await translator.translate(item.title, source.translationCode);
        return {
          id: `${source.id}:${item.id}`,
          source: source.name,
          region: source.region,
          language: source.language,
          languageCode: source.languageCode,
          publishedAt: item.publishedAt,
          publishedLabel: formatPublishedTime(item.publishedAt),
          translatedHeadline,
          originalHeadline: item.title,
          url: item.url,
        };
      }),
    );

    return {
      headlines,
      status: { id: source.id, name: source.name, state: "live", headlineCount: headlines.length, message: "Feed current" },
    };
  } catch (error) {
    return {
      headlines: [],
      status: {
        id: source.id,
        name: source.name,
        state: "error",
        headlineCount: 0,
        message: error instanceof Error ? error.message : "Unknown source error",
      },
    };
  }
}

function uniqueByCanonicalUrl(): (item: { url: string }) => boolean {
  const seenUrls = new Set<string>();
  return (item) => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  };
}

function normalizePublisherUrl(value: string, allowedHosts: readonly string[]): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

function formatPublishedTime(value: string | null): string {
  if (!value) return "TIME UNKNOWN";
  return `${value.slice(11, 16)} UTC`;
}
