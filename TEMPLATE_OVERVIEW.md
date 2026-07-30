# Deploy and Host OpenSEO with Railway

OpenSEO is an open-source SEO toolkit you self-host with your own DataForSEO API key. This community template deploys the official Docker image on Railway **behind a password gate by default**.

## About Hosting OpenSEO

### Architecture

- **Gate** (public): password unlock page → reverse proxy
- **OpenSEO** (private): `ghcr.io/every-app/open-seo` + volume at `/app/.wrangler`

You only need two secrets to get going: `DATAFORSEO_API_KEY` and `SITE_PASSWORD`.

### Security

OpenSEO’s Docker mode uses `AUTH_MODE=local_noauth` (no in-app login). This template does **not** leave that URL public. Traffic hits Gate first; set `SITE_PASSWORD` and keep the public domain on Gate only.

### Runtime notes

- First boot can take several minutes and needs ~4GB+ RAM (migrate + build)
- Prefer release tags; enable Image Auto Updates (minor + patch) on OpenSEO after deploy
- Cold start: Gate shows a waiting page until OpenSEO responds

## Common Use Cases

- Self-hosted SEO research with pay-as-you-go DataForSEO
- Agent / MCP workflows against your own instance
- Cloud Docker self-host without setting up Cloudflare Access yourself

## Dependencies for OpenSEO Hosting

### Deployment Dependencies

- [OpenSEO](https://github.com/every-app/open-seo)
- [Docker self-hosting](https://github.com/every-app/open-seo/blob/main/docs/SELF_HOSTING_DOCKER.md)
- [DataForSEO API key](https://github.com/every-app/open-seo/blob/main/docs/DATAFORSEO_API_KEY.md)

### Implementation Details

- Image: `ghcr.io/every-app/open-seo` (semver)
- Volume: `/app/.wrangler` on OpenSEO
- Gate → `http://OpenSEO.railway.internal:8080`
- Env: `DATAFORSEO_API_KEY`, `SITE_PASSWORD`, `AUTH_MODE=local_noauth`, `CLOUDFLARE_INCLUDE_PROCESS_ENV=true`, `ALLOWED_HOST` (Gate hostname)

### Why Deploy OpenSEO on Railway?

Railway hosts your stack without heavy ops overhead, so you can run OpenSEO and related services in one place and scale as needed.
