import { createHealthResponse } from "./api/health";
import { appRoutes } from "./app-routes";
import { fetchFeedText } from "./news/live-services";
import { loadHeadlines, type HeadlineSnapshot, type Translator } from "./news/load-headlines";
import { parseRegionFilter, selectHeadlines, selectPreviewHeadlines } from "./news/preview-headlines";
import { newsSources } from "./news/sources";
import { createSnapshotCache, type SnapshotCache, type SnapshotCacheBackend } from "./news/snapshot-cache";
import { createWorkersAiTranslator, type WorkersAiBinding } from "./news/workers-ai-translator";
import { renderHomePage } from "./views/home";
import { renderNotFoundPage } from "./views/not-found";
import { cssResponse, htmlResponse } from "./views/shared";

export default {
  async fetch(request: Request, env: WorkerEnv = {}): Promise<Response> {
    return await handleRequest(request, env);
  },
};

export interface WorkerEnv {
  AI?: WorkersAiBinding;
}

interface WorkerDependencies {
  loadSnapshot?: () => Promise<HeadlineSnapshot>;
  cache?: SnapshotCache | null;
}

export async function handleRequest(request: Request, env: WorkerEnv = {}, dependencies: WorkerDependencies = {}): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/styles.css") {
    return cssResponse(await loadStylesheet());
  }

  if (url.pathname === "/") {
    const activeRegion = parseRegionFilter(url.searchParams.get("region"));
    if (url.searchParams.get("preview") === "1") {
      return htmlResponse(
        renderHomePage({
          headlines: selectPreviewHeadlines(activeRegion),
          activeRegion,
        }),
      );
    }

    const cache = dependencies.cache === undefined ? getRuntimeCache() : dependencies.cache;
    const cachedSnapshot = url.searchParams.get("refresh") === "1" ? null : await cache?.get();
    const snapshot = cachedSnapshot ?? (await (dependencies.loadSnapshot ?? (() => loadLiveSnapshot(env)))());
    if (!cachedSnapshot) await cache?.put(snapshot);

    return htmlResponse(
      renderHomePage({
        headlines: selectHeadlines(snapshot.headlines, activeRegion),
        activeRegion,
        mode: cachedSnapshot ? "cached" : snapshot.state,
        sources: snapshot.sources,
        retrievedAt: snapshot.retrievedAt,
      }),
    );
  }

  if (url.pathname === "/api/health") {
    return createHealthResponse(appRoutes.map((route) => route.path));
  }

  return htmlResponse(renderNotFoundPage(url.pathname), 404);
}

async function loadLiveSnapshot(env: WorkerEnv): Promise<HeadlineSnapshot> {
  const translator: Translator = env.AI
    ? createWorkersAiTranslator(env.AI)
    : { translate: async () => Promise.reject(new Error("English translation service unavailable")) };
  return await loadHeadlines({
    sources: newsSources,
    fetchFeed: fetchFeedText,
    translator,
  });
}

function getRuntimeCache(): SnapshotCache | null {
  const runtime = globalThis as typeof globalThis & { caches?: { default?: SnapshotCacheBackend } };
  return runtime.caches?.default ? createSnapshotCache(runtime.caches.default) : null;
}

async function loadStylesheet(): Promise<string> {
  // Stryker disable next-line ConditionalExpression,OptionalChaining: Environment probe selects Node fs in tests and bundled CSS in Workers.
  if (typeof process !== "undefined" && process.release?.name === "node") {
    const { readFile } = await import("node:fs/promises");
    return await readFile(new URL("../.generated/styles.css", import.meta.url), "utf8");
  }

  const styles = await import("../.generated/styles.css");
  return styles.default;
}
