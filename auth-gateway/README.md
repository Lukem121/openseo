# Auth gateway

Tiny reverse proxy in front of OpenSEO. One env password, cookie session, no username.

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_PASSWORD` | yes | Shared unlock password |
| `UPSTREAM_URL` | yes | Private OpenSEO URL, e.g. `http://OpenSEO.railway.internal:8080` |
| `PORT` | no | Listen port (Railway sets this) |

## Routes

- `GET /__gate/health` — healthcheck (no auth)
- `GET /__gate/upstream` — probes OpenSEO; `{ ok: true/false }`
- `GET /__gate/starting` — waiting page while OpenSEO boots (auto-retries)
- `POST /__gate/login` — password form submit
- `GET /__gate/logout` — clear session
- everything else — password gate, then proxy

If OpenSEO is still cold-starting, Gate shows a waiting page instead of raw “Bad gateway”.
