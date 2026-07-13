/**
 * Central Axios instance mirroring the JSP app's wire behavior.
 *
 *  - Base URL: relative context path (BASE_PATH) — same-origin in prod,
 *    Vite proxy in dev. Never a hardcoded host: that would break both
 *    multi-tenancy (Host header drives tenant resolution) and the
 *    SameSite=Strict JSESSIONID cookie.
 *  - CSRF: header `antiCsrfToken` on every non-GET/HEAD/OPTIONS request.
 *  - `X-Requested-With: XMLHttpRequest` so InvalidSessionException comes back
 *    as JSON {code:"8000"} instead of the session-timeout HTML page.
 *  - Session expiry signals: HTTP 402, envelope code/status "1000" or "8000".
 */
import axios, { AxiosError, type AxiosInstance } from 'axios';
import { CSRF_HEADER, getCsrfToken } from './csrf';
import { BASE_PATH } from './basePath';
import {
  API_SESSION_EXPIRED,
  AJAX_SESSION_EXPIRED,
  envelopeCode,
  type ApiEnvelope
} from '../types/models';

export const SESSION_EXPIRED_EVENT = 'app:session-expired';
export const PERMISSION_DENIED_EVENT = 'app:permission-denied';

function emitSessionExpired(): void {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}

function emitPermissionDenied(): void {
  window.dispatchEvent(new CustomEvent(PERMISSION_DENIED_EVENT));
}

function isMutating(method?: string): boolean {
  return !/^(get|head|options)$/i.test(method ?? 'get');
}

export const http: AxiosInstance = axios.create({
  baseURL: BASE_PATH,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

http.interceptors.request.use((config) => {
  if (isMutating(config.method)) {
    const token = getCsrfToken();
    if (token) config.headers.set(CSRF_HEADER, token);
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const body = response.data as ApiEnvelope | undefined;
    if (body && typeof body === 'object') {
      const code = envelopeCode(body);
      if (code === API_SESSION_EXPIRED || code === AJAX_SESSION_EXPIRED) {
        emitSessionExpired();
        return Promise.reject(new SessionExpiredError(body.message));
      }
    }
    return response;
  },
  (error: AxiosError<ApiEnvelope>) => {
    const status = error.response?.status;
    if (status === 402) {
      emitSessionExpired();
      return Promise.reject(new SessionExpiredError());
    }
    if (status === 403) {
      const body = error.response?.data;
      const code = body ? envelopeCode(body) : undefined;
      if (code === AJAX_SESSION_EXPIRED || code === API_SESSION_EXPIRED) {
        emitSessionExpired();
        return Promise.reject(new SessionExpiredError(body?.message));
      }
      emitPermissionDenied();
    }
    return Promise.reject(error);
  }
);

export class SessionExpiredError extends Error {
  constructor(message = 'Your session has expired.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}
