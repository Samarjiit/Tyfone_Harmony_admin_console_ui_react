/**
 * Login — port of WEB-INF/views/login/login.jsp + loginvalidation.js.
 *
 * Same behavior: username/password required, username trimmed, Show/Hide
 * password text toggle above the password field, submit button disabled while
 * submitting, error labels under the button. Same class names as the JSP so
 * customcss/login.min.css + tenant bank_login.css style it identically.
 */
import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginLayout from '../layouts/LoginLayout';
import { useAuth } from '../context/AuthContext';
import * as sx from '../styles/sx';

interface LocationState {
  from?: { pathname: string };
  message?: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // loginvalidation.js rules
    if (!username.trim()) return setFieldError('Username cannot be blank');
    if (!password) return setFieldError('Password cannot be blank');
    setFieldError(null);
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(username, password);
      if (result.outcome === 'success') {
        navigate(state.from?.pathname ?? '/dashboard', { replace: true });
      } else if (result.outcome === 'otp_required') {
        navigate('/enter_otp');
      } else if (result.outcome === 'password_expired') {
        setError('Your password has expired. Please reset it in the existing console.');
      } else {
        setError(result.message ?? 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginLayout
      formProps={{ id: 'formlogin', onSubmit: handleSubmit, autoComplete: 'off', noValidate: true }}
    >
      {state.message && (
        <Box component="p" className="alert-success-text" sx={sx.alertSuccessText}>
          {state.message}
        </Box>
      )}
      <Box className="form-group" sx={sx.formGroup}>
        <Box
          component="input"
          id="username"
          type="text"
          className="form-control"
          sx={sx.formControl}
          placeholder="Username"
          title="Username"
          aria-label="Enter UserName"
          autoComplete="off"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Box>
      <Box className="form-group password-group" sx={{ ...sx.formGroup, ...sx.passwordGroup }}>
        <p
          id="showhidePassword"
          className="firstTogglePassword"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </p>
        <Box
          component="input"
          id="password"
          type={showPassword ? 'text' : 'password'}
          className="form-control"
          sx={sx.formControl}
          placeholder="Password"
          title="Password"
          aria-label="Enter Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box className="btnspace" sx={sx.btnspace}>
        <div className="controls">
          <Box
            component="button"
            type="submit"
            id="loginButtonTag"
            title="SignIn"
            className="btn btn-primary form-control anchorclick"
            sx={sx.primarySubmitBtn}
            disabled={submitting}
          >
            {submitting ? 'Signing In…' : 'Sign In'}
          </Box>
        </div>
        <br />
        {fieldError && (
          <Box component="label" className="error" id="errorMessage" sx={sx.errorLabel}>
            {fieldError}
          </Box>
        )}
        {error && (
          <Box component="label" className="error" id="loginErrorMessage" sx={sx.errorLabel}>
            {error}
          </Box>
        )}
      </Box>
    </LoginLayout>
  );
}
