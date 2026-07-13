/**
 * Session expired — port of session-timeout.jsp. Hitting the backend
 * GET /session-timeout also invalidates the server session (JSP parity).
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginLayout from '../layouts/LoginLayout';
import { touchSessionTimeout } from '../services/auth.service';
import * as sx from '../styles/sx';

export default function SessionTimeoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void touchSessionTimeout();
  }, []);

  return (
    <LoginLayout>
      <Box component="h4" className="centered-text" sx={sx.centeredText}>
        Your session has expired
      </Box>
      <Box component="p" className="centered-text muted" sx={{ ...sx.centeredText, ...sx.muted }}>
        For your security you have been signed out due to inactivity.
      </Box>
      <Box className="btnspace" sx={sx.btnspace}>
        <Box
          component="button"
          type="button"
          className="btn btn-primary form-control anchorclick"
          sx={sx.primarySubmitBtn}
          onClick={() => navigate('/login')}
        >
          Return to Login
        </Box>
      </Box>
    </LoginLayout>
  );
}
