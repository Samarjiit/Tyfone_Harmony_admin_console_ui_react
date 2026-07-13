/**
 * Authentication service — replicates the JSP login flow exactly.
 *
 * Backend handlers (LoginController):
 *   GET  /login       render login page (tenant-branded, seeds CSRF + IDP fields)
 *   POST /login       form POST LoginModel -> dashboard | OTP | error | pwd expired
 *   GET/POST /enter_otp   MFA OTP (resend via GET /enter_otp?resend=true)
 *   GET  /logout      invalidate session (+ admin-API logout)
 *   GET  /dashboard   post-login landing (features/session context)
 */
import {
  fetchLoginPage,
  submitLegacyForm,
  parseOtpHiddenFields,
  fetchDashboardContext,
  type LoginOutcome,
  type DashboardContext
} from './legacyPage';
import { getCsrfToken } from './csrf';
import { api } from './basePath';

export interface LoginResult {
  outcome: LoginOutcome['kind'];
  message?: string;
}

let pendingOtpFields: Record<string, string> | null = null;

/** Browser timezone abbreviation, same as login.jsp's moment.tz.guess() logic. */
export function clientTimezoneAbbr(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const part = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName');
    return part?.value ?? '';
  } catch {
    return '';
  }
}

export async function login(username: string, password: string): Promise<LoginResult> {
  // 1. Load the rendered login page: primes JSESSIONID + CSRF token and
  //    yields the dynamic IDP hidden fields the server round-trips.
  const page = await fetchLoginPage();
  if (page.alreadyAuthenticated) return { outcome: 'success' };

  // 2. POST the exact field set login.jsp submits.
  const outcome = await submitLegacyForm('/login', {
    username: username.trim(),
    password,
    submitUri: page.hidden.submitUri,
    jUsername: page.hidden.jUsername,
    jPassword: page.hidden.jPassword,
    display: page.hidden.display,
    submit: page.hidden.submit,
    clientsTimezone: clientTimezoneAbbr(),
    antiCsrfToken: getCsrfToken() ?? ''
  });

  if (outcome.kind === 'otp_required') {
    pendingOtpFields = parseOtpHiddenFields(outcome.page);
    return { outcome: 'otp_required' };
  }
  if (outcome.kind === 'password_expired') return { outcome: 'password_expired' };
  if (outcome.kind === 'failure') return { outcome: 'failure', message: outcome.message };
  return { outcome: 'success' };
}

export async function submitOtp(otpValue: string): Promise<LoginResult> {
  const outcome = await submitLegacyForm('/enter_otp', {
    ...(pendingOtpFields ?? {}),
    otpValue,
    antiCsrfToken: getCsrfToken() ?? ''
  });
  if (outcome.kind === 'failure') return { outcome: 'failure', message: outcome.message };
  if (outcome.kind === 'otp_required') {
    // Server re-rendered the OTP page: wrong/expired code.
    pendingOtpFields = parseOtpHiddenFields(outcome.page);
    return { outcome: 'failure', message: 'Invalid OTP. Please try again.' };
  }
  pendingOtpFields = null;
  return { outcome: outcome.kind };
}

/** GET /enter_otp?resend=true — server re-sends the OTP and re-renders the page. */
export async function resendOtp(): Promise<void> {
  const res = await fetch(api('/enter_otp?resend=true'), { credentials: 'include' });
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  pendingOtpFields = parseOtpHiddenFields(doc);
}

/** GET /logout — server invalidates the session and calls the admin-API logout. */
export async function logout(): Promise<void> {
  await fetch(api('/logout'), { credentials: 'include' });
}

/** GET /session-timeout — invalidates the server session (JSP parity). */
export async function touchSessionTimeout(): Promise<void> {
  await fetch(api('/session-timeout'), { credentials: 'include' }).catch(() => undefined);
}

/** Probe the current session and load features/username from /dashboard. */
export async function probeSession(): Promise<DashboardContext> {
  return fetchDashboardContext();
}
