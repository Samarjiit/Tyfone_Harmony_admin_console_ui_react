/**
 * Dashboard (Home) content — placeholder for this iteration; renders inside
 * DashboardLayout which owns the top navbar, drawer, footer and logout.
 * Full dashboard (login/enrollment trend charts) comes in a later iteration.
 */
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import * as sx from '../styles/sx';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();

  return (
    <Box sx={{ ...sx.dashboardMain, padding: '12px 8px' }}>
      <h2>Welcome to Dashboard</h2>
      <p>
        You are signed in{tenant?.bankName ? ` to ${tenant.bankName}` : ''}
        {user?.username ? ` as ${user.username}` : ''}.
      </p>
      {user && user.features.length > 0 && (
        <Box component="p" sx={sx.muted}>
          {user.features.length} features enabled for your role.
        </Box>
      )}
    </Box>
  );
}
