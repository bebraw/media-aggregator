import { describe, expect, it, vi } from "vitest";
import { fetchFeedText } from "./live-services";
import { createWorkersAiTranslator } from "./workers-ai-translator";

describe("fetchFeedText", () => {
  it("returns a successful bounded feed body", async () => {
    const fetcher = vi.fn(async () => new Response("<rss />", { headers: { "content-type": "application/rss+xml" } }));

    await expect(fetchFeedText("https://publisher.example/feed", fetcher)).resolves.toBe("<rss />");
  });

  it("rejects failed and oversized responses", async () => {
    await expect(fetchFeedText("https://publisher.example/feed", async () => new Response("down", { status: 503 }))).rejects.toThrow(
      "HTTP 503",
    );

    await expect(
      fetchFeedText("https://publisher.example/feed", async () => new Response("large", { headers: { "content-length": "1000001" } }), {
        maxBytes: 1_000_000,
      }),
    ).rejects.toThrow("maximum size");

    await expect(fetchFeedText("https://publisher.example/feed", async () => new Response("too large"), { maxBytes: 2 })).rejects.toThrow(
      "maximum size",
    );
  });

  it("handles a successful response without a body", async () => {
    await expect(fetchFeedText("https://publisher.example/feed", async () => new Response(null))).resolves.toBe("");
  });
});

describe("createWorkersAiTranslator", () => {
  it("calls the translation model with language codes", async () => {
    const run = vi.fn(async () => ({ translated_text: "English title" }));
    const translator = createWorkersAiTranslator({ run });

    await expect(translator.translate("Titre français", "fr")).resolves.toBe("English title");
    expect(run).toHaveBeenCalledWith("@cf/meta/m2m100-1.2b", {
      text: "Titre français",
      source_lang: "fr",
      target_lang: "en",
    });
  });

  it("rejects malformed model output", async () => {
    const translator = createWorkersAiTranslator({ run: async () => ({}) });
    await expect(translator.translate("Titre", "fr")).rejects.toThrow("did not return translated text");
  });
});
