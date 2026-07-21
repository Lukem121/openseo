# OpenSEO Railway template notes

## Verified reference project

| Item | Value |
|------|--------|
| Workspace | Social Freak Network |
| Project | OpenSEO (`675856b6-cb4e-4e67-8f7e-992bf4f8d6e9`) |
| Service | OpenSEO · image `ghcr.io/every-app/open-seo:v0.1.1` |
| Volume | `openseo-volume` → `/app/.wrangler` |
| Public URL | https://openseo-production-098f.up.railway.app (target port **8080** = Railway `PORT`) |
| Template | [openseo](https://railway.com/deploy/openseo) (`6a1ba9ba-fcb0-4085-90dd-bdf142c180e5`) |

## Dry-run results

- First boot: volume mounted, D1 migrate + Vite build, HTTP 200 on `/`.
- Redeploy: logs showed `No migrations to apply!` (D1 state survived on the volume), then HTTP 200 again.
- Image Auto Updates: enable in service Settings → Source after deploy (minor+patch). Not reliably settable via current CLI/GraphQL for this image service; documented in marketplace overview.

## IaC note

`.railway/railway.ts` documents the intended shape. On Windows, `railway config plan/apply` currently fails loading `railway/iac` (module URL query bug). Provisioning was done with `railway add` / `railway volume add` / `railway variable` / `railway domain` instead.

## Post-deploy checklist for consumers

1. Replace `DATAFORSEO_API_KEY` placeholder with real Base64 `email:password`.
2. Confirm domain target port matches container `PORT` (often 8080).
3. Enable Image Auto Updates (minor + patch).
4. Remember `local_noauth` — do not expose publicly without your own gate.
5. Size memory for multi-minute cold starts (~4GB+).
