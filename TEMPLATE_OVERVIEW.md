# Deploy and Host OpenSEO with Railway

OpenSEO is an open-source SEO toolkit you self-host with your own DataForSEO API key. This community template deploys the official Docker image on Railway.

## About Hosting OpenSEO

Runs `ghcr.io/every-app/open-seo` with a volume at `/app/.wrangler` (D1/KV/R2 state — no Postgres/Redis). First boot can take several minutes and needs ~4GB+ RAM. Set `DATAFORSEO_API_KEY` to Base64 of `email:password`. Domain target port must match Railway `PORT` (often `8080`).

**Security:** Docker mode uses `AUTH_MODE=local_noauth`. Anyone with the public URL has admin access — keep it private or put your own auth in front.

**Updates:** After deploy, enable Image Auto Updates (minor + patch) under Settings → Source. Prefer release tags over `:latest`.

## Common Use Cases

- Self-hosted SEO research with pay-as-you-go DataForSEO
- Agent / MCP workflows against your own instance
- Quick Docker self-host without Cloudflare setup

## Dependencies for OpenSEO Hosting

### Deployment Dependencies

- [OpenSEO](https://github.com/every-app/open-seo)
- [Docker self-hosting](https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_DOCKER.md)
- [DataForSEO API key](https://github.com/every-app/open-seo/blob/main/docs/DATAFORSEO_API_KEY.md)

### Implementation Details

- Image: `ghcr.io/every-app/open-seo` (semver)
- Volume: `/app/.wrangler` (required for persistence)
- Env: `DATAFORSEO_API_KEY`, `AUTH_MODE=local_noauth`, `CLOUDFLARE_INCLUDE_PROCESS_ENV=true`, `ALLOWED_HOST`

### Why Deploy OpenSEO on Railway?

Railway hosts your stack without heavy ops overhead, so you can run OpenSEO and related services in one place and scale as needed.
