import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev proxy: every request under the backend context path is forwarded to the
 * real Spring backend. `changeOrigin: true` makes the proxy send the TARGET
 * host as the Host header — which is exactly what the backend's tenant
 * resolution (IPAddressFilter / BankIdInterceptor) keys on. To develop against
 * a different tenant, change VITE_BACKEND_TARGET in .env.
 *
 * The browser only ever talks to localhost:3000, so the backend's
 * SameSite=Strict JSESSIONID cookie works (cookieDomainRewrite maps the
 * cookie's domain to localhost).
 *
 * In production no proxy exists: the SPA is served from the same origin as
 * the backend (reverse proxy or dropped into the same Tomcat), and the
 * relative /adminconsole-ux/** URLs hit it directly.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const contextPath = env.VITE_CONTEXT_PATH || '/adminconsole-ux';
  const backendTarget = env.VITE_BACKEND_TARGET || 'http://staronedev.tyfone.com';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        [contextPath]: {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: 'localhost',
          // Session cookie may be scoped to the context path; keep it valid
          // for the whole dev origin so the SPA (served from /) sends it.
          cookiePathRewrite: '/'
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  };
});
