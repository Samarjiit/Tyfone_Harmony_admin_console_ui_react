/**
 * Logout landing — port of login/logout.jsp.
 */
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginLayout from '../layouts/LoginLayout';
import * as sx from '../styles/sx';

export default function LogoutPage() {
  const navigate = useNavigate();
  return (
    <LoginLayout>
      <Box component="h4" className="centered-text" sx={sx.centeredText}>
        You have been logged out
      </Box>
      <Box component="p" className="centered-text muted" sx={{ ...sx.centeredText, ...sx.muted }}>
        Thank you for using the Admin Console.
      </Box>
      <Box className="btnspace" sx={sx.btnspace}>
        <Box
          component="button"
          type="button"
          className="btn btn-primary form-control anchorclick"
          sx={sx.primarySubmitBtn}
          onClick={() => navigate('/login')}
        >
          Sign In Again
        </Box>
      </Box>
    </LoginLayout>
  );
}
