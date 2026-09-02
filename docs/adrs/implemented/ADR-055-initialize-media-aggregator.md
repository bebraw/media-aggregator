# ADR-055: Initialize Media Aggregator

**Status:** Implemented

**Date:** 2026-09-02

## Context

The repository began as a fresh `vibe-template` clone with a runnable
Cloudflare Worker, comprehensive quality tooling, template distribution kits,
and an upstream update history. The new product is a personal dashboard for
scanning major headlines from a curated global roster, with non-English
headline metadata translated into English.

The first product loop does not require a framework replacement, durable
storage, scheduled collection, or multi-user infrastructure. Removing the
working Worker before its replacement exists would discard a verified runtime
seam. Retaining template distribution surfaces, however, would obscure the
repository's new product ownership.

## Decision

Convert the clone into the `media-aggregator` product while retaining the
existing Cloudflare Worker, server-rendered HTML, TypeScript, Tailwind, and
quality-gate baseline.

The initial product architecture will:

- retrieve headline metadata on demand from a small, curated global roster
  using official feeds or documented APIs
- use short-lived caching without durable application storage
- preserve original source and language metadata through an isolated,
  replaceable English-translation boundary
- remain local-first until public access and authentication are decided
- use a brutalist, utilitarian interface optimized for fast scanning and direct
  source attribution

Remove `.capabilities/` and its living spec because this product does not
distribute partial-upgrade kits. Retain the historical ADRs, local agent
guidance, quality tooling, and `.template/updates/AGENT_SYNC.md`. Record the
actual template source and baseline in `package.json`.

Keep the current Worker stub operational until the media aggregation feature
replaces it with equivalent unit, browser, and quality-gate coverage.

## Trigger

The user approved the read-only Project Start Plan and selected a direct,
brutalist, utilitarian design direction for a personal global media aggregator.

## Consequences

**Positive:**

- Product purpose and the first closed loop become explicit without breaking
  the runnable baseline.
- Existing Worker and verification tooling can support incremental feature
  implementation.
- The repository no longer carries capability-kit distribution ownership.
- Translation, persistence, and public access remain visible decisions instead
  of accidental infrastructure.
- The interface direction prioritizes information density and attribution.

**Negative:**

- Live upstream retrieval can be slower and less reliable than scheduled
  collection backed by durable storage.
- Translation still requires a provider decision, credentials, cost controls,
  and representative quality evaluation.
- A curated roster cannot provide exhaustive or objectively neutral global
  coverage.
- Retaining upstream update history leaves some template-maintenance material
  in the product repository.

**Neutral:**

- The current UI still displays the inherited starter surface until product
  implementation begins.
- The repository remains macOS-oriented for local development.
- The existing template remote remains unchanged until a product repository
  destination is provided.

## Alternatives Considered

### Replace the Worker stack during initialization

This would delay the first product loop and remove an already tested deployment
and rendering seam without a product requirement that demands another runtime.

### Add scheduled collection and durable storage immediately

This would improve refresh consistency and enable history, but it would add
resource ownership, retention, schema, and operational decisions before the
single-user headline loop proves useful.

### Use an all-in-one news aggregation provider

This could reduce adapter work, but it would make geographic coverage,
translation behavior, cost, and source attribution dependent on one vendor
before those trade-offs have been evaluated.

### Keep the repository as a distributable template

This would preserve capability kits but leave two competing identities: a
personal media product and a general-purpose distribution source.
