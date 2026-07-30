# OpenSEO on Railway

Community template for [OpenSEO](https://github.com/every-app/open-seo).

One-click deploy of the official Docker image, with a **password gate in front** so the public URL is not open admin by default.

## Deploy

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/openseo)

https://railway.com/deploy/openseo

## How it works

```text
Browser  →  Gate (public URL, SITE_PASSWORD)  →  OpenSEO (private only)
```

| Service | Role |
|---------|------|
| **Gate** | Public entry. Shows a password page, then proxies to OpenSEO. |
| **OpenSEO** | The app image + volume. Stays on Railway private networking. |

OpenSEO still runs `AUTH_MODE=local_noauth` (same as Docker self-host). **Gate** is what stops strangers from using your instance.

## After deploy

1. Set **`DATAFORSEO_API_KEY`** on OpenSEO (Base64 of `email:password`)
2. Set **`SITE_PASSWORD`** on Gate (your unlock password)
3. Open the **Gate** public URL (not an OpenSEO public domain)
4. Confirm OpenSEO has **no** public domain
5. Enable Image Auto Updates on OpenSEO (minor + patch)
6. First boot can take several minutes (~4GB+ RAM)

Logout anytime: `/__gate/logout`

While OpenSEO is still cold-starting, Gate shows a short “Starting…” page and retries until the app is up.

## Stack

| Piece | Value |
|-------|--------|
| App image | `ghcr.io/every-app/open-seo` |
| Volume | `/app/.wrangler` on OpenSEO |
| Public entry | Gate (`auth-gateway/`) |
| Required secrets | `DATAFORSEO_API_KEY`, `SITE_PASSWORD` |

More detail: [`TEMPLATE_OVERVIEW.md`](TEMPLATE_OVERVIEW.md) · [`TEMPLATE_VARIABLES.md`](TEMPLATE_VARIABLES.md) · [`NOTES.md`](NOTES.md) · [`auth-gateway/README.md`](auth-gateway/README.md)
