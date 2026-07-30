# Auth gateway

Public password gate in front of OpenSEO on Railway.

```text
Browser → Gate → OpenSEO (private)
```

One shared password (`SITE_PASSWORD`). No username. Session cookie after unlock.

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_PASSWORD` | yes | Unlock password |
| `UPSTREAM_URL` | yes | e.g. `http://OpenSEO.railway.internal:8080` |
| `PORT` | no | Listen port (Railway sets this) |

## Routes

| Path | Purpose |
|------|---------|
| `GET /__gate/health` | Healthcheck (no auth) |
| `GET /__gate/upstream` | Probe OpenSEO → `{ ok: true/false }` |
| `GET /__gate/starting` | Waiting UI while OpenSEO boots |
| `POST /__gate/login` | Password submit |
| `GET /__gate/logout` | Clear session |
| `*` | Gate + proxy |

If OpenSEO is still starting, visitors see a short “Starting…” page that retries until the app responds (instead of a raw bad gateway).
