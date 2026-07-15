/**
 * Root routing — React routes mirror the Spring MVC URLs 1:1 so bookmarks
 * and server redirects keep working. Public routes match the backend's
 * SessionValidationInterceptor exclusion list.
 *
 * All protected routes render inside DashboardLayout (top navbar + drawer).
 * Module routes come straight from the sidebar spec (utils/navigation.ts) and
 * show placeholder pages until each screen is migrated.
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import EnterOtpPage from './pages/EnterOtpPage';
import LogoutPage from './pages/LogoutPage';
import SessionTimeoutPage from './pages/SessionTimeoutPage';
import DashboardPage from './pages/DashboardPage';
import EditMyProfilePage from './pages/EditMyProfilePage';
import ModulePage from './pages/ModulePage';
import { NAV_SECTIONS } from './utils/navigation';

/** route -> module title, generated from the sidebar spec (deduplicated). */
function moduleRoutes(): Array<{ route: string; title: string }> {
  const seen = new Set<string>(['/dashboard']);
  const out: Array<{ route: string; title: string }> = [];
  for (const section of NAV_SECTIONS) {
    if (section.route && !seen.has(section.route)) {
      seen.add(section.route);
      out.push({ route: section.route, title: section.label });
    }
    for (const child of section.children ?? []) {
      if (!seen.has(child.route)) {
        seen.add(child.route);
        out.push({ route: child.route, title: `${section.label} › ${child.label}` });
      }
    }
  }
  return out;
}

export default function App() {
  return (
    <Routes>
      {/* Public (backend interceptor exclusion list) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/enter_otp" element={<EnterOtpPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/session-timeout" element={<SessionTimeoutPage />} />

      {/* Protected — dashboard shell wraps every module */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {moduleRoutes().map(({ route, title }) => (
            <Route key={route} path={route} element={route === '/my_profile' ? <EditMyProfilePage /> : <ModulePage title={title} />} />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
