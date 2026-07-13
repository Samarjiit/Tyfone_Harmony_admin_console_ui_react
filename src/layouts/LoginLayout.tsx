/**
 * Login shell — same structure and class names as login.jsp so the ORIGINAL
 * stylesheets style it:
 *   <body class="login-page">
 *     <div class="login-wrapper">
 *       <form class="container-fluid"> logo / h3 / hr / fields ...
 *
 * Stylesheets injected (exactly what login.jsp links):
 *   /resources/customcss/login.min.css                    (shared layout)
 *   /resources/<tenant>/css/bank_login.css                (tenant colors)
 * plus our own MUI `sx` fallback styles for when the backend is down
 * (injected first, so the backend CSS above always wins — see styles/sx.ts).
 */
import { useEffect, type FormEvent, type FormHTMLAttributes, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { useTenant } from '../context/TenantContext';
import { TENANT_ASSETS, tenantResourceUrl, sharedResourceUrl } from '../utils/tenant';
import * as sx from '../styles/sx';

function injectOnce(href: string, id: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

interface LoginLayoutProps {
  children: ReactNode;
  /**
   * Attributes for the card <form>. In login.jsp the form IS the card —
   * `.login-wrapper form` in customcss/login.min.css gives it the white
   * background, width and shadow — so the card must be a single <form>
   * (nesting a second form inside it renders as a doubled card).
   */
  formProps?: FormHTMLAttributes<HTMLFormElement>;
}

export default function LoginLayout({ children, formProps }: LoginLayoutProps) {
  const { tenant, asset, loading, error } = useTenant();

  useEffect(() => {
    document.body.classList.add('login-page');
    injectOnce(sharedResourceUrl('customcss/login.min.css'), 'shared-login-css');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  useEffect(() => {
    if (tenant) injectOnce(tenantResourceUrl(tenant, TENANT_ASSETS.loginCss), 'tenant-login-css');
  }, [tenant]);

  if (loading) {
    return (
      <Box className="boot-loader" sx={sx.bootLoader}>
        <Box className="spinner" sx={sx.spinner} aria-label="Loading tenant" />
      </Box>
    );
  }

  return (
    <Box className="login-wrapper" sx={sx.loginWrapper}>
      <Box
        component="form"
        className="login-card container-fluid"
        sx={sx.loginCard}
        onSubmit={(e: FormEvent) => e.preventDefault()}
        {...formProps}
      >
        <div className="row">
          <Box className="col-md-12 logo-image" sx={sx.logoImage}>
            {tenant ? (
              <img
                className="image"
                src={asset(TENANT_ASSETS.loginLogo)}
                width="100%"
                alt={tenant.bankName || 'Bank logo'}
              />
            ) : (
              <Box className="logo-fallback" sx={sx.logoFallback}>{error ?? 'Admin Console'}</Box>
            )}
          </Box>
          <div className="col-md-12">
            <h3 className="line-height-4px">Admin Console</h3>
          </div>
        </div>
        <Box component="hr" className="hrclas" sx={sx.hrclas} />
        {children}
      </Box>
    </Box>
  );
}
