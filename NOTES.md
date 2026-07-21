# OpenSEO Railway template notes

## Template

- Marketplace: https://railway.com/deploy/openseo
- Image: `ghcr.io/every-app/open-seo` (semver tags)
- Volume: `/app/.wrangler` (required for persistence)

## Verified locally

- Volume mount + D1 survive redeploy (`No migrations to apply!` after restart)
- HTTP 200 after cold start (multi-minute build; ~4GB+ RAM recommended)
- Domain target port must match Railway `PORT` (often `8080`)
- Image Auto Updates: enable in service Settings → Source (minor + patch) after deploy

## IaC note

[`.railway/railway.ts`](.railway/railway.ts) documents the intended shape. On Windows, `railway config plan/apply` may fail loading `railway/iac`; provision with `railway add` / `volume` / `variable` / `domain` instead.

## Post-deploy checklist

1. Set `DATAFORSEO_API_KEY` (Base64 of `email:password`)
2. Confirm domain port matches `PORT`
3. Enable Image Auto Updates (minor + patch)
4. Remember `local_noauth` — gate the public URL yourself
5. Size memory for multi-minute cold starts (~4GB+)

Variable defaults: see [`TEMPLATE_VARIABLES.md`](TEMPLATE_VARIABLES.md).
