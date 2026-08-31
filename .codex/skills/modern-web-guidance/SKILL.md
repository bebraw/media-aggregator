---
name: modern-web-guidance
description: Retrieve pinned, Baseline-aware web-platform guidance when browser work requires choosing a feature, checking compatibility, or designing a fallback.
---

# Modern Web Guidance

Use focused Chrome guidance as implementation input while keeping repository architecture, specs, source conventions, and verification authoritative.

## Retrieve

Search once with the desired browser behavior:

```bash
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@0.0.180 search "<query>"
```

Retrieve only the most relevant guide IDs:

```bash
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@0.0.180 retrieve "<id>"
```

Multiple IDs are appropriate only when the task crosses distinct concerns. If the pinned package is unavailable, use current primary web-platform documentation and state the fallback; never substitute a moving version or enable telemetry.

## Apply

- Use Baseline Widely available features for core behavior unless the project records a narrower target.
- Treat newer features as progressive enhancements with a usable core path.
- Prefer feature detection and small local fallbacks; ask before adding a polyfill or dependency.
- Adapt retrieved examples to the typed-client boundary in `ARCHITECTURE.md`; never restore inline handlers or scripts.
- Treat Chromium Playwright or Lighthouse output as Chromium evidence, not cross-browser proof.
- Use `frontend-design` for visual direction, `minimal-visual-style` for the starter's visual language, and `web-perf` for measured performance diagnosis.

Skip this skill for copy-only work, routine changes that apply established repository patterns, backend-only Worker code, CI, and general tooling.

Provenance and reviewed package coordinates are recorded in `docs/adrs/implemented/ADR-052-adopt-scoped-modern-web-guidance.md` and `specs/agent-skills/spec.md`.
