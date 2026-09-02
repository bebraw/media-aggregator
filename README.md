# media-aggregator

`media-aggregator` is a personal dashboard for tracking major headlines from reputable news organizations around the world. It will collect headline metadata from a curated source roster, translate non-English headlines into English, and link directly to the original reporting.

The first product loop is deliberately narrow: open the dashboard, refresh current headlines, scan one global view, and follow a headline to its publisher. Full articles, recommendations, summaries, accounts, alerts, and historical search are deferred.

The application runs as a server-rendered Cloudflare Worker. The current interface is a real, filterable product preview built from clearly labeled synthetic headlines; live feed ingestion and translation are the next boundary.

## Product Direction

- Cover a geographically balanced roster rather than one national news market.
- Support any language represented by configured sources and translate non-English headline metadata into English.
- Prefer official feeds and documented APIs; do not copy full article bodies.
- Show the publisher, original language, publication time, and canonical article link.
- Start local-first and without authentication, persistence, scheduled collection, or public multi-user access.

## Interface Direction

The product UI is brutalist and utilitarian: high contrast, exposed structure, dense information hierarchy, direct labels, and minimal decoration. Legibility, scanning speed, source attribution, and failure visibility take priority over ornamental polish.

The repo vendors ASDLC reference material in `.asdlc/` as local guidance. Project truth lives in `ARCHITECTURE.md`, `specs/`, and `docs/adrs/`: generated code must match those documents, and passing CI alone is not enough.

Local development targets macOS. Other platforms may need script and tooling adjustments before the baseline workflow works as documented.

## Documentation

- Development setup and local CI: `docs/development.md`
- Architecture decisions: `docs/adrs/README.md`
- Feature and architecture specs: `specs/README.md`
- Agent behavior and project rules: `AGENTS.md`
- Project-local agent capabilities: `.codex/skills/`
- Upstream template maintenance path: `.template/updates/AGENT_SYNC.md`

## Agent Skills

The repository includes compact instructions under `.codex/skills/` that help capable coding agents follow project-specific conventions without repeating generic engineering guidance. Version-sensitive details come from current primary sources. You can describe the job normally and let the agent select a matching skill, or require one by name—for example, `Use $security to review this authentication change`.

`$wayfinder` and `$to-spec` are intentionally explicit: the agent uses them only when you name them. This keeps exploratory maps and durable specifications from appearing as accidental side effects.

### From Idea to Implementation

- [`$brainstorming`](.codex/skills/brainstorming/SKILL.md) — compare lightweight approaches and clarify trade-offs before committing to a design.
- [`$wayfinder`](.codex/skills/wayfinder/SKILL.md) — map a large, uncertain, multi-session initiative in `docs/wayfinding/` when it is not ready for a responsible spec. Explicit invocation required.
- [`$to-spec`](.codex/skills/to-spec/SKILL.md) — turn settled discussion or wayfinding results into the repository's living `specs/<feature-domain>/spec.md`. Explicit invocation required.
- [`$tdd`](.codex/skills/tdd/SKILL.md) — implement observable runtime behavior through focused red-green slices when a stable test seam exists.
- [`$debug`](.codex/skills/debug/SKILL.md) — reproduce and localize failures, fix their root cause, add a regression guard, and verify the result.
- [`$simplify`](.codex/skills/simplify/SKILL.md) — reduce incidental complexity in recently changed code without altering behavior.

### Review and Risk

- [`$review`](.codex/skills/review/SKILL.md) — perform a broad, prioritized review for bugs, regressions, and readiness gaps.
- [`$correctness-review`](.codex/skills/correctness-review/SKILL.md) — inspect changed logic specifically for behavioral errors, edge cases, and broken contracts.
- [`$test-review`](.codex/skills/test-review/SKILL.md) — evaluate whether tests cover meaningful behavior without becoming brittle or redundant.
- [`$security`](.codex/skills/security/SKILL.md) — review authentication, secrets, access control, data exposure, and input-handling risks proportionately.
- [`$architecture-review`](.codex/skills/architecture-review/SKILL.md) — decide whether a growing capability can expand safely or should consolidate its ownership and dependency boundaries first.

### Frontend and Performance

- [`$frontend-design`](.codex/skills/frontend-design/SKILL.md) — design or substantially revise production-quality UI while preserving the project's lightweight shape.
- [`$minimal-visual-style`](.codex/skills/minimal-visual-style/SKILL.md) — extend the product's brutalist, utilitarian visual language without diluting its information hierarchy.
- [`$modern-web-guidance`](.codex/skills/modern-web-guidance/SKILL.md) — retrieve pinned, telemetry-disabled, Baseline-aware implementation guidance for substantive browser-platform work.
- [`$web-perf`](.codex/skills/web-perf/SKILL.md) — measure Core Web Vitals, loading behavior, interaction responsiveness, and network costs.

### Cloudflare and Validation

- [`$workers-best-practices`](.codex/skills/workers-best-practices/SKILL.md) — author or review Worker code using current production guidance and repository conventions.
- [`$wrangler`](.codex/skills/wrangler/SKILL.md) — guide Wrangler configuration and commands for local development, bindings, deployment, and platform resources.
- [`$local-ci`](.codex/skills/local-ci/SKILL.md) — run the repository's GitHub Actions workflow locally for workflow-sensitive or release-readiness validation.

Each linked `SKILL.md` is the source of truth for boundaries and workflow details. Project-wide routing rules live in [`AGENTS.md`](AGENTS.md).

## Runtime

- Run `nvm use` before `npm install` or any other development command so your shell picks up the repo-pinned Node.js version from `.nvmrc` and stays close to the expected npm baseline.
- Install dependencies with `npm install`.
- `npm install` also configures the repo-managed `pre-push` hook so `git push` runs affected guardrails before code leaves your machine.
- The exact project Node.js version is pinned in `package.json` and mirrored in `.nvmrc` for `nvm` users, and CI reads the `package.json` value directly.
- npm is constrained to the supported npm 11 range in `package.json`; local development is expected to use `nvm use`, and CI uses the npm release bundled with the pinned Node setup as long as it satisfies that range.
- Copy `.dev.vars.example` to `.dev.vars` before running projects that need local secrets.
- Use repo-pinned CLI tools through `npx`, including `npx wrangler` for Cloudflare-based experiments.
- Start the Worker with `npm run dev`, then open `http://127.0.0.1:8787`.
- Rebuild the generated Tailwind stylesheet manually with `npm run build:css` when needed.

## Verification

- Run the fast local gate with `npm run quality:gate:fast` during normal iteration.
- Run the baseline repo gate with `npm run quality:gate`.
- Run the deterministic source-shape smoke alarms directly with `npm run quality:structure`; threshold failures call for architecture review or an exact rationale-bearing exception, not mechanical file splitting.
- Run the containerized local workflow with `npm run ci:local` when changing GitHub Actions, dependencies or installation behavior, build or container setup, browser CI setup, or when performing a full PR or release readiness check. It emits structured run, job, and step progress for agents, uses Local CI parallelism with warm-cache serialization, and pauses failed runners for retry.
- Run advisory codebase readability diagnostics with `npm run diagnostics:codebase`.
- The repo-managed `pre-push` hook runs `npm run quality:affected` automatically after `npm install`.
- If Local CI warns about `No such remote 'origin'`, set `GITHUB_REPO=owner/repo` in `.env.local-ci`.
- Retry a paused local CI run with `npm run ci:local:retry -- --name <runner-name>`.
- Install the pinned Playwright browser with `npm run playwright:install`.
- Run unit tests from colocated `src/**/*.test.ts` files with `npm test`.
- Run browser tests from colocated `src/**/*.e2e.ts` files with `npm run e2e`.
- Run mutation tests against runtime `src/**/*.ts` files with `npm run mutation`.

## Upstream Template Updates

The repository records its `vibe-template` source and baseline in `package.json`. Use `.template/updates/AGENT_SYNC.md` to review relevant upstream maintenance without merging unrelated starter structure.

For cross-repo agent work, tell the agent:

> Look at `.template/updates/AGENT_SYNC.md` and the recorded `vibeTemplate` metadata for relevant upstream updates.

## Current Product Preview

- `GET /` serves six synthetic multilingual headlines in the intended product interface.
- `GET /?region=<region>` filters the preview by geographic region.
- `GET /styles.css` serves the generated Tailwind stylesheet.
- `GET /api/health` serves a JSON health response for smoke tests and tooling.

## Source Layout

- `src/worker.ts` is the Worker entry point and top-level router.
- `src/news/` owns normalized preview headline records and region selection.
- `src/api/` holds API response modules such as the health endpoint.
- `src/views/` holds server-rendered HTML modules.
- Tests live next to the code they exercise under `src/`.

## Application Screenshot

![Current application screenshot](docs/screenshots/home.png)

Refresh this asset manually when the product interface changes materially.
