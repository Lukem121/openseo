import http from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

const PORT = Number(process.env.PORT || 8080);
const SITE_PASSWORD = process.env.SITE_PASSWORD || "";
const UPSTREAM_URL = (process.env.UPSTREAM_URL || "").replace(/\/$/, "");

if (!SITE_PASSWORD) {
  console.error("SITE_PASSWORD is required");
  process.exit(1);
}
if (!UPSTREAM_URL) {
  console.error("UPSTREAM_URL is required (e.g. http://OpenSEO.railway.internal:8080)");
  process.exit(1);
}

const COOKIE = "openseo_gate";
const token = () =>
  createHmac("sha256", SITE_PASSWORD).update("openseo-gate-v1").digest("hex");

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

function parseCookies(header = "") {
  const out = {};
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isAuthed(req) {
  const value = parseCookies(req.headers.cookie)[COOKIE];
  return Boolean(value && safeEqual(value, token()));
}

function wantsHtml(req) {
  const accept = req.headers.accept || "";
  return accept.includes("text/html") || accept === "" || accept === "*/*";
}

function loginPage(error = "") {
  const err = error
    ? `<p class="err">${error}</p>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OpenSEO</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: #0f1115; color: #e8eaed;
    }
    form {
      width: min(360px, 92vw); padding: 1.75rem;
      border: 1px solid #2a2f3a; border-radius: 12px; background: #161a22;
    }
    h1 { margin: 0 0 0.35rem; font-size: 1.25rem; font-weight: 600; }
    p.sub { margin: 0 0 1.25rem; color: #9aa3b2; font-size: 0.9rem; }
    label { display: block; font-size: 0.8rem; color: #9aa3b2; margin-bottom: 0.4rem; }
    input[type=password] {
      width: 100%; padding: 0.7rem 0.8rem; border-radius: 8px;
      border: 1px solid #3a4150; background: #0f1115; color: inherit; font-size: 1rem;
    }
    input[type=password]:focus { outline: 2px solid #5b8def; border-color: transparent; }
    button {
      margin-top: 1rem; width: 100%; padding: 0.75rem;
      border: 0; border-radius: 8px; background: #e8eaed; color: #0f1115;
      font-weight: 600; cursor: pointer; font-size: 0.95rem;
    }
    button:hover { filter: brightness(0.95); }
    .err { color: #ff8e8e; font-size: 0.85rem; margin: 0 0 0.75rem; }
  </style>
</head>
<body>
  <form method="post" action="/__gate/login">
    <h1>OpenSEO</h1>
    <p class="sub">Enter the site password to continue.</p>
    ${err}
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" autofocus required />
    <button type="submit">Unlock</button>
  </form>
</body>
</html>`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function setAuthCookie(res) {
  const secure = true;
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(token())}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`,
  );
}

function clearAuthCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`,
  );
}

function proxy(req, res) {
  const upstream = new URL(req.url || "/", UPSTREAM_URL);
  const lib = upstream.protocol === "https:" ? httpsRequest : httpRequest;
  const headers = { ...req.headers, host: upstream.host };
  // Keep original host for apps that care; also pass forwarded hints.
  if (req.headers.host) {
    headers["x-forwarded-host"] = req.headers.host;
    headers["x-forwarded-proto"] = "https";
    headers.host = req.headers.host;
  }

  const pReq = lib(
    {
      protocol: upstream.protocol,
      hostname: upstream.hostname,
      port: upstream.port || (upstream.protocol === "https:" ? 443 : 80),
      path: upstream.pathname + upstream.search,
      method: req.method,
      headers,
    },
    (pRes) => {
      res.writeHead(pRes.statusCode || 502, pRes.headers);
      pRes.pipe(res);
    },
  );
  pReq.on("error", (err) => {
    console.error("upstream error", err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    }
    res.end("Bad gateway");
  });
  req.pipe(pReq);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/__gate/health") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end("ok");
    return;
  }

  if (url.pathname === "/__gate/logout") {
    clearAuthCookie(res);
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  if (url.pathname === "/__gate/login" && req.method === "POST") {
    const body = await readBody(req);
    const params = new URLSearchParams(body.toString("utf8"));
    const password = params.get("password") || "";
    if (safeEqual(password, SITE_PASSWORD)) {
      setAuthCookie(res);
      res.writeHead(302, { Location: "/" });
      res.end();
      return;
    }
    res.writeHead(401, { "content-type": "text/html; charset=utf-8" });
    res.end(loginPage("Wrong password."));
    return;
  }

  if (!isAuthed(req)) {
    if (wantsHtml(req) && req.method === "GET") {
      res.writeHead(401, { "content-type": "text/html; charset=utf-8" });
      res.end(loginPage());
      return;
    }
    res.writeHead(401, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "unauthorized" }));
    return;
  }

  proxy(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`auth-gateway listening on :${PORT} → ${UPSTREAM_URL}`);
});
