/**
 * Single source of truth for the backend context path.
 *
 * The Spring app is deployed under a servlet context path (e.g.
 * /adminconsole-ux); JSPs hide it behind ${pageContext.request.contextPath}.
 * The SPA prefixes every backend URL (APIs, /login, /resources/**) with it.
 *
 * All URLs stay RELATIVE (no scheme/host):
 *  - dev:  the Vite proxy forwards /adminconsole-ux/** to the real backend,
 *    so the browser sees one origin and the SameSite=Strict JSESSIONID works
 *  - prod: the SPA is served from the same origin as the backend, so relative
 *    URLs hit it directly
 */
export const BASE_PATH: string = import.meta.env.VITE_CONTEXT_PATH ?? '/adminconsole-ux';

/** Build a backend URL: api('/login') -> '/adminconsole-ux/login' */
export function api(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}
