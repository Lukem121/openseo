# OpenSEO on Railway

Community template for [OpenSEO](https://github.com/every-app/open-seo). Deploys the official GHCR image with a volume at `/app/.wrangler`.

## Deploy

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/openseo)

https://railway.com/deploy/openseo

## After deploy

1. Set `DATAFORSEO_API_KEY` (Base64 of `email:password`)
2. Enable Image Auto Updates (minor + patch)
3. Plan for a multi-minute cold start and ~4GB+ RAM
4. Remember: `local_noauth` — gate the public URL yourself

## Stack

| Piece | Value |
|-------|--------|
| Image | `ghcr.io/every-app/open-seo` |
| Volume | `/app/.wrangler` |
| Auth | `local_noauth` |

Details: [`TEMPLATE_OVERVIEW.md`](TEMPLATE_OVERVIEW.md) · [`TEMPLATE_VARIABLES.md`](TEMPLATE_VARIABLES.md) · [`NOTES.md`](NOTES.md)
