/**
 * Logged-out landing — port of login/logout.jsp:
 * white band with the tenant header logo top-left, gray page body, serif
 * "You have logged out successfully." between horizontal rules, and a serif
 * "Click here to login again" link. (Design matches the JSP page; navigation
 * uses the SPA route instead of a full reload.)
 */
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTenant } from '../context/TenantContext';
import { TENANT_ASSETS } from '../utils/tenant';
import * as sx from '../styles/sx';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { tenant, asset } = useTenant();

  return (
    <Box>
      <Box sx={sx.logoutHeaderBand}>
        {tenant && (
          <img src={asset(TENANT_ASSETS.headerLogo)} alt={tenant.bankName || 'Bank logo'} />
        )}
      </Box>
      <Box sx={sx.logoutBody}>
        <Box sx={sx.logoutMessage}>You have logged out successfully.</Box>
        <Box
          component="a"
          role="button"
          tabIndex={0}
          sx={sx.logoutLoginLink}
          onClick={() => navigate('/login')}
        >
          Click here to login again
        </Box>
      </Box>
    </Box>
  );
}
