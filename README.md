# OpenSEO on Railway

Community template for [OpenSEO](https://github.com/every-app/open-seo). Deploys the official GHCR image with a volume at `/app/.wrangler`, plus a small **Gate** service so the public URL asks for a password.

## Deploy

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/openseo)

https://railway.com/deploy/openseo

## After deploy

1. Set `DATAFORSEO_API_KEY` (Base64 of `email:password`)
2. Set `SITE_PASSWORD` on **Gate** (the unlock password)
3. Use the **Gate** public URL — do not put a public domain on OpenSEO
4. Enable Image Auto Updates on OpenSEO (minor + patch)
5. Plan for a multi-minute cold start and ~4GB+ RAM

Open `/__gate/logout` to clear the session cookie.

## Stack

| Piece | Value |
|-------|--------|
| App image | `ghcr.io/every-app/open-seo` |
| Volume | `/app/.wrangler` on OpenSEO |
| Public entry | Gate (`auth-gateway/`) |
| App auth mode | `local_noauth` (behind Gate) |

Details: [`TEMPLATE_OVERVIEW.md`](TEMPLATE_OVERVIEW.md) · [`TEMPLATE_VARIABLES.md`](TEMPLATE_VARIABLES.md) · [`NOTES.md`](NOTES.md) · [`auth-gateway/README.md`](auth-gateway/README.md)
