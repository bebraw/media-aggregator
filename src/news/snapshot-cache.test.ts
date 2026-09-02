import { describe, expect, it } from "vitest";
import { createSnapshotCache, type SnapshotCacheBackend } from "./snapshot-cache";
import { type HeadlineSnapshot } from "./load-headlines";

const snapshot: HeadlineSnapshot = {
  state: "live",
  headlines: [],
  sources: [],
  retrievedAt: "2026-09-02T09:00:00.000Z",
};

describe("createSnapshotCache", () => {
  it("round-trips snapshots with a five-minute cache policy", async () => {
    let stored: Response | undefined;
    const backend: SnapshotCacheBackend = {
      match: async () => stored?.clone(),
      put: async (_request, response) => {
        stored = response.clone();
      },
    };
    const cache = createSnapshotCache(backend);

    expect(await cache.get()).toBeNull();
    await cache.put(snapshot);
    await expect(cache.get()).resolves.toEqual(snapshot);
    expect(stored?.headers.get("cache-control")).toBe("public, max-age=300");
  });

  it("ignores malformed cache entries", async () => {
    const cache = createSnapshotCache({
      match: async () => new Response("not json"),
      put: async () => undefined,
    });

    await expect(cache.get()).resolves.toBeNull();
  });
});
