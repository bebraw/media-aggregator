import { describe, expect, it } from "vitest";
import { previewHeadlines } from "../news/preview-headlines";
import { renderHomePage } from "./home";

describe("renderHomePage", () => {
  it("renders the preview dashboard and stylesheet wiring", () => {
    const html = renderHomePage({
      headlines: previewHeadlines,
      activeRegion: "all",
    });

    expect(html).toContain("GLOBAL HEADLINE INDEX");
    expect(html).toContain("PREVIEW DATA / NOT LIVE");
    expect(html).toContain("Cities announce a new regional transit plan");
    expect(html).toContain("都市交通の新計画を発表");
    expect(html).toContain("JA → EN");
    expect(html).toContain("6 HEADLINES");
    expect(html).toContain('href="/?preview=1&amp;region=europe"');
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
    expect(html).toContain(`<meta name="description" content="A direct global view`);
    expect(html).toContain('<meta name="color-scheme" content="light">');
    expect(html).toContain('href="#main">Skip to main content</a>');
    expect(html).toContain('<main id="main"');
    expect(html.match(/<article/g)).toHaveLength(previewHeadlines.length);
  });

  it("escapes upstream headline metadata", () => {
    const html = renderHomePage({
      headlines: [
        {
          id: "unsafe",
          source: "<script>alert(1)</script>",
          region: "Europe",
          language: "English",
          languageCode: "EN",
          publishedLabel: "NOW",
          translatedHeadline: "<img src=x onerror=alert(1)>",
          originalHeadline: "<b>unsafe</b>",
          url: "https://example.com/?a=1&b=2",
        },
      ],
      activeRegion: "all",
    });

    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("a=1&amp;b=2");
  });

  it("rejects non-HTTPS outbound source links", () => {
    const html = renderHomePage({
      headlines: [
        {
          id: "insecure",
          source: "Unsafe source",
          region: "Europe",
          language: "English",
          languageCode: "EN",
          publishedLabel: "NOW",
          translatedHeadline: "Unsafe link",
          originalHeadline: "Unsafe link",
          url: "http://example.com/story",
        },
      ],
      activeRegion: "all",
    });

    expect(html).not.toContain("http://example.com/story");
    expect(html).toContain('href="#"');
  });
});
