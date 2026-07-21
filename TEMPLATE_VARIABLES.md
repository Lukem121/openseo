# Template variables (set in Railway template Variables UI)

Open the template in Railway → **Variables** tab.

For each row: open the **⋮** menu → edit. Set **Default value**, **Description**, and **Optional** as below.

Literal defaults (like `local_noauth`) do **not** carry over when generating a template from a project — only reference values like `${{RAILWAY_PUBLIC_DOMAIN}}` do. So these must be set on the template itself.

---

## Required (user must provide)

### `DATAFORSEO_API_KEY`
| Field | Value |
|-------|--------|
| Required | **Yes** (Optional = off) |
| Default | *(leave empty)* |
| Description | `Base64 of your DataForSEO email:password. See https://github.com/every-app/open-seo/blob/main/docs/DATAFORSEO_API_KEY.md` |

---

## Pre-filled (set default; mark Optional so deploy isn’t blocked)

### `AUTH_MODE`
| Field | Value |
|-------|--------|
| Required | No (Optional = **on**) |
| Default | `local_noauth` |
| Description | `Keep local_noauth for Docker self-host. WARNING: the public URL has no app login — gate it yourself.` |

### `CLOUDFLARE_INCLUDE_PROCESS_ENV`
| Field | Value |
|-------|--------|
| Required | No (Optional = **on**) |
| Default | `true` |
| Description | `Leave true so process env is exposed as Worker bindings in Docker/Miniflare mode.` |

### `VITE_SHOW_DEVTOOLS`
| Field | Value |
|-------|--------|
| Required | No (Optional = **on**) |
| Default | `false` |
| Description | `Keep false in production.` |

### `ALLOWED_HOST`
| Field | Value |
|-------|--------|
| Required | No (Optional = **on**) |
| Default | `${{RAILWAY_PUBLIC_DOMAIN}}` |
| Description | `Vite allowed hostname. Defaults to your Railway public domain; update if you add a custom domain.` |

---

## Optional extras (add if you want)

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
| Description | `Optional — Google Search Console OAuth. See OpenSEO GSC self-host docs.` |

---

## Deploy form goal

After this, users should mainly be prompted for **`DATAFORSEO_API_KEY`**. Everything else is pre-filled or skipped.
