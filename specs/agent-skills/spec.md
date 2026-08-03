# Feature: Agent Skill Baseline

## Blueprint

### Context

The template should include agent workflows that are broadly useful to its baseline without vendoring large product documentation snapshots already available from connected platform tools.

Large, uncertain initiatives also need a lightweight way to preserve discovery across sessions without requiring an external issue tracker or turning transient planning notes into architectural authority.

Once decisions settle, the template should provide a direct repository-local path from discussion to its living feature spec and from that contract to behavior-first implementation.

Users also need a concise README catalog that makes the available skills discoverable, explains the job each one performs, and shows how to request one without reading every skill file first.

### Architecture

- **Canonical project-local skill root:** `.codex/skills/`
- **Selective compatibility copies:** `.github/skills/` and capability-kit `files/` only for skills intentionally distributed through those surfaces
- **Copy policy:** keep an intentional distribution copy byte-equivalent to its canonical `.codex/skills/` source unless the target surface requires a documented compatibility adaptation
- **Composition roots:** `AGENTS.md` for model routing and `README.md` for user discovery
- **Skill contracts:** each canonical `SKILL.md` plus optional `agents/openai.yaml`
- **Dependency direction:** routing and distribution surfaces point to canonical skills; canonical skills do not depend on their copies
- **Cloudflare knowledge and account layer:** connected Cloudflare MCP
- **Baseline Cloudflare implementation skill:** `workers-best-practices`
- **Baseline Cloudflare CLI skill:** `wrangler`
- **Specialized Cloudflare skills:** added on demand when their product is adopted
- **Repository-local wayfinding skill:** `.codex/skills/wayfinder/`
- **Wayfinding map:** `docs/wayfinding/<effort>.md`
- **Wayfinding authority:** working context only; lasting decisions graduate into architecture docs, ADRs, and specs
- **Repository-local specification skill:** `.codex/skills/to-spec/`
- **Specification target:** `specs/<feature-domain>/spec.md`
- **Behavior-first implementation skill:** `.codex/skills/tdd/`
- **Capability architecture review skill:** `.codex/skills/architecture-review/`
- **Architecture-feedback integration:** review-skill behavior is owned here; `specs/architecture-feedback/spec.md` owns its composition with deterministic source-shape evidence
- **User-facing skill catalog:** `README.md`

### Anti-Patterns

- Do not vendor broad Cloudflare documentation snapshots when the connected MCP supplies current retrieval.
- Do not treat the MCP as a replacement for local Wrangler development, configuration, type generation, or testing workflows.
- Do not retain product-specific skills for capabilities the template does not use.
- Do not let intentional compatibility or capability-kit copies diverge from their canonical `.codex/skills/` source without a documented adaptation.
- Do not require GitHub Issues, labels, assignments, tracker setup, or a companion skill suite for wayfinding.
- Do not treat a wayfinding map as the durable source of truth for architecture or feature behavior.
- Do not invoke wayfinding for work that is already clear enough to specify or implement in one session.
- Do not publish feature specs to issue trackers or create parallel PRD formats.
- Do not synthesize unresolved decisions into a spec as if they were settled.
- Do not force TDD onto changes without meaningful observable behavior or a stable test seam.
- Do not write tautological or implementation-coupled tests merely to satisfy a test-first sequence.
- Do not make users inspect the skill directory to discover names, purposes, or invocation behavior.
- Do not duplicate complete skill workflows in the README; link to each `SKILL.md` as the source of truth.
- Do not treat structural metrics as a substitute for reviewing capability ownership and dependency direction.

## Contract

### Definition of Done

- [ ] The template includes `workers-best-practices` and `wrangler` in both supported skill roots.
- [ ] Broad and unused product-specific Cloudflare skill bundles are absent from both roots.
- [ ] Agent guidance routes current Cloudflare documentation, API discovery, and account operations through the connected MCP.
- [ ] Product-specific skills are introduced only with the capability that needs them.
- [ ] The template includes an explicitly invoked `wayfinder` skill for large, uncertain, multi-session efforts.
- [ ] Wayfinder stores one map per effort in `docs/wayfinding/` and creates no external tracker state.
- [ ] Wayfinder promotes lasting decisions into the repository's existing architecture, ADR, and spec structure.
- [ ] The template includes an explicitly invoked `to-spec` skill that writes the existing Blueprint/Contract format.
- [ ] The template includes a model-invoked `tdd` skill for observable source behavior and regression fixes.
- [ ] Both skills reuse the existing spec, ADR, test, and quality-gate conventions without companion setup.
- [ ] The README groups every project-local skill by job and gives each a concise, user-facing purpose.
- [ ] The README explains natural matching, named `$skill` invocation, and which workflows require explicit invocation.
- [ ] The template includes a model-invoked `architecture-review` skill that combines durable capability contracts, deterministic source-shape checks, and advisory Fallow evidence.

### Regression Guardrails

- The baseline must not reintroduce `cloudflare`, `agents-sdk`, `cloudflare-email-service`, or `durable-objects` as vendored skills without an explicit architecture change.
- The Worker and Wrangler skill copies must remain available while this repository is a Cloudflare Worker starter.
- Removing a baseline skill must not remove its runtime dependency or product implementation implicitly.
- Wayfinding must remain optional, repository-local, and independent of issue-tracker infrastructure.
- A map must not become ready for specification while lasting decisions exist only in transient planning text.
- To Spec must stop rather than invent an answer when a material contract or architecture decision remains unresolved.
- TDD must prove the intended missing behavior with a failing test before changing production code.
- TDD must allow explicit alternative verification for documentation, prototypes, generated output, and mechanical changes.

### Verification

- **Skill presence:** `test -f .codex/skills/workers-best-practices/SKILL.md && test -f .codex/skills/wrangler/SKILL.md`
- **Mirror presence:** `test -f .github/skills/workers-best-practices/SKILL.md && test -f .github/skills/wrangler/SKILL.md`
- **Pruned bundles:** confirm the four removed skill directories are absent from both roots
- **Documentation check:** `npm run format:check`
- **Wayfinder structure:** confirm the skill has valid `name` and `description` frontmatter plus valid `agents/openai.yaml`; use the skill-creator validator when its Python dependencies are available
- **Specification and TDD structure:** apply the same metadata validation to `.codex/skills/to-spec/` and `.codex/skills/tdd/`
- **Architecture review structure:** validate `.codex/skills/architecture-review/` metadata and confirm its workflow routes lasting outcomes into architecture docs, ADRs, or specs
- **README catalog:** confirm every `.codex/skills/*/SKILL.md` has a corresponding README link and that explicit-only workflows are identified

### Scenarios

**Scenario: Agent needs current Cloudflare product information**

- Given: the Cloudflare MCP is connected
- When: an agent needs current documentation or API details
- Then: the agent retrieves them through the MCP instead of relying on a vendored platform snapshot

**Scenario: Agent edits Worker code**

- Given: the repository remains a Cloudflare Worker
- When: an agent authors or reviews Worker code
- Then: the agent uses `workers-best-practices`

**Scenario: Project adopts a specialized Cloudflare product**

- Given: the project adds Agents SDK, Durable Objects, or Email Service
- When: specialized implementation guidance becomes useful
- Then: the project adds only the relevant skill rather than restoring the complete Cloudflare bundle

**Scenario: Initiative is too uncertain to specify**

- Given: an initiative will span multiple sessions and still contains material decision fog
- When: the user explicitly invokes Wayfinder
- Then: the agent creates one repository-local map after confirming its destination and initial frontier

**Scenario: Wayfinding resolves a lasting decision**

- Given: a resolution changes a global constraint, architectural choice, or feature contract
- When: the agent records the resolution
- Then: the agent updates the appropriate architecture document, ADR, or feature spec and leaves only a concise pointer in the map

**Scenario: Work is already clear**

- Given: the requested outcome can already be specified or planned responsibly
- When: the user invokes Wayfinder
- Then: the agent recommends the direct workflow instead of creating a map

**Scenario: Settled discussion becomes a feature spec**

- Given: the user has settled the feature behavior and important constraints
- When: the user explicitly invokes To Spec
- Then: the agent confirms one `specs/<feature-domain>/spec.md` target and synthesizes the agreed Blueprint and Contract without creating tracker state

**Scenario: Specification still contains a material decision**

- Given: an unresolved choice would change the feature contract or architecture
- When: To Spec evaluates readiness
- Then: the agent names the unresolved decision and returns to brainstorming or wayfinding instead of guessing

**Scenario: Observable runtime behavior changes**

- Given: a stable public test seam exposes the requested behavior
- When: the agent implements the change
- Then: TDD proves the missing behavior red, makes the smallest production change green, and repeats by vertical slice

**Scenario: No meaningful red test exists**

- Given: the change is documentation-only, generated, a prototype, or purely mechanical
- When: the agent considers TDD
- Then: the agent skips it and states the deterministic verification used instead

**Scenario: User looks for an available workflow**

- Given: the user knows the job they need done but not the available skill names
- When: they read the README skill catalog
- Then: they can find the matching skill, understand its purpose, and either describe the job naturally or invoke it by `$skill-name`

**Scenario: Capability expansion meets structural pressure**

- Given: a capability is growing and source-shape or Fallow evidence indicates concentrated responsibility
- When: the agent uses Architecture Review
- Then: it returns Proceed, Consolidate first, or Decision required based on ownership and dependency evidence rather than recommending mechanical file splitting
