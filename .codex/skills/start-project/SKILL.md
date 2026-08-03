---
name: start-project
description: Turn a fresh vibe-template clone into a focused project by defining its first closed product loop, auditing inherited template surfaces, and negotiating a safe pruning plan before any deletion. Use only when the user explicitly asks to start, initialize, personalize, or prune a project created from this template.
---

# Start Project

Convert inherited starter context into deliberate project context without losing useful guardrails or the path to later template updates.

## Boundaries

- Run only on explicit invocation or an unambiguous request to initialize a clone.
- Treat the planning pass as read-only. Do not edit, move, or delete files before the user approves the exact plan.
- Never infer that inherited content is disposable solely because it came from the template.
- Preserve working behavior until its replacement and verification path exist.
- Preserve user-authored changes and unrelated worktree changes.
- Do not add dependencies, CI, generated boilerplate, or a new persistent state file without separate approval.
- Prefer existing durable surfaces: `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `specs/`, ADRs, and package metadata.

## Load context

Read `AGENTS.md`, `ARCHITECTURE.md`, `README.md`, relevant specs and ADRs, package metadata, the Git remotes, and the tracked file inventory. Consult `.asdlc/SKILL.md` for methodology choices.

Read [references/pruning-catalog.md](references/pruning-catalog.md) when the repository still resembles `vibe-template` or contains `.capabilities/`, `.template/updates/`, starter application files, or inherited skill collections.

## Phase 1: Produce the plan

Make no repository changes during this phase.

1. Establish the project identity from settled user context. Confirm only the decisions that cannot be discovered locally:
   - project name and one-sentence purpose;
   - one current closed product loop, from user intent through observable result;
   - explicit near-term exclusions or deferred capabilities;
   - retained runtime and deployment target.
2. Inventory tracked files and their references. Inspect package scripts, dependencies, workflows, skill routing, intentional copies, specs, ADRs, and update records before classifying a path.
3. Classify inherited surfaces as:
   - **Keep:** required by the current loop, governance, verification, or update path.
   - **Replace later:** starter behavior still protecting a working seam.
   - **Remove:** distribution-only or unused material with no remaining references.
   - **Decision required:** removal would change tooling, architecture, or project policy.
4. Trace each proposed removal through references and coupled surfaces. Include canonical skills and compatibility copies, docs links, package scripts and dependencies, specs, ADRs, screenshots, workflows, and lock metadata where applicable.
5. Preserve template updates using one approved strategy:
   - keep the local update-pack history; or
   - record the upstream source, starting Git revision, and applied update IDs in existing package metadata or durable docs before pruning old packs.
6. Present exactly this review artifact:

```markdown
# Project Start Plan

## Product focus

- Purpose: ...
- Current closed loop: ...
- Deferred: ...

## Keep

- `path` — reason

## Replace later

- `path` — replacement condition

## Remove after approval

- `path` — reason; coupled edits

## Decisions required

- question — consequence

## Template update path

- source, baseline, record location, retained sync entrypoint

## Documentation changes

- exact targets and intended ownership

## Verification

- exact checks
```

7. Ask for explicit approval of the plan. Approval covers only the listed targets and coupled edits.

If the product loop or a lasting architecture choice remains materially unclear, stop at `Decisions required` and route that question to brainstorming or wayfinding. Do not manufacture a vision document to hide uncertainty.

## Phase 2: Apply the approved plan

1. Recheck `git status` and the approved targets. Stop if new overlapping changes make the plan stale.
2. Capture the project focus in the smallest existing durable surfaces:
   - user-facing purpose and first loop in `README.md`;
   - agent and project constraints in `AGENTS.md`;
   - global dependency or ownership rules in `ARCHITECTURE.md`;
   - feature behavior and boundaries in `specs/<feature-domain>/spec.md`;
   - lasting architecture choices in an ADR.
3. Record the approved template update source and baseline before removing local update history. Prefer an existing `vibeTemplate` package metadata object when `package.json` is an appropriate durable surface; otherwise use project documentation.
4. Apply non-destructive edits first. Replace or remove references before removing their targets.
5. Delete only the exact approved paths. Handle canonical skills, compatibility copies, provenance files, and documentation as one coupled change.
6. Remove starter runtime behavior only after its replacement has tests or another deterministic verification and the relevant spec has changed.
7. Run targeted checks while editing, then the repository-required readiness checks. Use local CI only when the approved change crosses the repository's workflow-sensitive boundaries.
8. Compare the final diff with the approved plan. Report any approved item not applied and do not add adjacent cleanup silently.

## Completion

Finish only when:

- the README states the actual project purpose and current closed loop;
- deferred capabilities are explicit enough to prevent accidental scope expansion;
- every removed path was approved and has no stale reference;
- retained tooling has a current owner and purpose;
- the template source and baseline remain discoverable if local update history was pruned;
- specs, architecture rules, and ADRs match the resulting repository; and
- the required checks pass.

Offer removal of `start-project` itself only as the final, separately listed cleanup item. Keeping it is harmless; removing it can make a completed project less template-shaped.
