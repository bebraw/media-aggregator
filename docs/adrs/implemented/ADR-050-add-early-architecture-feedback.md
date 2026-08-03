# ADR-050: Add Early Architecture Feedback

**Status:** Implemented

**Date:** 2026-08-03

## Context

The template has strong behavioral gates and advisory codebase diagnostics, but those mechanisms answer different questions. Tests can preserve observable behavior while source ownership, state authority, fan-in, churn concentration, and flat-directory growth become harder for contributors and agents to navigate.

The [Kirjolab case study](https://scalableweb.dev/case-studies/kirjolab/) demonstrated this gap after a project based on the template expanded rapidly. Functional checks remained useful, yet architectural feedback arrived after coordinators, stateful owners, contracts, and directories had accumulated several capabilities.

The template should surface extreme structural growth early without prescribing a heavyweight package layout or forcing every small change through architectural ceremony.

## Decision

Add three complementary feedback mechanisms:

1. Extend the feature-spec template so new or materially expanded capabilities name their source root, composition root, state authority, public contracts, dependency direction, and adjacent out-of-scope work.
2. Add a dependency-free `quality:structure` check to the fast and affected quality paths. It fails when production source exceeds the generous limits in `.architecture-check.json`: 1,000 lines in one file or 40 direct source files in one directory. Exact exceptions require a non-empty rationale.
3. Add a repository-local `architecture-review` skill that interprets source-shape results with Fallow's file health, coupling, churn hotspot, refactoring target, and optional topology-map evidence. Its disposition is Proceed, Consolidate first, or Decision required.

Quality Gate owns the deterministic checker, configuration, and gate integration. Agent Skill Baseline owns the interpretive skill and routing. The Architecture Feedback feature spec owns only the composition contract between those capabilities and the feature-spec ownership convention.

Thresholds are review checkpoints, not decomposition rules. A passing check does not prove good architecture, and a failing check must not trigger mechanical file splitting.

## Trigger

A real downstream project preserved functional correctness while its implementation structure grew faster than its capability ownership model. The user asked to improve the template so structural feedback arrives before similar growth becomes expensive to reverse.

## Consequences

**Positive:**

- Extreme file and flat-directory growth becomes visible in the normal readiness path.
- Feature specs connect product capabilities to concrete source and state ownership.
- Architecture review reuses the pinned Fallow dependency instead of adding another analysis stack.
- Projects can retain intentional large artifacts through explicit, reviewable exceptions.

**Negative:**

- The fast gate gains another repository scan and configuration file.
- Numeric limits can encourage superficial splitting if contributors ignore the documented review workflow.
- Projects with legitimately large checked-in sources must maintain exception rationales.

**Neutral:**

- Fallow diagnostics remain advisory; only the deliberately broad source-shape ceilings are deterministic gates.
- The template still does not pre-create capability directories before the product needs them.

## Alternatives Considered

### Keep Diagnostics Entirely Advisory

This preserves the smallest gate but relies on contributors or agents remembering to run architecture diagnostics. The downstream evidence shows that optional structural feedback can arrive several feature cycles too late.

### Enforce A Capability-Oriented Scaffold Up Front

This could make ownership visually obvious on day one, but it would invent empty domains and layers for small experiments. The template should establish boundaries as real capabilities emerge.

### Gate Low Complexity And File-Size Thresholds

Strict limits would catch pressure sooner but would create frequent false positives and encourage metric-driven decomposition. Generous ceilings plus an interpretive review checkpoint better preserve local judgment.
