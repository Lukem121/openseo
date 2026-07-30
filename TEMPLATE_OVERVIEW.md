# Deploy and Host OpenSEO with Railway

OpenSEO is an open-source SEO toolkit you self-host with your own DataForSEO API key. This community template deploys the official Docker image on Railway behind a simple password gate.

## About Hosting OpenSEO

Runs `ghcr.io/every-app/open-seo` with a volume at `/app/.wrangler` (D1/KV/R2 state — no Postgres/Redis). First boot can take several minutes and needs ~4GB+ RAM. Set `DATAFORSEO_API_KEY` to Base64 of `email:password`.

**Security:** OpenSEO Docker mode uses `AUTH_MODE=local_noauth`. This template puts a **Gate** service in front: set `SITE_PASSWORD`, open the Gate URL, enter that password once. Keep OpenSEO private (no public domain on the OpenSEO service).

**Updates:** After deploy, enable Image Auto Updates (minor + patch) under OpenSEO Settings → Source. Prefer release tags over `:latest`.

## Common Use Cases

- Self-hosted SEO research with pay-as-you-go DataForSEO
- Agent / MCP workflows against your own instance
- Quick Docker self-host without Cloudflare Access

## Dependencies for OpenSEO Hosting

### Deployment Dependencies

- [OpenSEO](https://github.com/every-app/open-seo)
- [Docker self-hosting](https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_DOCKER.md)
- [DataForSEO API key](https://github.com/every-app/open-seo/blob/main/docs/DATAFORSEO_API_KEY.md)

### Implementation Details

- Image: `ghcr.io/every-app/open-seo` (semver)
- Volume: `/app/.wrangler` on OpenSEO (required for persistence)
- Gate: password form → private `http://OpenSEO.railway.internal:8080`
- Env: `DATAFORSEO_API_KEY`, `SITE_PASSWORD`, `AUTH_MODE=local_noauth`, `CLOUDFLARE_INCLUDE_PROCESS_ENV=true`, `ALLOWED_HOST` (Gate public host)

### Why Deploy OpenSEO on Railway?

Railway hosts your stack without heavy ops overhead, so you can run OpenSEO and related services in one place and scale as needed.
