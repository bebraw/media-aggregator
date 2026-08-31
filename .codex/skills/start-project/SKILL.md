---
name: start-project
description: Turn a fresh vibe-template clone into a focused project through an approved product-loop and pruning plan before any deletion.
---

# Start Project

Convert inherited starter context into deliberate project context without losing working behavior, governance, or the template update path.

## Boundaries

- Run only on explicit invocation or an unambiguous request to initialize a clone.
- Keep the first phase read-only. Do not edit, move, or delete files before approval of exact targets and coupled edits.
- Preserve user work and never assume inherited content is disposable.
- Do not add dependencies, CI, generated boilerplate, or new persistent state without separate approval.
- Prefer existing durable surfaces: `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, specs, ADRs, and package metadata.

## Context

Read those durable surfaces, package metadata, Git remotes, and tracked files. Consult `.asdlc/SKILL.md` for methodology choices. Read `references/pruning-catalog.md` when template distribution material, update packs, starter runtime, or inherited skill collections remain.

## Phase 1: Plan

Establish the project name, purpose, first closed product loop, deferred scope, and retained runtime/deployment target. Inventory references, scripts, dependencies, workflows, skills and copies, specs, ADRs, and update records.

Classify each inherited surface as `Keep`, `Replace later`, `Remove after approval`, or `Decision required`. Trace every proposed removal through coupled files. Preserve either local update history or a durable record of template source, starting revision, applied update IDs, and retained sync entrypoint.

Present a `Project Start Plan` with these sections:

1. Product focus
2. Keep
3. Replace later
4. Remove after approval
5. Decisions required
6. Template update path
7. Documentation changes
8. Verification

List exact paths and reasons. Ask for explicit approval; approval covers only listed targets and coupled edits. Stop at decisions required when the product loop or lasting architecture remains unclear.

## Phase 2: Apply

Recheck `git status` and stop if overlapping changes stale the plan. Update durable project context before removals, replace references before targets, and delete only approved paths. Remove starter runtime only after replacement behavior and verification exist. Run targeted and repository-required checks, then compare the final diff with the plan.

Finish when project purpose and loop are durable, deferred scope is explicit, removed paths were approved and are unreferenced, retained tooling has an owner, update provenance remains discoverable, docs match the result, and checks pass. Offer removal of this skill only as a separate final item.
