# ADR-057: Deploy Main with Cloudflare Builds

**Status:** Implemented

**Date:** 2026-09-02

## Context

The production Worker was initially deployed manually with Wrangler. The
project needs a direct, low-maintenance path from reviewed changes on `main` to
the existing production Worker without introducing another deployment system.

## Decision

Connect the `bebraw/media-aggregator` GitHub repository to the
`media-aggregator` Worker through Cloudflare Workers Builds. Treat `main` as the
only production branch. Cloudflare runs `npm run build:css` as the build command
and `npx wrangler deploy` as the deploy command after a push to `main`.

Keep builds for non-production branches disabled. GitHub Actions remains the
verification workflow; Cloudflare Workers Builds owns production deployment.
Manual deployment through the pinned Wrangler CLI remains an operational
fallback.

## Consequences

**Positive:**

- A push to `main` automatically builds the generated stylesheet and deploys
  the resulting Worker.
- Deployment uses the existing Cloudflare project and repository-pinned
  Wrangler version.
- Production and verification responsibilities remain explicit and separate.

**Negative:**

- Production deployment depends on Cloudflare's GitHub connection, build
  service, and managed API token.
- A change merged to `main` can deploy immediately after the configured build
  succeeds.
- Preview environments are not created for non-production branches.

## Alternatives Considered

### Deploy from GitHub Actions

This would require storing and maintaining Cloudflare credentials in GitHub and
adding another repository workflow. Cloudflare's native build connection is
smaller for this personal project.

### Continue manual Wrangler deployments

Manual deployment remains useful as a fallback but does not provide the
requested push-to-production behavior.
