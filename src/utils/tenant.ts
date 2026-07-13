/**
 * Tenant resolution — client-side mirror of the server chain implemented in
 * IPAddressFilter / BankIdInterceptor:
 *
 *   Host header -> config.properties -> numeric bankId
 *   bankId      -> bankid_hash_en.properties -> resource folder
 *   session resourceID = folder -> JSPs link /resources/${resourceID}/...
 *
 * Primary source: GET /bank_id — an existing unauthenticated backend endpoint
 * (LogoutController.getBankId) returning { code: <resource folder>,
 * message: <bank enum name> } for the request's Host header. The JSP app
 * itself uses it on session-timeout/permission-denied pages.
 *
 * Fallback: /tenants.json generated at build time from the same Spring
 * properties files (scripts/generate-tenants.mjs).
 *
 * NOTE (dev): the Vite proxy forwards /adminconsole-ux/** with the Host
 * header of VITE_BACKEND_TARGET, so /bank_id answers for THAT tenant — i.e.
 * the tenant you develop against is chosen by the proxy target, exactly as
 * the domain chooses it in production.
 */
import { api } from '../services/basePath';
import type { TenantInfo, TenantMapFile } from '../types/models';

/** Per-tenant asset paths (fixed layout cloned from resources/chR4). */
export const TENANT_ASSETS = {
  loginLogo: 'img/BANK-LogoLoginPage.png',
  headerLogo: 'img/BANKlogo-New.png',
  favicon: 'img/favicon.ico',
  loginCss: 'css/bank_login.css',
  appCss: 'css/bank.css'
} as const;

export function tenantResourceUrl(tenant: TenantInfo, relativePath: string): string {
  return api(`/resources/${tenant.resourceId}/${relativePath.replace(/^\//, '')}`);
}

/** Shared (tenant-agnostic) resource, e.g. customcss/login.min.css */
export function sharedResourceUrl(relativePath: string): string {
  return api(`/resources/${relativePath.replace(/^\//, '')}`);
}

interface BankIdResponse {
  code?: string;
  message?: string;
}

async function resolveViaBankIdEndpoint(): Promise<TenantInfo | null> {
  try {
    const res = await fetch(api('/bank_id'), {
      headers: { Accept: 'application/json' },
      credentials: 'include'
    });
    if (!res.ok) return null;
    const body = (await res.json()) as BankIdResponse;
    if (!body.code) return null;
    return {
      hostname: window.location.hostname,
      bankId: '',
      resourceId: body.code,
      bankName: body.message ?? ''
    };
  } catch {
    return null;
  }
}

async function resolveViaTenantsJson(): Promise<TenantInfo | null> {
  try {
    const res = await fetch('/tenants.json');
    if (!res.ok) return null;
    const map = (await res.json()) as TenantMapFile;
    const entry = map.hosts[window.location.hostname.toLowerCase()];
    if (!entry) return null;
    return {
      hostname: window.location.hostname,
      bankId: entry.bankId,
      resourceId: entry.resourceId,
      bankName: ''
    };
  } catch {
    return null;
  }
}

/**
 * Resolve the current tenant: backend first (exact server behavior), static
 * map as fallback.
 */
export async function resolveTenant(): Promise<TenantInfo> {
  const fromBackend = await resolveViaBankIdEndpoint();
  if (fromBackend) return fromBackend;
  const fromMap = await resolveViaTenantsJson();
  if (fromMap) return fromMap;
  throw new Error(
    `Unable to resolve the tenant. The backend (/bank_id) is unreachable and hostname ` +
      `"${window.location.hostname}" is not in tenants.json.`
  );
}
