import { headlineRegions, type Headline, type RegionFilter } from "../news/preview-headlines";
import { escapeHtml } from "./shared";

const appTitle = "GLOBAL HEADLINE INDEX";
const appDescription = "A direct global view of major headlines, translated into English and linked back to the original reporting.";

interface RenderHomePageOptions {
  headlines: readonly Headline[];
  activeRegion: RegionFilter;
}

export function renderHomePage({ headlines, activeRegion }: RenderHomePageOptions): string {
  const filters = headlineRegions
    .map((region) => {
      const isActive = region.slug === activeRegion;
      const href = region.slug === "all" ? "/" : `/?region=${region.slug}`;
      const activeLabel = isActive ? `${region.label} / active` : region.label;

      return `<a
        class="border-r-2 border-app-line px-3 py-3 text-[0.68rem] font-black uppercase tracking-[0.12em] last:border-r-0 hover:bg-app-signal focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-app-blue sm:px-4"
        href="${href}"
        ${isActive ? 'aria-current="page"' : ""}
        aria-label="${escapeHtml(activeLabel)}"
      >${escapeHtml(region.label)}</a>`;
    })
    .join("");

  const headlineItems = headlines.map(renderHeadline).join("");
  const headlineCount = `${headlines.length} HEADLINE${headlines.length === 1 ? "" : "S"}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(appDescription)}">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(appTitle)} — Media Aggregator</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="min-h-screen bg-app-canvas text-app-text antialiased">
    <a class="fixed left-3 top-3 z-50 -translate-y-24 border-2 border-app-line bg-app-signal px-4 py-3 font-black uppercase transition focus:translate-y-0" href="#main">Skip to main content</a>

    <header class="border-b-[3px] border-app-line">
      <div class="flex min-h-10 items-stretch justify-between border-b-2 border-app-line bg-app-text text-app-canvas">
        <p class="flex items-center px-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] sm:px-5">Media aggregator / 001</p>
        <p class="flex items-center border-l-2 border-app-canvas/40 bg-app-red px-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-white sm:px-5">PREVIEW DATA / NOT LIVE</p>
      </div>

      <div class="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="border-b-[3px] border-app-line p-4 sm:p-6 lg:border-r-[3px] lg:border-b-0">
          <p class="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em]">One screen. Many regions. Original sources.</p>
          <h1 aria-label="GLOBAL HEADLINE INDEX" class="max-w-[10ch] text-[clamp(3.4rem,10vw,9.5rem)] leading-[0.75] font-black tracking-[-0.085em] uppercase">Global<br>Headline<br>Index</h1>
        </div>
        <div class="grid grid-rows-[1fr_auto]">
          <div class="flex flex-col justify-between gap-8 p-5 sm:p-7">
            <p class="max-w-[28rem] text-lg leading-[1.25] font-bold tracking-[-0.02em]">${escapeHtml(appDescription)}</p>
            <dl class="grid grid-cols-2 border-2 border-app-line font-mono text-[0.68rem] uppercase">
              <div class="border-r-2 border-app-line p-3">
                <dt class="text-app-muted">Mode</dt>
                <dd class="mt-1 font-black">Local preview</dd>
              </div>
              <div class="p-3">
                <dt class="text-app-muted">Sources live</dt>
                <dd class="mt-1 font-black">0 / 6</dd>
              </div>
            </dl>
          </div>
          <div class="border-t-2 border-app-line bg-app-signal p-4 font-mono text-xs font-black uppercase leading-5">
            Synthetic headlines for interface review. Live feeds and translation are the next implementation boundary.
          </div>
        </div>
      </div>

      <nav aria-label="Filter headlines by region" class="overflow-x-auto border-t-[3px] border-app-line bg-app-surface">
        <div class="flex min-w-max">${filters}</div>
      </nav>
    </header>

    <main id="main">
      <section aria-labelledby="headline-count">
        <div class="flex items-center justify-between border-b-[3px] border-app-line px-4 py-3 sm:px-6">
          <h2 id="headline-count" class="font-mono text-xs font-black uppercase tracking-[0.16em]">Index / ${headlineCount}</h2>
          <p class="font-mono text-[0.68rem] font-bold uppercase text-app-muted">Order / newest first</p>
        </div>
        <div>${headlineItems}</div>
      </section>
    </main>

    <footer class="grid border-t-[3px] border-app-line bg-app-text text-app-canvas sm:grid-cols-3">
      <p class="border-b border-app-canvas/40 p-4 font-mono text-[0.68rem] uppercase sm:border-r sm:border-b-0">Build / interface review</p>
      <p class="border-b border-app-canvas/40 p-4 font-mono text-[0.68rem] uppercase sm:border-r sm:border-b-0">Content / synthetic</p>
      <a class="p-4 font-mono text-[0.68rem] font-bold uppercase hover:bg-app-blue focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-app-signal" href="/api/health">System health ↗</a>
    </footer>
  </body>
</html>`;
}

function renderHeadline(headline: Headline, index: number): string {
  const sourceUrl = safeExternalUrl(headline.url);
  const isTranslated = headline.languageCode !== "EN";
  const languageLabel = isTranslated ? `${headline.languageCode} → EN` : "EN / ORIGINAL";
  const originalHeadline = isTranslated
    ? `<p class="mt-3 max-w-3xl font-mono text-xs leading-5 text-app-muted" lang="${escapeHtml(headline.languageCode.toLowerCase())}"><span class="font-black uppercase">Original / </span>${escapeHtml(headline.originalHeadline)}</p>`
    : "";

  return `<article class="group grid border-b-2 border-app-line bg-app-surface last:border-b-0 md:grid-cols-[8rem_minmax(0,1fr)_9rem]">
    <div class="flex items-start justify-between border-b-2 border-app-line bg-app-signal p-4 md:block md:border-r-2 md:border-b-0">
      <p class="text-5xl leading-none font-black tracking-[-0.08em]">${String(index + 1).padStart(2, "0")}</p>
      <p class="font-mono text-[0.65rem] font-black uppercase tracking-[0.1em] md:mt-6">${escapeHtml(headline.region)}</p>
    </div>

    <div class="p-4 sm:p-6">
      <div class="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em]">
        <span class="bg-app-text px-2 py-1 text-app-canvas">${escapeHtml(headline.source)}</span>
        <span>${escapeHtml(languageLabel)}</span>
        <span class="text-app-muted">${escapeHtml(headline.publishedLabel)}</span>
      </div>
      <h3 class="max-w-[30ch] text-[clamp(1.8rem,4.4vw,3.8rem)] leading-[0.95] font-black tracking-[-0.055em]">${escapeHtml(headline.translatedHeadline)}</h3>
      ${originalHeadline}
    </div>

    <a
      class="flex min-h-20 items-center justify-between border-t-2 border-app-line p-4 font-mono text-[0.68rem] font-black uppercase tracking-[0.08em] hover:bg-app-blue hover:text-white focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-app-blue md:min-h-full md:flex-col md:items-start md:border-t-0 md:border-l-2"
      href="${escapeHtml(sourceUrl)}"
      rel="external noreferrer"
    >
      <span>View source</span>
      <span aria-hidden="true" class="text-2xl">↗</span>
    </a>
  </article>`;
}

function safeExternalUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "#";
  } catch {
    return "#";
  }
}
