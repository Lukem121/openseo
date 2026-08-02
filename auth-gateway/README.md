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
| `POST /__gate/login` | Password submit (optional `next` return path) |
| `GET /__gate/logout` | Clear session |
| `/mcp`, `/.well-known/*`, `/api/auth/oauth2/*`, `/api/oauth/consent` | Proxied without gate cookie (MCP clients / OAuth) |
| `*` | Gate + proxy |

MCP connectors (Cursor, Claude, Codex) cannot use the password cookie, so those discovery and OAuth paths bypass the gate and hit OpenSEO directly. The rest of the UI still requires `SITE_PASSWORD`.

If OpenSEO is still starting, visitors see a short “Starting…” page that retries until the app responds (instead of a raw bad gateway). After unlock, login returns to the original path when `next` is set (needed for MCP OAuth consent in the browser).
