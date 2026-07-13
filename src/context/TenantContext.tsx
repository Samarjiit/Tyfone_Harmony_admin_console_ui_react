/**
 * Tenant context — replicates what BankIdInterceptor/IPAddressFilter give the
 * JSPs: the resolved tenant folder (`resourceID`) and its branding assets.
 *
 * On mount it resolves the tenant (GET /bank_id, tenants.json fallback), then
 * swaps the favicon to the tenant's and exposes an asset() URL builder.
 * Page-specific stylesheets (bank_login.css vs bank.css) are injected by the
 * layouts, matching which CSS each JSP links.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import { resolveTenant, tenantResourceUrl, TENANT_ASSETS } from '../utils/tenant';
import type { TenantInfo } from '../types/models';

interface TenantContextValue {
  tenant: TenantInfo | null;
  loading: boolean;
  error: string | null;
  /** URL builder for tenant assets, e.g. asset('img/BANKlogo-New.png') */
  asset: (relativePath: string) => string;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

function setFavicon(href: string): void {
  let link = document.querySelector<HTMLLinkElement>(
    'link[rel="shortcut icon"], link[rel="icon"]'
  );
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolveTenant()
      .then((t) => {
        if (cancelled) return;
        setTenant(t);
        setFavicon(tenantResourceUrl(t, TENANT_ASSETS.favicon));
        document.title = 'Admin Console';
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value: TenantContextValue = {
    tenant,
    loading,
    error,
    asset: (relativePath: string) => (tenant ? tenantResourceUrl(tenant, relativePath) : '')
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}
