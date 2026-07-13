/**
 * Route guard — client mirror of SessionValidationInterceptor: a protected
 * route without an authenticated session goes to /login (or /session-timeout
 * when the session just expired).
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import * as sx from '../styles/sx';

export default function RequireAuth() {
  const { stage, sessionExpired } = useAuth();
  const location = useLocation();

  if (stage === 'unknown') {
    return (
      <Box className="boot-loader" sx={sx.bootLoader}>
        <Box className="spinner" sx={sx.spinner} aria-label="Loading" />
      </Box>
    );
  }
  if (stage !== 'authenticated') {
    return (
      <Navigate
        to={sessionExpired ? '/session-timeout' : '/login'}
        state={{ from: location }}
        replace
      />
    );
  }
  return <Outlet />;
}
