/**
 * Adapter for the server-rendered (JSP) endpoints of the untouched backend.
 *
 * The authentication endpoints (/login, /enter_otp, /admin_reset_password)
 * are classic Spring MVC form handlers: they consume
 * application/x-www-form-urlencoded and respond with rendered JSP HTML or a
 * redirect. Since the backend must not change, the SPA speaks that exact
 * protocol: it fetches the rendered pages, extracts the hidden form fields
 * the server expects back (IDP submitUri/jUsername/jPassword/display/submit),
 * posts the form, and classifies the outcome from the response document.
 *
 * Outcome detection markers (verified against the JSPs):
 *  - success ......... final URL is /dashboard (redirect:/dashboard)
 *  - OTP required .... document contains form id "formloginsubmitotp" (enter_otp.jsp)
 *  - pwd expired ..... document contains reset_password_admin form markers
 *  - failure ......... login form re-rendered; error text in #errorMessage /
 *                      #errorResponse / #loginErrorMessage labels
 */
import { extractCsrfToken, setCsrfToken } from './csrf';
import { api } from './basePath';

export interface ParsedLoginPage {
  csrfToken: string | null;
  /** hidden IDP fields rendered by login.jsp from MeValidateResponse */
  hidden: {
    submitUri: string;
    jUsername: string;
    jPassword: string;
    display: string;
    submit: string;
  };
  /** true when the server redirected an already-authenticated session to /dashboard */
  alreadyAuthenticated: boolean;
  errorMessage: string | null;
}

export type LoginOutcome =
  | { kind: 'success' }
  | { kind: 'otp_required'; page: Document }
  | { kind: 'password_expired'; page: Document }
  | { kind: 'failure'; message: string };

function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

function inputValue(doc: Document, id: string): string {
  const el = doc.getElementById(id) as HTMLInputElement | null;
  if (el && typeof el.value === 'string') return el.value;
  const byName = doc.querySelector<HTMLInputElement>(`input[name="${id}"]`);
  return byName?.value ?? '';
}

function inputValueOrNull(doc: Document, id: string): string | null {
  const value = inputValue(doc, id);
  return value ? value.trim() : null;
}

function textOf(doc: Document, id: string): string {
  return doc.getElementById(id)?.textContent?.trim() ?? '';
}

function textOfOrNull(doc: Document, id: string): string | null {
  const text = textOf(doc, id);
  return text ? text : null;
}

function isDashboardUrl(url: string): boolean {
  return /\/dashboard(\?|$)/.test(url);
}

function isOtpPage(doc: Document): boolean {
  return Boolean(
    doc.getElementById('formloginsubmitotp') || doc.querySelector('form[action$="enter_otp"]')
  );
}

function isAdminResetPage(doc: Document): boolean {
  return Boolean(
    doc.querySelector('form[action$="admin_reset_password"]') ||
      doc.querySelector('link[href*="css/reset.css"]')
  );
}

/** GET /login and extract everything the SPA needs to submit credentials. */
export async function fetchLoginPage(): Promise<ParsedLoginPage> {
  const res = await fetch(api('/login'), { credentials: 'include' });
  const finalUrl = res.url || '';
  const html = await res.text();
  const token = extractCsrfToken(html);
  if (token) setCsrfToken(token);
  const doc = parseHtml(html);
  return {
    csrfToken: token,
    hidden: {
      submitUri: inputValue(doc, 'submitUri'),
      jUsername: inputValue(doc, 'jUsername'),
      jPassword: inputValue(doc, 'jPassword'),
      display: inputValue(doc, 'display'),
      submit: inputValue(doc, 'submit')
    },
    alreadyAuthenticated: isDashboardUrl(finalUrl),
    errorMessage:
      textOf(doc, 'errorMessage') ||
      textOf(doc, 'errorResponse') ||
      textOf(doc, 'loginErrorMessage') ||
      null
  };
}

/** POST a form-encoded body to a server-rendered endpoint and classify the result. */
export async function submitLegacyForm(
  action: string,
  fields: Record<string, string>
): Promise<LoginOutcome> {
  const body = new URLSearchParams(fields);
  const res = await fetch(api(action), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString(),
    redirect: 'follow'
  });
  const finalUrl = res.url || '';
  const html = await res.text();

  // Any rendered page may carry a (newly minted) CSRF token — keep ours fresh.
  const token = extractCsrfToken(html);
  if (token) setCsrfToken(token);

  if (isDashboardUrl(finalUrl)) return { kind: 'success' };

  const doc = parseHtml(html);
  if (isOtpPage(doc)) return { kind: 'otp_required', page: doc };
  if (isAdminResetPage(doc)) return { kind: 'password_expired', page: doc };

  const message =
    textOf(doc, 'errorMessage') ||
    textOf(doc, 'errorResponse') ||
    textOf(doc, 'loginErrorMessage') ||
    textOf(doc, 'errorResetPwdResponse') ||
    'Login failed. Please check your credentials.';
  return { kind: 'failure', message };
}

/** Hidden fields on enter_otp.jsp that must be echoed on POST /enter_otp. */
export function parseOtpHiddenFields(doc: Document): Record<string, string> {
  const fields: Record<string, string> = {};
  doc
    .querySelectorAll<HTMLInputElement>(
      '#formloginsubmitotp input[type="hidden"], form[action$="enter_otp"] input[type="hidden"]'
    )
    .forEach((el) => {
      if (el.name && el.name !== 'antiCsrfToken') fields[el.name] = el.value;
    });
  return fields;
}

export interface DashboardContext {
  /** feature ids from the session `features` set rendered into the page */
  features: number[];
  /** admin display name if present in the header profile popover */
  username: string | null;
  /** admin first name */
  firstname: string | null;
  /** admin last name */
  lastname: string | null;
  /** admin email address */
  emailAddress: string | null;
  /** admin mobile number */
  mobileno: string | null;
  /** admin role name */
  roleName: string | null;
  /** admin role slug */
  roleSlug: string | null;
  /** enrollment/created date */
  enrollmentDate: string | null;
  /** timezone */
  timezone: string | null;
  /** build version rendered in footer.jsp ("v${sessionScope.buildVersion}") */
  buildVersion: string | null;
  loggedIn: boolean;
}

/**
 * GET /dashboard and extract the logged-in context the JSPs expose to their
 * own scripts (`var features = ${features}` and `${myprofile.username}` in
 * header.jsp). This is the SPA's session probe: an invalid session yields the
 * session-timeout page instead.
 */
export async function fetchDashboardContext(): Promise<DashboardContext> {
  const res = await fetch(api('/dashboard'), { credentials: 'include' });
  const finalUrl = res.url || '';
  const html = await res.text();
  const token = extractCsrfToken(html);
  if (token) setCsrfToken(token);

  if (/session-timeout|\/login(\?|$)/.test(finalUrl)) {
    return {
      features: [],
      username: null,
      firstname: null,
      lastname: null,
      emailAddress: null,
      mobileno: null,
      roleName: null,
      roleSlug: null,
      enrollmentDate: null,
      timezone: null,
      buildVersion: null,
      loggedIn: false,
    };
  }

  // JSTL renders Set<Integer> as "[101, 102, 115]"
  const featMatch = /(?:var\s+features|var\s+featureList)\s*=\s*\[([0-9,\s]*)\]/.exec(html);
  const features = featMatch
    ? featMatch[1]
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n))
    : [];

  const doc = parseHtml(html);
  let username =
    doc.querySelector('#userName, .username, [id*="adminName"]')?.textContent?.trim() || null;

  // footer.jsp renders "Powered by Tyfone Inc. v${buildVersion}"
  const versionMatch = /Powered by Tyfone Inc\.?[\s\S]{0,40}?v([\d][\w.]*)/i.exec(html);
  const buildVersion = versionMatch ? versionMatch[1] : null;

  // A rendered dashboard without a session would have redirected; if we got
  // markup that looks like the login page, treat as logged out.
  const loggedIn = !doc.getElementById('formlogin');

  // Try to fetch complete user info from /my_profile API if logged in
  let firstname: string | null = null;
  let lastname: string | null = null;
  let emailAddress: string | null = null;
  let mobileno: string | null = null;
  let roleName: string | null = null;
  let roleSlug: string | null = null;
  let enrollmentDate: string | null = null;
  let timezone: string | null = null;

  // Fetch profile data from /my_profile JSP page and extract from rendered HTML
  // JSP stores profile data (firstname, lastname, email, etc.) in session attributes
  // These are rendered into the JSP HTML template, so we parse them from there
  if (loggedIn) {
    try {
      const profileRes = await fetch(api('/my_profile'), { credentials: 'include' });
      if (profileRes.ok) {
        const profileHtml = await profileRes.text();
        const profileDoc = parseHtml(profileHtml);

        // Extract profile data from rendered form input values
        // JSP renders: <input id="firstName" value="${adminUser.firstname}" />
        firstname = inputValueOrNull(profileDoc, 'firstName');
        lastname = inputValueOrNull(profileDoc, 'lastName');
        emailAddress = inputValueOrNull(profileDoc, 'email');
        mobileno = inputValueOrNull(profileDoc, 'phoneNumber');
        roleName = inputValueOrNull(profileDoc, 'role');

        // Username might also be in an input field
        const usernameInput = inputValueOrNull(profileDoc, 'userName');
        if (usernameInput && !username) {
          username = usernameInput;
        }

        // Extract enrollment date and timezone from span element
        // JSP renders: <span id="enrollmentDateSpan">${myprofile.user.enrolmentDateString} ${timeZone}</span>
        // Format: "Jan 15, 2024 EST" or "Jan 5, 2016 at 08:26:07 AM PST"
        const spanText = textOfOrNull(profileDoc, 'enrollmentDateSpan');
        if (spanText) {
          // Split by last whitespace to separate date from timezone
          // Timezone is always the last token (3-4 uppercase letters)
          const parts = spanText.match(/^(.+)\s+([A-Z]{3,4})$/);
          if (parts) {
            enrollmentDate = parts[1].trim();
            timezone = parts[2];
          } else {
            // Fallback: if no timezone found, treat whole string as date
            enrollmentDate = spanText.trim();
          }
        }

        // Try alternate timezone sources if not found in enrollment span
        if (!timezone) {
          const tzElement = profileDoc.querySelector('[data-timezone], [id*="timezone"]');
          if (tzElement) {
            timezone = tzElement.textContent?.trim() || null;
          }
        }
      }
    } catch (err) {
      console.debug('Could not fetch profile page to extract user data', err);
    }
  }

  return {
    features,
    username,
    firstname,
    lastname,
    emailAddress,
    mobileno,
    roleName,
    roleSlug,
    enrollmentDate,
    timezone,
    buildVersion,
    loggedIn,
  };
}
