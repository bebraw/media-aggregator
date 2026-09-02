import { createHealthResponse } from "./api/health";
import { appRoutes } from "./app-routes";
import { parseRegionFilter, selectPreviewHeadlines } from "./news/preview-headlines";
import { renderHomePage } from "./views/home";
import { renderNotFoundPage } from "./views/not-found";
import { cssResponse, htmlResponse } from "./views/shared";

export default {
  async fetch(request: Request): Promise<Response> {
    return await handleRequest(request);
  },
};

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/styles.css") {
    return cssResponse(await loadStylesheet());
  }

  if (url.pathname === "/") {
    const activeRegion = parseRegionFilter(url.searchParams.get("region"));
    return htmlResponse(
      renderHomePage({
        headlines: selectPreviewHeadlines(activeRegion),
        activeRegion,
      }),
    );
  }

  if (url.pathname === "/api/health") {
    return createHealthResponse(appRoutes.map((route) => route.path));
  }

  return htmlResponse(renderNotFoundPage(url.pathname), 404);
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
