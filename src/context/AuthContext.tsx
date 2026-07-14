/**
 * Authentication context.
 *
 * State machine mirrors the JSP flow:
 *   unknown -> (probe /dashboard) -> authenticated | anonymous
 *   anonymous -> login() -> authenticated | otp_required | password_expired | anonymous
 *   otp_required -> submitOtp() -> authenticated | otp_required
 *
 * Session expiry is signaled globally by the http layer (SESSION_EXPIRED_EVENT,
 * fired on HTTP 402 / envelope code 1000 / 8000) — the same conditions that
 * send the JSP app to /session-timeout.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import * as authService from '../services/auth.service';
import { SESSION_EXPIRED_EVENT } from '../services/http';
import type { AuthStage, AuthUser } from '../types/models';

interface AuthContextValue {
  stage: AuthStage;
  user: AuthUser | null;
  features: number[];
  /** backend build version from footer.jsp (e.g. "1.2"), for footer parity */
  buildVersion: string | null;
  sessionExpired: boolean;
  login: (username: string, password: string) => Promise<authService.LoginResult>;
  submitOtp: (otp: string) => Promise<authService.LoginResult>;
  resendOtp: () => Promise<void>;
  logout: () => Promise<void>;
  hasFeature: (id: number | null) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<AuthStage>('unknown');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [features, setFeatures] = useState<number[]>([]);
  const [buildVersion, setBuildVersion] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const loadSessionContext = useCallback(async (): Promise<boolean> => {
    const ctx = await authService.probeSession();
    if (ctx.loggedIn) {
      setUser({
        username: ctx.username ?? '',
        firstname: ctx.firstname ?? '',
        lastname: ctx.lastname ?? '',
        emailAddress: ctx.emailAddress ?? '',
        mobileno: ctx.mobileno ?? '',
        roleName: ctx.roleName ?? '',
        roleSlug: ctx.roleSlug ?? '',
        features: ctx.features,
        enrollmentDate: ctx.enrollmentDate,
        timezone: ctx.timezone,
      });
      setFeatures(ctx.features);
      setBuildVersion(ctx.buildVersion);
      setStage('authenticated');
      return true;
    }
    setStage('anonymous');
    return false;
  }, []);

  // Boot: probe the existing session (JSESSIONID cookie may still be valid).
  useEffect(() => {
    void loadSessionContext().catch(() => setStage('anonymous'));
  }, [loadSessionContext]);

  // Global session-expiry signal from the http layer.
  useEffect(() => {
    const onExpired = () => {
      setSessionExpired(true);
      setStage('anonymous');
      setUser(null);
      setFeatures([]);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setSessionExpired(false);
      const result = await authService.login(username, password);
      if (result.outcome === 'success') await loadSessionContext();
      else if (result.outcome === 'otp_required') setStage('otp_required');
      else if (result.outcome === 'password_expired') setStage('password_expired');
      return result;
    },
    [loadSessionContext]
  );

  const submitOtp = useCallback(
    async (otp: string) => {
      const result = await authService.submitOtp(otp);
      if (result.outcome === 'success') await loadSessionContext();
      return result;
    },
    [loadSessionContext]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setFeatures([]);
    setStage('anonymous');
  }, []);

  const value: AuthContextValue = {
    stage,
    user,
    features,
    buildVersion,
    sessionExpired,
    login,
    submitOtp,
    resendOtp: authService.resendOtp,
    logout,
    hasFeature: (id) => id === null || features.includes(id)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
