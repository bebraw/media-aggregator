import { describe, expect, it } from "vitest";
import { parseFeed } from "./feed-parser";

describe("parseFeed", () => {
  it("extracts and decodes RSS headline metadata", () => {
    const items = parseFeed(`<?xml version="1.0"?><rss><channel><item>
      <title><![CDATA[Markets &amp; cities <b>respond</b>]]></title>
      <link>https://publisher.example/story?a=1&amp;b=2</link>
      <guid>story-1</guid><pubDate>Wed, 02 Sep 2026 08:00:00 GMT</pubDate>
    </item></channel></rss>`);

    expect(items).toEqual([
      {
        id: "story-1",
        title: "Markets & cities respond",
        url: "https://publisher.example/story?a=1&b=2",
        publishedAt: "2026-09-02T08:00:00.000Z",
      },
    ]);
  });

  it("supports RDF feeds and rejects incomplete or unsafe items", () => {
    const items = parseFeed(`<rdf:RDF><item rdf:about="https://publisher.example/one">
      <title>First headline</title><link>https://publisher.example/one</link>
      <dc:date>2026-09-02T07:00:00Z</dc:date></item>
      <item><title>Missing link</title></item>
      <item><title>Unsafe</title><link>javascript:alert(1)</link></item></rdf:RDF>`);

    expect(items).toEqual([
      {
        id: "https://publisher.example/one",
        title: "First headline",
        url: "https://publisher.example/one",
        publishedAt: "2026-09-02T07:00:00.000Z",
      },
    ]);
  });

  it("upgrades HTTP publisher links and decodes numeric entities", () => {
    expect(
      parseFeed(
        `<rss><channel><item><title>Japan &#38; weather &#x2600;</title><link>http://publisher.example/one</link></item></channel></rss>`,
      ),
    ).toEqual([
      {
        id: "https://publisher.example/one",
        title: "Japan & weather ☀",
        url: "https://publisher.example/one",
        publishedAt: null,
      },
    ]);
  });
});
