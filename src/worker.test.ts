import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { handleRequest } from "./worker";
import { ensureGeneratedStylesheet } from "./test-support";

ensureGeneratedStylesheet();

describe("worker", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("renders the preview headline dashboard", async () => {
    const response = await handleRequest(new Request("http://example.com/?preview=1"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");

    const body = await response.text();
    expect(body).toContain("GLOBAL HEADLINE INDEX");
    expect(body).toContain("PREVIEW DATA / NOT LIVE");
    expect(body).toContain("6 HEADLINES");
  });

  it("filters preview headlines by region", async () => {
    const response = await handleRequest(new Request("http://example.com/?preview=1&region=europe"));
    const body = await response.text();

    expect(body).toContain("Europe / active");
    expect(body).toContain("Civic Dispatch");
    expect(body).not.toContain("Metro East");
    expect(body).toContain("1 HEADLINE");
  });

  it("renders and caches a live partial snapshot", async () => {
    const snapshot = {
      state: "partial" as const,
      retrievedAt: "2026-09-02T09:00:00.000Z",
      headlines: [
        {
          id: "live-one",
          source: "BBC News",
          region: "Europe" as const,
          language: "English",
          languageCode: "EN",
          publishedAt: "2026-09-02T08:00:00.000Z",
          publishedLabel: "08:00 UTC",
          translatedHeadline: "A live headline",
          originalHeadline: "A live headline",
          url: "https://www.bbc.com/news/example",
        },
      ],
      sources: [
        { id: "bbc", name: "BBC News", state: "live" as const, headlineCount: 1, message: "Feed current" },
        { id: "nhk", name: "NHK News", state: "error" as const, headlineCount: 0, message: "Translation unavailable" },
      ],
    };
    let stored = false;
    const response = await handleRequest(
      new Request("http://example.com/"),
      {},
      {
        loadSnapshot: async () => snapshot,
        cache: {
          get: async () => null,
          put: async () => {
            stored = true;
          },
        },
      },
    );
    const body = await response.text();

    expect(body).toContain("PARTIAL DATA");
    expect(body).toContain("A live headline");
    expect(body).toContain("NHK News");
    expect(body).toContain("2026-09-02 09:00:00 UTC");
    expect(stored).toBe(true);
  });

  it("composes publisher feeds, Workers AI, and the runtime cache", async () => {
    const put = vi.fn(async () => undefined);
    vi.stubGlobal("caches", { default: { match: async () => undefined, put } });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        const source = input.includes("bbc")
          ? { title: "English title", url: "https://www.bbc.com/news/one" }
          : input.includes("france24")
            ? { title: "Titre français", url: "https://www.france24.com/fr/one" }
            : input.includes("nhk")
              ? { title: "日本語の見出し", url: "https://www3.nhk.or.jp/news/one" }
              : input.includes("africanews")
                ? { title: "Africa title", url: "https://www.africanews.com/one" }
                : input.includes("cbc")
                  ? { title: "Americas title", url: "https://www.cbc.ca/news/one" }
                  : input.includes("aljazeera")
                    ? { title: "Middle East title", url: "https://www.aljazeera.com/news/one" }
                    : { title: "South Asia title", url: "https://www.thehindu.com/news/one" };
        return new Response(
          `<rss><channel><item><title>${source.title}</title><link>${source.url}</link><pubDate>2026-09-02T08:00:00Z</pubDate></item></channel></rss>`,
        );
      }),
    );

    const response = await handleRequest(new Request("http://example.com/?refresh=1"), {
      AI: { run: async () => ({ translated_text: "Translated title" }) },
    });
    const body = await response.text();

    expect(body).toContain("LIVE DATA");
    expect(body).toContain("7 / 7");
    expect(body).toContain("English title");
    expect(body).toContain("Translated title");
    expect(put).toHaveBeenCalledOnce();
  });

  it("returns a JSON health response", async () => {
    const response = await handleRequest(new Request("http://example.com/api/health"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      ok: true,
      name: "media-aggregator",
      routes: ["/", "/api/health"],
    });
  });

  it("returns a not found page for unknown routes", async () => {
    const response = await handleRequest(new Request("http://example.com/missing"));

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("content-security-policy")).toContain("default-src 'self'");

    const body = await response.text();
    expect(body).toContain("Not Found");
    expect(body).toContain("/missing");
  });

  it("exposes the same behavior through the worker fetch entrypoint", async () => {
    const response = await worker.fetch(new Request("http://example.com/api/health"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it("serves generated styles", async () => {
    const response = await handleRequest(new Request("http://example.com/styles.css"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/css");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    await expect(response.text()).resolves.toContain("--color-app-canvas:#f2f0e8");
  });
});
