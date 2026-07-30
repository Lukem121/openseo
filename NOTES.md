# OpenSEO Railway template notes

## Template

- Marketplace: https://railway.com/deploy/openseo
- App image: `ghcr.io/every-app/open-seo` (semver tags)
- Volume: `/app/.wrangler` on OpenSEO (required for persistence)
- Gate: `auth-gateway/` (password unlock → private OpenSEO)

## Verified locally

- Volume mount + D1 survive redeploy (`No migrations to apply!` after restart)
- HTTP 200 after cold start (multi-minute build; ~4GB+ RAM recommended)
- Domain target port must match Railway `PORT` (often `8080`)
- Image Auto Updates: enable in OpenSEO Settings → Source (minor + patch) after deploy

## Auth gate

OpenSEO Docker is `local_noauth`. Public access goes through **Gate**:

1. Set `SITE_PASSWORD` on Gate
2. Generate a public domain on **Gate** only
3. Remove any public domain from **OpenSEO**
4. OpenSEO `ALLOWED_HOST` = Gate public hostname
5. Gate `UPSTREAM_URL` = `http://${{OpenSEO.RAILWAY_PRIVATE_DOMAIN}}:8080`

Logout: `/__gate/logout`

## IaC note

[`.railway/railway.ts`](.railway/railway.ts) documents the intended shape. On Windows, `railway config plan/apply` may fail loading `railway/iac`; provision with `railway add` / `volume` / `variable` / `domain` instead.

## Post-deploy checklist

1. Set `DATAFORSEO_API_KEY` on OpenSEO (Base64 of `email:password`)
2. Set `SITE_PASSWORD` on Gate
3. Confirm only Gate has a public domain
4. Confirm Gate domain port matches Gate `PORT`
5. Enable Image Auto Updates on OpenSEO (minor + patch)
6. Size OpenSEO memory for multi-minute cold starts (~4GB+)

Variable defaults: see [`TEMPLATE_VARIABLES.md`](TEMPLATE_VARIABLES.md).
