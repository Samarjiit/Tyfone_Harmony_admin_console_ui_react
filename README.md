# Admin Console — React (Vite + TypeScript)

React frontend for the Harmony Admin Console. The Spring backend is **completely untouched** — this app speaks the backend's existing wire protocol:

- **Multitenancy**: tenant is resolved at runtime via the backend's own `GET /bank_id` endpoint (Host-header driven, exactly like the JSP app); branding (logo, favicon, colors) loads from `/resources/<tenant>/…`. Offline fallback: `public/tenants.json`, generated from the Spring properties files.
- **Login / OTP**: `POST /login` and `POST /enter_otp` as form-encoded posts with the hidden IDP fields harvested from the server-rendered pages; outcomes (dashboard redirect / OTP page / error / password expired) are detected from the response.
- **CSRF**: `antiCsrfToken` header, token harvested from the login page meta tag (session attr `crefTokenForClient`).
- **Session**: `JSESSIONID` cookie; expiry signals (HTTP 402, envelope `1000`/`8000`) handled globally.
- **Login look & feel**: the login screen loads the *original* backend stylesheets (`/resources/customcss/login.min.css` + `/resources/<tenant>/css/bank_login.css`) and uses the same markup/class names as `login.jsp`.

## Prerequisites

1. **Node.js 18+**
2. **The Spring backend running locally** (Tomcat with `adminconsole-ux` deployed). The tenant domains resolve to localhost via your hosts file:
   ```
   127.0.0.1 staronedev.tyfone.com
   127.0.0.1 diamondcudev1.tyfone.com
   ```

## Configuration — `.env`

```properties
VITE_CONTEXT_PATH=/adminconsole-ux            # backend servlet context path
VITE_BACKEND_TARGET=http://staronedev.tyfone.com   # dev proxy target = tenant you develop against
```

- **Switch tenant in dev** by changing `VITE_BACKEND_TARGET` (e.g. `http://diamondcudev1.tyfone.com`) and restarting `npm run dev`. The proxy sends that host as the `Host` header, which is what the backend's tenant resolution keys on.
- If your Tomcat listens on a non-80 port, include it: `http://staronedev.tyfone.com:8080`.

## Run (development)

```bash
cd admin-console-react
npm install          # first time only
npm run dev          # starts http://localhost:3000
```

Open **http://localhost:3000/login** — you should see the tenant's logo and colors, log in with real admin credentials, enter the OTP when prompted, and land on the dashboard. Logout returns you to the logged-out page.

> If the login card shows "Unable to resolve the tenant…", the backend is not reachable — start Tomcat and reload.

## Build (production)

```bash
npm run build        # emits dist/
```

Serve `dist/` from the **same origin** as the backend (reverse-proxy rule or drop into the Tomcat webapp) — the app uses relative `/adminconsole-ux/**` URLs, so no build-time host configuration is needed and one build serves all tenants.

## Regenerate the tenant fallback map

When a tenant is added to the Spring properties files:

```bash
npm run tenants      # rewrites public/tenants.json
```

## Project structure

```
src/
  services/
    basePath.ts     backend context path (single source of truth for URLs)
    csrf.ts         antiCsrfToken handling (harvested from server pages)
    http.ts         axios instance: cookies, CSRF, session-expiry interceptors
    legacyPage.ts   adapter for the server-rendered (JSP) auth endpoints
    auth.service.ts login / OTP / logout / session probe
  utils/tenant.ts   tenant resolution (/bank_id → tenants.json fallback) + asset URLs
  context/          TenantContext (branding), AuthContext (auth state machine)
  layouts/          LoginLayout (JSP login.jsp structure + original stylesheets)
  pages/            LoginPage, EnterOtpPage, DashboardPage (welcome), LogoutPage,
                    SessionTimeoutPage
  components/       RequireAuth route guard
scripts/
  generate-tenants.mjs   builds public/tenants.json from Spring properties
docs/               analysis + migration documentation
```
