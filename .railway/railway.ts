import {
  defineRailway,
  github,
  image,
  project,
  service,
  volume,
} from "railway/iac";

/**
 * Third-party OpenSEO Railway template (not affiliated with every-app).
 *
 * Public traffic hits Gate (password form) → private OpenSEO over
 * Railway internal networking. OpenSEO stays AUTH_MODE=local_noauth;
 * do not attach a public domain to OpenSEO.
 *
 * Image tracks OpenSEO GHCR release tags. Enable Image Auto Updates
 * (minor+patch) on OpenSEO after deploy if needed.
 */
export default defineRailway(() => {
  const data = volume("open-seo-data", {
    sizeMB: 5120,
  });

  const openSeo = service("OpenSEO", {
    source: image("ghcr.io/every-app/open-seo:v0.1.1", {
      autoUpdates: { type: "minor", tagMode: "semver" },
    }),
    // Long grace: image runs migrate + full Vite build on every start.
    healthcheck: "/",
    healthcheckTimeout: 600,
    volumeMounts: {
      "/app/.wrangler": data,
    },
    env: {
      // Fixed so Gate can reach OpenSEO on a known private port.
      PORT: {
        value: "8080",
        description:
          "Listen port for private networking. Keep 8080 unless you also change Gate UPSTREAM_URL.",
      },
      AUTH_MODE: {
        value: "local_noauth",
        description:
          "Docker self-host auth mode. Keep local_noauth — Gate provides the public password gate.",
      },
      CLOUDFLARE_INCLUDE_PROCESS_ENV: {
        value: "true",
        description:
          "Required so process env is exposed as Worker bindings in Docker/Miniflare mode.",
      },
      ALLOWED_HOST: {
        value: "${{Gate.RAILWAY_PUBLIC_DOMAIN}}",
        description:
          "Vite allowed host. Defaults to the Gate public domain. Update if you add a custom domain on Gate.",
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

  const gate = service("Gate", {
    source: github("Lukem121/openseo", { rootDirectory: "auth-gateway" }),
    healthcheck: "/__gate/health",
    healthcheckTimeout: 120,
    env: {
      SITE_PASSWORD: {
        value: "",
        description:
          "Required. Shared password shown on the unlock page before anyone can use OpenSEO.",
        isOptional: false,
      },
      UPSTREAM_URL: {
        value: "http://${{OpenSEO.RAILWAY_PRIVATE_DOMAIN}}:8080",
        description:
          "Private OpenSEO URL. Keep in sync with OpenSEO PORT (default 8080).",
      },
    },
  });

  return project("OpenSEO", {
    resources: [openSeo, gate, data],
  });
});
