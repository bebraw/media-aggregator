import { describe, expect, it, vi } from "vitest";
import { loadHeadlines, type NewsSource, type Translator } from "./load-headlines";

const sources: readonly NewsSource[] = [
  {
    id: "english",
    name: "English Wire",
    region: "Europe",
    language: "English",
    languageCode: "EN",
    translationCode: "en",
    feedUrl: "https://english.example/feed.xml",
    articleHosts: ["english.example"],
  },
  {
    id: "french",
    name: "French Wire",
    region: "Europe",
    language: "French",
    languageCode: "FR",
    translationCode: "fr",
    feedUrl: "https://french.example/feed.xml",
    articleHosts: ["french.example"],
  },
  {
    id: "offline",
    name: "Offline Wire",
    region: "East Asia",
    language: "Japanese",
    languageCode: "JA",
    translationCode: "ja",
    feedUrl: "https://offline.example/feed.xml",
    articleHosts: ["offline.example"],
  },
];

describe("loadHeadlines", () => {
  it("normalizes, translates, orders, and isolates source failures", async () => {
    const fetchFeed = vi.fn(async (url: string) => {
      if (url.includes("offline")) throw new Error("timeout");
      const title = url.includes("french") ? "Titre français" : "English headline";
      const host = url.includes("french") ? "french.example" : "english.example";
      const date = url.includes("french") ? "2026-09-02T08:00:00Z" : "2026-09-02T07:00:00Z";
      return `<rss><channel><item><title>${title}</title><link>https://${host}/story</link><pubDate>${date}</pubDate></item></channel></rss>`;
    });
    const translator: Translator = {
      translate: vi.fn(async (text) => `English: ${text}`),
    };

    const snapshot = await loadHeadlines({
      sources,
      fetchFeed,
      translator,
      now: () => new Date("2026-09-02T09:00:00Z"),
      itemsPerSource: 1,
    });

    expect(snapshot.state).toBe("partial");
    expect(snapshot.retrievedAt).toBe("2026-09-02T09:00:00.000Z");
    expect(snapshot.headlines.map((headline) => headline.translatedHeadline)).toEqual(["English: Titre français", "English headline"]);
    expect(translator.translate).toHaveBeenCalledOnce();
    expect(snapshot.sources).toEqual([
      expect.objectContaining({ id: "english", state: "live", headlineCount: 1 }),
      expect.objectContaining({ id: "french", state: "live", headlineCount: 1 }),
      expect.objectContaining({ id: "offline", state: "error", headlineCount: 0 }),
    ]);
  });

  it("rejects article links outside the publisher allowlist", async () => {
    const snapshot = await loadHeadlines({
      sources: [sources[0]!],
      fetchFeed: async () =>
        `<rss><channel><item><title>Injected</title><link>https://attacker.example/story</link></item></channel></rss>`,
      translator: { translate: async (text) => text },
      now: () => new Date("2026-09-02T09:00:00Z"),
      itemsPerSource: 1,
    });

    expect(snapshot.headlines).toHaveLength(0);
    expect(snapshot.sources[0]).toMatchObject({ state: "error", headlineCount: 0 });
  });
});
