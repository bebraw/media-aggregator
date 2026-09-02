import { type HeadlineSnapshot } from "./load-headlines";

const cacheKey = "https://media-aggregator.invalid/snapshots/headlines-v1";

export interface SnapshotCacheBackend {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export interface SnapshotCache {
  get(): Promise<HeadlineSnapshot | null>;
  put(snapshot: HeadlineSnapshot): Promise<void>;
}

export function createSnapshotCache(backend: SnapshotCacheBackend): SnapshotCache {
  const request = new Request(cacheKey);
  return {
    async get() {
      try {
        const response = await backend.match(request);
        if (!response) return null;
        const value: unknown = await response.json();
        return isHeadlineSnapshot(value) ? value : null;
      } catch {
        return null;
      }
    },
    async put(snapshot) {
      await backend.put(
        request,
        new Response(JSON.stringify(snapshot), {
          headers: {
            "cache-control": "public, max-age=300",
            "content-type": "application/json; charset=utf-8",
          },
        }),
      );
    },
  };
}

function isHeadlineSnapshot(value: unknown): value is HeadlineSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.state === "live" || candidate.state === "partial" || candidate.state === "error") &&
    Array.isArray(candidate.headlines) &&
    Array.isArray(candidate.sources) &&
    typeof candidate.retrievedAt === "string"
  );
}
