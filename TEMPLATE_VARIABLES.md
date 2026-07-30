# Template variables (set in Railway template Variables UI)

Open the template in Railway → **Variables** tab. Variables are per service (**OpenSEO** vs **Gate**).

For each row: open the **⋮** menu → edit. Set **Default value**, **Description**, and **Optional** as below.

Literal defaults (like `local_noauth`) do **not** carry over when generating a template from a project — only reference values like `${{Gate.RAILWAY_PUBLIC_DOMAIN}}` do. So these must be set on the template itself.

---

## Gate (public entry)

### `SITE_PASSWORD`
| Field | Value |
|-------|--------|
| Service | **Gate** |
| Required | **Yes** (Optional = off) |
| Default | *(leave empty)* |
| Description | `Shared unlock password. Visitors enter this on the Gate page before using OpenSEO.` |

### `UPSTREAM_URL`
| Field | Value |
|-------|--------|
| Service | **Gate** |
| Required | No (Optional = **on**) |
| Default | `http://${{OpenSEO.RAILWAY_PRIVATE_DOMAIN}}:8080` |
| Description | `Private OpenSEO URL. Keep port in sync with OpenSEO PORT.` |

---

## OpenSEO (private app)

### `DATAFORSEO_API_KEY`
| Field | Value |
|-------|--------|
| Service | **OpenSEO** |
| Required | **Yes** (Optional = off) |
| Default | *(leave empty)* |
| Description | `Base64 of your DataForSEO email:password. See https://github.com/every-app/open-seo/blob/main/docs/DATAFORSEO_API_KEY.md` |

### `PORT`
| Field | Value |
|-------|--------|
| Service | **OpenSEO** |
| Required | No (Optional = **on**) |
| Default | `8080` |
| Description | `Private listen port. Keep 8080 unless you change Gate UPSTREAM_URL.` |

### `AUTH_MODE`
| Field | Value |
|-------|--------|
| Service | **OpenSEO** |
| Required | No (Optional = **on**) |
| Default | `local_noauth` |
| Description | `Keep local_noauth. Gate provides the public password gate.` |

### `CLOUDFLARE_INCLUDE_PROCESS_ENV`
| Field | Value |
|-------|--------|
| Service | **OpenSEO** |
| Required | No (Optional = **on**) |
| Default | `true` |
| Description | `Leave true so process env is exposed as Worker bindings in Docker/Miniflare mode.` |

### `VITE_SHOW_DEVTOOLS`
| Field | Value |
|-------|--------|
| Service | **OpenSEO** |
| Required | No (Optional = **on**) |
| Default | `false` |
| Description | `Keep false in production.` |

### `ALLOWED_HOST`
| Field | Value |
|-------|--------|
| Service | **OpenSEO** |
| Required | No (Optional = **on**) |
| Default | `${{Gate.RAILWAY_PUBLIC_DOMAIN}}` |
| Description | `Vite allowed hostname. Defaults to Gate’s public domain; update if you add a custom domain on Gate.` |

---

## Optional extras (OpenSEO)

### `OPENSEO_TELEMETRY_DISABLED`
| Field | Value |
|-------|--------|
| Required | No |
| Default | *(empty)* |
| Description | `Set to 1 to disable anonymous usage heartbeats.` |

### `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `BETTER_AUTH_SECRET`
| Field | Value |
|-------|--------|
| Required | No |
| Default | *(empty)* |
| Description | `Optional — Google Search Console OAuth. Use the Gate public URL as the OAuth redirect origin.` |

---

## Deploy form goal

Users should mainly be prompted for:

1. **`DATAFORSEO_API_KEY`** (OpenSEO)
2. **`SITE_PASSWORD`** (Gate)

Everything else is pre-filled or optional.

## Networking (do not skip)

```text
Public internet → Gate only
OpenSEO → private networking only
```

- Public / custom domain → **Gate**
- OpenSEO → **no** public domain
- Gate `UPSTREAM_URL` → `http://${{OpenSEO.RAILWAY_PRIVATE_DOMAIN}}:8080`
- OpenSEO `ALLOWED_HOST` → `${{Gate.RAILWAY_PUBLIC_DOMAIN}}` (or your custom Gate host)