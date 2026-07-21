import {
  defineRailway,
  image,
  project,
  service,
  volume,
} from "railway/iac";

/**
 * Third-party OpenSEO Railway template (not affiliated with every-app).
 * Persists Miniflare/D1/KV/R2 state on a volume at /app/.wrangler
 * (same path as official Docker Compose).
 *
 * Image tracks OpenSEO GHCR release tags. Enable Image Auto Updates
 * (minor+patch) after deploy if not already on via autoUpdates.
 */
export default defineRailway(() => {
  const data = volume("open-seo-data", {
    sizeMB: 5120,
  });

  const openSeo = service("OpenSEO", {
    source: image("ghcr.io/every-app/open-seo:v0.1.1", {
      autoUpdates: true,
    }),
    // Long grace: image runs migrate + full Vite build on every start.
    healthcheck: "/",
    healthcheckTimeout: 600,
    volumeMounts: {
      "/app/.wrangler": data,
    },
    env: {
      AUTH_MODE: {
        value: "local_noauth",
        description:
          "Docker self-host auth mode. Keep local_noauth. WARNING: the public Railway URL has no app auth — treat as private or put your own gate in front.",
      },
      CLOUDFLARE_INCLUDE_PROCESS_ENV: {
        value: "true",
        description:
          "Required so process env is exposed as Worker bindings in Docker/Miniflare mode.",
      },
      ALLOWED_HOST: {
        value: "${{RAILWAY_PUBLIC_DOMAIN}}",
        description:
          "Vite allowed host. Defaults to the Railway public domain. Update and redeploy if you add a custom domain.",
      },
      DATAFORSEO_API_KEY: {
        value: "",
        description:
          "Required for SEO data. Base64 of email:password from DataForSEO (see OpenSEO docs/DATAFORSEO_API_KEY.md).",
        isOptional: false,
      },
      OPENSEO_TELEMETRY_DISABLED: {
        value: "",
        description:
          "Set to 1 to disable anonymous usage heartbeats. Leave empty to allow telemetry.",
        isOptional: true,
      },
      DO_NOT_TRACK: {
        value: "",
        description: "Set to 1 as an alternate telemetry opt-out.",
        isOptional: true,
      },
      GOOGLE_CLIENT_ID: {
        value: "",
        description: "Optional. Google OAuth client ID for Search Console.",
        isOptional: true,
      },
      GOOGLE_CLIENT_SECRET: {
        value: "",
        description: "Optional. Google OAuth client secret for Search Console.",
        isOptional: true,
      },
      BETTER_AUTH_SECRET: {
        value: "",
        description:
          "Optional. Secret for GSC/auth integrations when using Google credentials.",
        isOptional: true,
      },
      VITE_SHOW_DEVTOOLS: {
        value: "false",
        description: "Keep false in production.",
        isOptional: true,
      },
    },
  });

  return project("OpenSEO", {
    resources: [openSeo, data],
  });
});
