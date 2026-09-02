# Feature: Media Aggregation

## Blueprint

### Context

The product is a personal way to scan major headlines without visiting many
publisher homepages. It should present a geographically balanced view, accept
configured sources in any language, translate non-English headline metadata
into English, and preserve a direct route to the original reporting.

“Global” and “all languages” describe the direction and ingestion capability.
The configured source roster remains the honest coverage boundary.

### Architecture

- **Planned capability source root:** `src/news/`
- **Composition root:** `src/worker.ts`
- **Primary surface:** server-rendered `GET /`
- **Health surface:** `GET /api/health`
- **Source authority:** an explicit, reviewable roster of supported publishers
  and their official feed or documented API endpoints
- **Content authority:** publisher-supplied headline metadata; the application
  does not become the authority for the underlying reporting
- **Translation boundary:** a replaceable translator that receives normalized
  headline metadata and returns English text while retaining original-language
  values
- **Initial refresh model:** on-demand retrieval with short-lived caching
- **Initial persistence:** none; history, scheduled collection, and durable
  storage require a later decision
- **Dependency direction:** Worker composition may depend on source adapters,
  normalization, translation, and rendering; source adapters and translation
  must not depend on presentation code
- **Failure boundary:** one unavailable publisher must not prevent other
  publishers from rendering, and partial results must be visible as partial
- **Access boundary:** local personal use until public access and authentication
  are decided explicitly

Workers AI is the first translation provider, isolated behind the replaceable
`Translator` contract documented by ADR-056. The live slice translates at most
two records per non-English source per retrieval and caches normalized results
for five minutes. Local live use requires an authenticated Cloudflare account
and can incur Workers AI usage.

### Current Preview Slice

- Six synthetic headline records demonstrate the intended multilingual domain
  shape without making claims about live publishers or current events.
- Server-rendered region filters exercise the Worker, domain selection, and
  presentation seams without client-side JavaScript.
- The interface clearly labels its data as synthetic and reports zero live
  sources.
- External metadata is escaped before rendering, and outbound URLs are limited
  to HTTPS.
- This preview is an implemented feedback surface, not completion of the live
  aggregation loop.

### Current Live Slice

- The explicit roster contains BBC News in English, France 24 in French, and
  NHK News in Japanese. This is a working ingestion slice, not representative
  global coverage.
- Feed responses are time- and size-bounded. Article URLs must use HTTPS and
  match the configured publisher host allowlist.
- Workers AI translates French and Japanese headline text to English while the
  original text remains visible.
- A normalized snapshot is cached for five minutes. `?refresh=1` bypasses the
  read path for a manual refresh, and `?preview=1` retains the deterministic
  synthetic interface.
- Fetch or translation failures remove only that source's records and appear in
  the page's partial-coverage block.

### Editorial Contract

- Start with a small, geographically balanced roster of major outlets.
- Prefer publishers with original reporting, named editorial responsibility,
  transparent corrections, and a stable official ingestion mechanism.
- Treat inclusion as a curated product choice, not an objective trust score.
- Preserve publisher name, canonical article URL, original language,
  publication time when available, original headline, and translated headline.
- Collapse repeated entries with the same canonical article URL before applying
  a source's headline limit, retaining the first and therefore freshest feed
  entry.
- Link to the publisher instead of copying full article bodies.
- Default ordering should be direct and explainable, such as reverse
  chronological order, rather than a hidden relevance model.

### Interface Contract

- Use a brutalist, utilitarian visual language.
- Favor high contrast, exposed grid and rule structure, dense but readable
  information hierarchy, direct labels, and minimal decoration.
- Avoid decorative gradients, soft shadows, ornamental cards, and interaction
  that hides core source information.
- Make publisher, language, time, translation state, and fetch failures easy to
  scan.
- Preserve semantic structure, keyboard navigation, visible focus, and readable
  contrast even when those constraints temper the visual style.

### Out of Scope

- Full-article storage or reproduction
- AI summaries, recommendations, sentiment, or personalization
- Accounts, alerts, and multi-user access
- Historical search or analytics
- Exhaustive coverage of every country, language, or publisher
- Scraping publisher pages without a separate approved decision

### Anti-Patterns

- Do not describe the roster as comprehensive or politically neutral.
- Do not silently discard the original language or canonical publisher link
  after translation.
- Do not present stale cached data as freshly retrieved.
- Do not fail the complete dashboard because one source is unavailable.
- Do not add a database, queue, scheduler, authentication system, or translation
  dependency without the repository's normal architecture and dependency
  approval.
- Do not make visual severity an excuse for inaccessible contrast, missing
  focus states, or unclear hierarchy.

## Contract

### Definition of Done

- [x] A clearly labeled synthetic preview demonstrates the intended dashboard,
      multilingual metadata, and region filtering.
- [x] A configured set of official feeds or documented APIs produces normalized
      headline records through public source-adapter seams.
- [x] Non-English headline metadata is translated into English while original
      values remain available.
- [x] The dashboard renders fresh or explicitly timestamped cached results.
- [x] Source failures are isolated and visibly reported.
- [x] Every rendered headline includes publisher attribution and a canonical
      link to the original story.
- [x] The interface follows the documented brutalist, utilitarian direction and
      meets the retained accessibility guardrails.
- [x] Unit tests cover normalization, translation decisions, ordering, and
      partial failure behavior.
- [ ] Browser tests cover the closed loop from dashboard load to publisher link.
- [ ] The repository quality gate passes.

### Regression Guardrails

- Source roster changes must be reviewable and must not overstate coverage.
- Translation must never overwrite the original headline in the domain record.
- Missing publication times must remain distinguishable from known times.
- Cached responses must expose their retrieval time.
- Publisher failures must remain isolated.
- A publisher repeating one canonical article URL must produce one headline and
  must not displace the next unique story from that source's limit.
- Headline links must resolve to publisher-controlled canonical URLs.
- Full article bodies must not enter application storage or rendered output.

### Verification

- **Unit behavior:** `npm test`
- **Type safety:** `npm run typecheck`
- **Browser loop and accessibility baseline:** `npm run quality:gate`
- **Workflow-sensitive changes:** `npm run ci:local`
- **Manual editorial check:** inspect the configured roster, original-language
  preservation, translations, timestamps, links, and partial-failure labels

### Scenarios

**Scenario: Reader scans global headlines**

- Given: several configured sources return current headline metadata
- When: the reader opens the dashboard
- Then: the page presents one directly ordered view with source, language, time,
  translation state, and original-story links

**Scenario: A non-English headline is retrieved**

- Given: a source returns a headline whose configured language is not English
- When: the result is normalized
- Then: the dashboard shows an English translation while retaining the original
  headline and language metadata

**Scenario: One publisher is unavailable**

- Given: one configured source times out or returns an invalid response
- When: the dashboard refreshes
- Then: available publishers still render and the unavailable source is labeled
  without implying a complete refresh

**Scenario: Cached results are served**

- Given: a valid short-lived cached aggregation exists
- When: the reader opens the dashboard
- Then: the cached results render with their retrieval time instead of being
  presented as newly fetched
