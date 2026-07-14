/**
 * TypeScript mirrors of the backend wire formats (this iteration: auth +
 * tenant). Sources: com.tyfone.adminconsole.model.*, CSRFValidationFilter,
 * GlobalExceptionController, login/enter_otp JSPs.
 */

/** Generic JSON envelope returned by @ResponseBody endpoints. */
export interface ApiEnvelope<T = unknown> {
  code?: string;
  status?: string;
  message?: string;
  aaData?: T[];
  sEcho?: string;
  iTotalRecords?: number;
  iTotalDisplayRecords?: number;
  [key: string]: unknown;
}

export const API_SUCCESS = '0';
export const API_SESSION_EXPIRED = '1000';
/** GlobalExceptionController's code for expired sessions on XHR callers */
export const AJAX_SESSION_EXPIRED = '8000';

export function envelopeCode(env: ApiEnvelope): string | undefined {
  return env.code ?? env.status;
}

/** com.tyfone.adminconsole.model.LoginModel — POST /login form fields. */
export interface LoginForm {
  username: string;
  password: string;
  submitUri?: string;
  jUsername?: string;
  jPassword?: string;
  display?: string;
  submit?: string;
  clientsTimezone?: string;
}

/** One entry in public/tenants.json (generated from Spring properties). */
export interface TenantMapEntry {
  bankId: string;
  resourceId: string;
}

export interface TenantMapFile {
  generatedFrom: string;
  bankIdToFolder: Record<string, string>;
  hosts: Record<string, TenantMapEntry>;
}

export interface TenantInfo {
  hostname: string;
  bankId: string;
  /** mirrors session attribute `resourceID` — the resources folder name */
  resourceId: string;
  /** display name from /bank_id `message` (BankID enum name) */
  bankName: string;
}

export type AuthStage =
  | 'unknown'          // app booting, session not yet probed
  | 'anonymous'        // no valid session
  | 'otp_required'     // credentials accepted, MFA OTP pending
  | 'password_expired' // admin must reset password
  | 'authenticated';   // full session established

export interface AuthUser {
  username: string;
  firstname: string;
  lastname: string;
  emailAddress: string;
  mobileno: string;
  roleName: string;
  roleSlug: string;
  features: number[];
  enrollmentDate?: string;
  timezone?: string;
}
