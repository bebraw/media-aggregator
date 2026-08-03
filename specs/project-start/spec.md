# Feature: Project Start

## Blueprint

### Context

A fresh clone contains useful quality, architecture, documentation, and agent guardrails, but it also contains distribution kits, historical migrations, a replaceable starter application, and workflows that may not fit the new product. Removing these by intuition can break the working baseline or erase the route to later template maintenance. Keeping everything indefinitely makes product ownership harder to see.

The project needs a lightweight one-time workflow that establishes the first closed product loop, audits inherited material, and lets the user approve exact pruning before the repository changes.

### Architecture

- **Capability source root:** `.codex/skills/start-project/`
- **Composition roots:** `AGENTS.md` for explicit routing and `README.md` for user discovery
- **Entry point:** explicit `$start-project` invocation or an unambiguous request to initialize, personalize, or prune a fresh clone
- **State authority:** existing durable repository documents and package metadata; the skill creates no private state store
- **Public contracts:** the read-only Project Start Plan, the approved target list, and the resulting project docs/specs/ADRs
- **Dependency direction:** the skill reads template and project surfaces; those surfaces do not depend on the skill after initialization
- **Update provenance:** template source, baseline Git revision, and applied update IDs in existing package metadata or durable docs when local update history is pruned

### Out of Scope

- Discovering a materially uncertain product direction; use brainstorming or wayfinding first.
- Implementing the first product loop as part of the planning pass.
- Automatically choosing a framework, dependency, CI service, or deployment target.
- Cleaning ignored machine-local artifacts as if they were repository architecture.

### Anti-Patterns

- Do not edit or delete files during the initial audit.
- Do not label all inherited material as disposable template residue.
- Do not delete working starter behavior before its replacement or explicit abandonment is approved and verifiable.
- Do not remove a skill, tool, or workflow without tracing its routing, copies, packages, scripts, docs, specs, and checks.
- Do not prune historical update packs without recording an upstream source and baseline.
- Do not create a second project-state file when README, architecture docs, specs, ADRs, or package metadata already own the information.

## Contract

### Definition of Done

- [ ] The template includes an explicitly invoked `start-project` skill and user-facing catalog entry.
- [ ] The planning phase is read-only and defines purpose, one current closed loop, and deferred capabilities.
- [ ] The plan classifies exact paths as keep, replace later, remove after approval, or decision required.
- [ ] Proposed removals list coupled edits, update-path impact, and verification.
- [ ] No edit or deletion occurs until the user approves the exact plan.
- [ ] Approved execution updates README, agent rules, architecture, specs, and ADRs where their owned contracts change.
- [ ] Pruning local update history preserves template source, baseline, applied updates, and a discoverable sync path.
- [ ] Final verification matches the repository's retained tooling and workflow-sensitive boundaries.

### Regression Guardrails

- Start Project must remain explicitly invoked.
- Plan approval must be scoped to listed targets and coupled edits, not treated as blanket cleanup authority.
- New overlapping worktree changes must invalidate or narrow a previously approved plan before execution continues.
- Implemented ADRs and living specs remain retained by default; consolidation requires proof that active constraints and behavior remain represented.
- Canonical skills and compatibility copies must be changed together intentionally.
- The workflow may offer to remove itself only as the final, separately listed cleanup item.

### Verification

- **Skill metadata:** run the skill-creator validator against `.codex/skills/start-project/`
- **Documentation:** `npm run format:check`
- **Catalog coverage:** confirm README and `AGENTS.md` identify Start Project as explicit-only
- **Update path:** confirm `.template/updates/AGENT_SYNC.md` can discover `source`, `baseline`, and `updates` from existing metadata
- **Forward test:** ask a fresh agent to use the skill on a representative clone and confirm it returns a plan without changing the worktree

### Scenarios

**Scenario: Fresh clone is still generic**

- Given: the repository contains the Worker stub, template skills, capability kits, and historical update packs
- When: the user invokes Start Project with a product idea
- Then: the agent presents the first closed loop and exact keep, replace, remove, and decision categories without editing files

**Scenario: User approves only part of the plan**

- Given: the Project Start Plan proposes several removals
- When: the user approves only the distribution-kit removal
- Then: the agent applies that subset and its listed coupled documentation changes without performing adjacent cleanup

**Scenario: Starter behavior has no replacement yet**

- Given: the current Worker stub is still the only verified runtime path
- When: the audit evaluates `src/`
- Then: it classifies the starter as replace later instead of deleting it

**Scenario: Historical update packs are pruned**

- Given: a downstream project no longer wants local migration history
- When: the user approves removing old packs
- Then: the agent first records the actual template source, baseline revision, and applied updates in package metadata or durable docs and retains a discoverable sync route

**Scenario: Product direction is unresolved**

- Given: alternative first loops would create materially different project architecture
- When: Start Project reaches the decision
- Then: it stops in the Decisions required section and routes the user to brainstorming or wayfinding instead of inventing a project structure
