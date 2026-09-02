# ADR-056: Use Workers AI for Headline Translation

**Status:** Implemented

**Date:** 2026-09-02

## Context

The first live product slice retrieves English, French, and Japanese headline
metadata from publisher-owned feeds. Non-English records must be translated to
English without overwriting the source text. The application already runs on
Cloudflare Workers and should remain dependency-light, but translation needs a
remote model, account authorization, explicit cost exposure, and a failure
boundary that cannot take down English or other healthy sources.

## Decision

Use Cloudflare Workers AI through an `AI` binding and the
`@cf/meta/m2m100-1.2b` translation model. Keep the model call behind the local
`Translator` interface so ingestion and rendering do not depend on Cloudflare's
response shape.

Translate at most two headlines per configured non-English source during one
retrieval. Cache the normalized snapshot for five minutes with the Workers
Cache API. Preserve the original headline, language, publisher, publication
time, and canonical URL in every translated record. Treat model errors as a
source-level partial failure and render that failure visibly.

Normal local development connects the AI binding remotely and therefore uses
the authenticated Cloudflare account and can incur Workers AI usage. Browser CI
continues in local-only mode against the explicit synthetic preview route.

## Consequences

**Positive:**

- The live Worker can translate without another SDK or secret-management path.
- Original-language metadata remains authoritative and inspectable.
- The translator seam keeps a future provider or model change localized.
- Bounded retrieval and caching constrain latency, upstream traffic, and model
  usage for personal use.

**Negative:**

- Live non-English results depend on Cloudflare account authentication,
  service availability, pricing, and the selected model's translation quality.
- The five-minute cache is edge-local and is not durable history.
- A failed translation currently excludes that source's fetched headlines
  rather than displaying untranslated content as if it met the English view.

**Neutral:**

- `?preview=1` remains available for deterministic interface review.
- `?refresh=1` deliberately bypasses the snapshot cache for manual refreshes.

## Alternatives Considered

### Add a third-party translation SDK or REST credential

This would add a package or another secret and provider account before the
personal product loop needs it. The `Translator` interface keeps this option
available later.

### Use a general-purpose language model

A general chat model would be more flexible but less direct for a bounded
headline-translation task and would make output behavior and cost controls
harder to reason about.

### Render untranslated headlines when translation fails

This would retain more feed content but violate the current English-view
contract unless the UI introduced a distinct untranslated state. For now, the
source is reported as unavailable instead.
