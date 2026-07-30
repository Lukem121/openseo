# OpenSEO Railway template notes

## Template

- Marketplace: https://railway.com/deploy/openseo
- Repo: https://github.com/Lukem121/openseo
- App image: `ghcr.io/every-app/open-seo` (semver tags)
- Volume: `/app/.wrangler` on OpenSEO
- Gate: `auth-gateway/` (required public entry)

## Mental model

1. Visitors open **Gate**’s public URL
2. They enter `SITE_PASSWORD` once (cookie lasts ~30 days)
3. Gate proxies to **OpenSEO** over private networking
4. OpenSEO never needs a public domain

## Required setup

| Where | What |
|-------|------|
| Gate | `SITE_PASSWORD`, public domain |
| Gate | `UPSTREAM_URL=http://${{OpenSEO.RAILWAY_PRIVATE_DOMAIN}}:8080` |
| OpenSEO | `DATAFORSEO_API_KEY`, `PORT=8080` |
| OpenSEO | `ALLOWED_HOST=${{Gate.RAILWAY_PUBLIC_DOMAIN}}` |
| OpenSEO | **No** public domain |

Logout: `/__gate/logout`  
Starting page while app boots: automatic on Gate

## Verified

- Volume + D1 survive redeploy
- Gate password unlock + proxy works
- Cold-start waiting page until OpenSEO is ready
- Domain target port must match each service’s `PORT`
- Image Auto Updates: enable on OpenSEO Settings → Source (minor + patch)

## IaC

[`.railway/railway.ts`](.railway/railway.ts) is the intended shape (OpenSEO image + Gate from this repo’s `auth-gateway/`). On Windows, `railway config plan/apply` may fail loading `railway/iac`; use the dashboard / CLI to mirror the same services and vars.

## Checklist

1. `DATAFORSEO_API_KEY` on OpenSEO
2. `SITE_PASSWORD` on Gate
3. Public domain on Gate only
4. Image Auto Updates on OpenSEO
5. ~4GB+ RAM on OpenSEO for cold starts

Variables: [`TEMPLATE_VARIABLES.md`](TEMPLATE_VARIABLES.md)
