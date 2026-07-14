/**
 * MFA OTP entry — port of WEB-INF/views/login/enter_otp.jsp +
 * enterOtpValidation.js. POST /enter_otp with the echoed hidden IDP fields;
 * resend via GET /enter_otp?resend=true. Same tenant branding as login.
 */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginLayout from '../layouts/LoginLayout';
import { useAuth } from '../context/AuthContext';
import * as sx from '../styles/sx';

export default function EnterOtpPage() {
  const { submitOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return setError('Please enter the one-time passcode.');
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      const result = await submitOtp(otp.trim());
      if (result.outcome === 'success') navigate('/dashboard', { replace: true });
      else setError(result.message ?? 'Invalid OTP. Please try again.');
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      await resendOtp();
      setInfo('A new one-time passcode has been sent.');
    } catch {
      setError('Could not resend the passcode. Please try again.');
    }
  };

  return (
    <LoginLayout
      showTitle={false}
      formProps={{ id: 'formloginsubmitotp', onSubmit: handleSubmit, noValidate: true }}
    >
      <Box component="p" className="otp-instructions" sx={sx.otpInstructions}>
        Enter the One-Time-Passcode sent to you.
      </Box>
      {info && (
        <Box component="p" className="alert-success-text" sx={sx.alertSuccessText}>
          {info}
        </Box>
      )}
      <Box className="form-group" sx={sx.formGroup}>
        <Box
          component="input"
          id="otpValue"
          type="text"
          inputMode="numeric"
          className="form-control"
          sx={sx.formControl}
          aria-label="Enter OTP"
          autoFocus
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Box>
      <Box sx={sx.otpResendRow}>
        <span>Did not receive OTP?</span>
        <Box
          component="a"
          id="resendOTPLink"
          className="resend-link"
          sx={sx.resendLink}
          onClick={handleResend}
          role="button"
        >
          Resend OTP
        </Box>
      </Box>
      <Box className="btnspace" sx={{ ...sx.btnspace }}>
        <div className="controls">
          <Box
            component="button"
            type="submit"
            className="btn btn-primary form-control anchorclick"
            sx={sx.primarySubmitBtn}
            disabled={submitting}
          >
            {submitting ? 'Verifying…' : 'Submit'}
          </Box>
        </div>
        {error && (
          <Box component="label" className="error" id="errorMessage" sx={sx.errorLabel}>
            {error}
          </Box>
        )}
      </Box>
    </LoginLayout>
  );
}
