/**
 * CSRF token handling.
 *
 * Backend contract (CSRFValidationFilter + LoggingAspect):
 *  - Server mints a 100-hex-char token ONCE per session, stored in session
 *    attribute `crefTokenForClient` (sic).
 *  - Every POST/PUT must echo it in header `antiCsrfToken` (request parameter
 *    `antiCsrfToken` accepted as fallback).
 *  - Exempt paths (only while the session has no token yet): /login,
 *    /oktaLogin, /dashboard, /oktaAccessToken.
 *  - Server-rendered pages expose it via <meta name="antiCsrfToken"> and
 *    hidden inputs — the SPA harvests it from there.
 */
export const CSRF_HEADER = 'antiCsrfToken';

let csrfToken: string | null = null;

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

const META_RE = /<meta[^>]*name=["']antiCsrfToken["'][^>]*content=["']([^"']*)["']/i;
const INPUT_RE = /<input[^>]*name=["']antiCsrfToken["'][^>]*value=["']([^"']*)["']/i;

/** Extract the CSRF token from server-rendered HTML (meta tag or hidden input). */
export function extractCsrfToken(html: string): string | null {
  const meta = META_RE.exec(html);
  if (meta && meta[1]) return meta[1];
  const input = INPUT_RE.exec(html);
  if (input && input[1]) return input[1];
  return null;
}
