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
- `POST /__gate/login` — password form submit
- `GET /__gate/logout` — clear session
- everything else — password gate, then proxy
