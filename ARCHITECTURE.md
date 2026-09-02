# Architecture

This file stores cross-cutting rules for `media-aggregator`.

Use this file for global constraints. Use feature specs under `specs/` for domain-specific behavior and contracts.

- `src/news/` owns publisher configuration, bounded feed retrieval,
  normalization, translation, and snapshot caching.
- `src/worker.ts` is the composition root; source and translation modules must
  not depend on presentation code.
- Publisher content is untrusted input. Only bounded feeds from configured
  HTTPS endpoints and article URLs on per-publisher host allowlists may enter
  normalized records.
- Translation is a derived value. It must never replace the publisher's
  original headline or canonical link.

## Global Rules

- Keep the product lightweight, direct, and easy to change.
- Preserve the working starter seam until the media aggregation loop replaces it with equivalent tests and verification.
- Treat the configured source roster as the product's explicit coverage boundary. Global intent does not imply exhaustive geographic, publisher, or language coverage.
- Prefer official feeds and documented APIs for headline ingestion. Full-article scraping requires a separate decision covering permission, reliability, data handling, and misuse resistance.
- Preserve source attribution, canonical links, original-language metadata, and publication times through normalization and English translation.
- Isolate translation behind a replaceable boundary so provider choice, credentials, cost controls, and language-quality evaluation do not leak into ingestion or rendering.
- Use short-lived caching for the initial on-demand refresh loop. Adding durable storage, scheduled collection, or history requires a separate architecture decision.
- Keep the interface brutalist and utilitarian: high contrast, visible structure, direct labels, compact hierarchy, and minimal decoration. Accessibility and rapid headline scanning remain non-negotiable.
- Treat repo documentation as living context that should evolve with the code.
- Treat architectural decisions as explicit records, not implicit tribal knowledge.
- Treat specs and ADRs as the durable source of truth for expected behavior and architectural intent. Code, including AI-generated code, is only acceptable when it matches those documents or updates them intentionally in the same change set.
- Add or update an ADR in `docs/adrs/` whenever a change introduces or changes a lasting architectural constraint, selects between credible architectural alternatives, or replaces an earlier decision. Keep drafts in `docs/adrs/proposed/`, approved-but-not-yet-implemented decisions in `docs/adrs/accepted/`, and implemented decisions in `docs/adrs/implemented/`.
- Create or update the relevant feature spec in `specs/` in the same change set whenever feature behavior, contracts, workflows, or regression guardrails change.
- Keep agent skill descriptions discriminating and entrypoints limited to project-specific decisions, invariants, exact local commands, and safety boundaries. Assume a capable `gpt-5.6-sol`-class baseline; retrieve version-sensitive manuals instead of vendoring command catalogs or teaching generic engineering judgment.
- Keep optional multi-session discovery maps under `docs/wayfinding/<effort>.md`. Treat them as working context rather than durable authority, and promote lasting outcomes into `ARCHITECTURE.md`, ADRs, or feature specs.
- Use focused red-green slices for observable runtime behavior and regression fixes when a stable test seam exists. When no meaningful failing test can be written, use and state the relevant deterministic verification instead.
- For every new or materially expanded independently evolvable capability, record its source root, composition root, state authority, public contracts, and dependency direction in the relevant feature spec.
- Treat `.architecture-check.json` limits as generous smoke alarms for architectural review. Do not split code mechanically to satisfy them; consolidate responsibilities or add an exact rationale-bearing exception.
- Keep the quality gate green before considering a change ready.
- Deploy the production Worker through Cloudflare Workers Builds after a
  successful build of the `main` branch. Keep GitHub Actions responsible for
  verification rather than production deployment.
- Keep workflow writes explicit. New generated output, local state, cache, archive, or tool-artifact paths should be documented in the same change that introduces them.
- Do not place executable browser code inline in Worker-rendered HTML. Client behavior should live in typed TypeScript modules before it is served to browsers.

## Tooling Baseline

- Local development and local CI target macOS as the supported host platform baseline.
- Browser-facing core behavior targets Baseline Widely available. Features outside that target require a usable core path or an explicitly documented narrower browser policy; Chromium-only browser checks do not establish cross-browser compatibility.
- Use the scoped `modern-web-guidance` skill as pinned, telemetry-disabled implementation input for substantive web-platform decisions. Repository architecture, specs, source conventions, and verification remain authoritative, and upstream upgrades require deliberate review.
- Use a connected Cloudflare MCP as the retrieval and account-operation layer for current Cloudflare product work. Keep only the `workers-best-practices` and `wrangler` skills in the template baseline; add product-specific Cloudflare skills when a project actually adopts those products.
- Node is pinned exactly through `package.json`, npm is constrained to a compatible major there instead of an exact patch pin, and `@types/node` stays on the supported Node major.
- The verification baseline is split into a fast gate and a browser gate so quick checks can return earlier without dropping full coverage.
- The repo-managed `pre-push` Git hook should run affected-file guardrails before code is pushed.
- Formatting, Oxlint correctness checks, type checking, unit tests, and end-to-end tests are part of the baseline quality gate.
- The fast and affected quality paths enforce extreme source-file and flat-directory limits through `npm run quality:structure`; Fallow remains the richer advisory layer for coupling, churn, complexity, and refactoring evidence.
- Keep incremental mutation testing in an explicit deep local gate instead of making it an unconditional baseline phase. GitHub remains responsible for the clean full mutation signal on runtime-relevant changes.
- Keep duplicated `.github/skills/` content and deliberately vendored skill references outside the Prettier baseline. Continue formatting project-owned skill entry points, specs, ADRs, and documentation.
- Cache successful Prettier checks by file content under ignored `.cache/prettier` so repeated local gates avoid unchanged files without trusting timestamps.
- Keep Oxlint focused on its default correctness rules unless additional rule categories are adopted through an explicit, documented decision. Oxlint does not replace Prettier or TypeScript checking.
- Fallow codebase diagnostics use best-effort type-aware analysis for exact-symbol evidence, public-signature coupling, complexity, duplication, dependency hygiene, and cleanup evidence; they remain advisory and do not replace the baseline quality gate.
- Affected-file guardrails should scope checks to changed files when the underlying tool supports it and fall back to project-level checks only when needed.
- Remote browser and mutation jobs should skip dependency installation and execution when every changed file is in a documented non-runtime area. Unknown paths and unavailable change ranges must run the expensive gates.
- Keep Stryker at 50% concurrency for responsive local work, while the isolated GitHub mutation job may use 100% of its runner's available parallelism.
- The fast quality gate should fail when Worker/view runtime files contain inline `<script>` tags, inline event-handler attributes, or `javascript:` URLs.
- Unit coverage for `src/` code should stay high enough that the coverage gate remains green.
- Local CI should validate the same baseline checks when changes cross workflow-sensitive boundaries or when full PR or release readiness is requested.
- The canonical local CI command should emit Local CI's structured lifecycle event stream so agents can track run, job, step, pause, and completion state without relying on animated terminal output. Agent command wrappers must pass that stream through live instead of buffering it until process exit.
- Targeted commands are useful while iterating, but `npm run quality:gate` remains the readiness baseline before proposing or landing non-documentation changes.
- Require `npm run ci:local` when a change touches GitHub Actions workflows, package metadata or dependency installation, build or container setup, browser CI setup, or when full PR or release readiness is requested. Ordinary source, test, and tooling changes do not require it when they stay outside those boundaries.
- Use `npm run quality:gate:deep` when local assertion-strength feedback is worth the additional mutation-testing cost.
- `npm run diagnostics:codebase` is useful during review and refactoring, but passing or failing it is not a readiness baseline by itself.
- Documentation-only changes should use the smallest relevant checks unless they alter executable instructions or workflow contracts.

## Upstream Template Updates

- `package.json` owns the upstream template source, baseline revision, and applied-update record.
- `.template/updates/AGENT_SYNC.md` is the discoverable sync entrypoint.
- Treat retained update packs as reviewable upstream maintenance inputs, not as product source snapshots.
- Apply only relevant, explicitly approved updates and preserve product conventions when a patch no longer applies cleanly.
- Product changes do not author new update packs; reusable template maintenance remains owned by the upstream `vibe-template` project.

## Spec Conventions

- Put feature-level specs under `specs/{feature-domain}/spec.md`.
- Keep one spec per independently evolvable feature or domain.
- Synthesize only settled context into specs; keep unresolved discovery in conversation or a wayfinding map and keep architectural rationale in ADRs.
- Update the relevant spec in the same change set whenever behavior, contracts, workflows, or guardrails change.
