---
name: architecture-review
description: Review whether a growing capability still has clear source ownership, composition, state authority, public seams, and dependency direction. Use when adding or materially expanding an independently evolvable capability, when source-shape limits or Fallow hotspots surface, or when the user asks whether the codebase should consolidate before further feature work.
---

# Architecture Review

Decide whether a capability can expand safely or needs consolidation. Treat structural metrics as evidence, not as architecture by themselves.

## Establish the contract

Read `AGENTS.md`, `ARCHITECTURE.md`, the relevant feature specs, and related ADRs. For a product capability, identify:

- the product capability and its current source root;
- the composition root that wires it into the application;
- the authority for its persistent and canonical state;
- its public contracts and dependents; and
- the permitted dependency direction.

For a cross-cutting workflow, identify the owner of each component plus the integration contract and composition root. Do not force one source root onto a deliberately distributed capability.

If these cannot be named from durable repository context, report that as the primary finding.

## Collect structural evidence

1. Read `.architecture-check.json`, then run `npm run quality:structure`. Treat a pass as evidence only for the configured roots. A failure is a checkpoint, not an instruction to split files mechanically.
2. Run `npm run diagnostics:health` for file size, fan-in, fan-out, churn hotspots, refactoring targets, and type coupling.
3. Run `npm run diagnostics:map` only when the import topology remains unclear and the ignored `.fallow/codebase-map.html` artifact will materially help.
4. Inspect the affected capability for mixed authorities that metrics cannot prove, such as one coordinator owning rendering, event binding, and feature orchestration or one persistence component spanning unrelated lifecycles.

## Decide

Return one disposition:

- **Proceed:** ownership and dependency direction are clear, and structural pressure is proportionate.
- **Consolidate first:** mixed authority, continued hotspot growth, broad coupling, or flat-directory pressure would make another capability harder to place.
- **Decision required:** credible boundary alternatives would change a lasting constraint; propose an ADR before implementation.

Prioritize evidence by future change cost. For each finding, name the affected capability, concrete source locations, why the current shape impairs ownership, and the smallest coherent correction. Do not recommend layers, packages, or abstractions without a demonstrated responsibility boundary.

## Boundaries

- Do not treat a passing functional quality gate as evidence of navigable architecture.
- Do not split files merely to satisfy a numeric threshold.
- Do not invent capability directories before the product has the corresponding responsibilities.
- Do not require GitHub issues, pull requests, or a persisted review report.
- Record lasting outcomes in `ARCHITECTURE.md`, an ADR, or the relevant feature spec when the user asks to implement them.
