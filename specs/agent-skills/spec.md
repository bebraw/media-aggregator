# Feature: Agent Skill Baseline

## Blueprint

### Context

The template should include agent workflows that are broadly useful to its baseline without vendoring large product documentation snapshots already available from connected platform tools.

Large, uncertain initiatives also need a lightweight way to preserve discovery across sessions without requiring an external issue tracker or turning transient planning notes into architectural authority.

### Architecture

- **Codex skill root:** `.codex/skills/`
- **Mirrored skill root:** `.github/skills/`
- **Cloudflare knowledge and account layer:** connected Cloudflare MCP
- **Baseline Cloudflare implementation skill:** `workers-best-practices`
- **Baseline Cloudflare CLI skill:** `wrangler`
- **Specialized Cloudflare skills:** added on demand when their product is adopted
- **Repository-local wayfinding skill:** `.codex/skills/wayfinder/`
- **Wayfinding map:** `docs/wayfinding/<effort>.md`
- **Wayfinding authority:** working context only; lasting decisions graduate into architecture docs, ADRs, and specs

### Anti-Patterns

- Do not vendor broad Cloudflare documentation snapshots when the connected MCP supplies current retrieval.
- Do not treat the MCP as a replacement for local Wrangler development, configuration, type generation, or testing workflows.
- Do not retain product-specific skills for capabilities the template does not use.
- Do not let skills intentionally supported in both `.codex/skills/` and `.github/skills/` diverge.
- Do not require GitHub Issues, labels, assignments, tracker setup, or a companion skill suite for wayfinding.
- Do not treat a wayfinding map as the durable source of truth for architecture or feature behavior.
- Do not invoke wayfinding for work that is already clear enough to specify or implement in one session.

## Contract

### Definition of Done

- [ ] The template includes `workers-best-practices` and `wrangler` in both supported skill roots.
- [ ] Broad and unused product-specific Cloudflare skill bundles are absent from both roots.
- [ ] Agent guidance routes current Cloudflare documentation, API discovery, and account operations through the connected MCP.
- [ ] Product-specific skills are introduced only with the capability that needs them.
- [ ] The template includes an explicitly invoked `wayfinder` skill for large, uncertain, multi-session efforts.
- [ ] Wayfinder stores one map per effort in `docs/wayfinding/` and creates no external tracker state.
- [ ] Wayfinder promotes lasting decisions into the repository's existing architecture, ADR, and spec structure.

### Regression Guardrails

- The baseline must not reintroduce `cloudflare`, `agents-sdk`, `cloudflare-email-service`, or `durable-objects` as vendored skills without an explicit architecture change.
- The Worker and Wrangler skill copies must remain available while this repository is a Cloudflare Worker starter.
- Removing a baseline skill must not remove its runtime dependency or product implementation implicitly.
- Wayfinding must remain optional, repository-local, and independent of issue-tracker infrastructure.
- A map must not become ready for specification while lasting decisions exist only in transient planning text.

### Verification

- **Skill presence:** `test -f .codex/skills/workers-best-practices/SKILL.md && test -f .codex/skills/wrangler/SKILL.md`
- **Mirror presence:** `test -f .github/skills/workers-best-practices/SKILL.md && test -f .github/skills/wrangler/SKILL.md`
- **Pruned bundles:** confirm the four removed skill directories are absent from both roots
- **Documentation check:** `npm run format:check`
- **Wayfinder structure:** confirm the skill has valid `name` and `description` frontmatter plus valid `agents/openai.yaml`; use the skill-creator validator when its Python dependencies are available

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
