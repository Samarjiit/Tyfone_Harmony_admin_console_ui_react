/**
 * Placeholder page for modules whose screens are not migrated yet.
 * Renders "This is <Module> module" inside the dashboard shell; the actual
 * pages arrive in later iterations without touching the shell or auth flow.
 */
import { Box } from '@mui/material';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as sx from '../styles/sx';

export default function ModulePage({ title }: { title: string }) {
  const location = useLocation();
  const [params] = useSearchParams();
  const searchBy = params.get('searchBy');
  const q = params.get('q') ?? [params.get('firstName'), params.get('lastName')]
    .filter(Boolean)
    .join(' ');

  return (
    <Box sx={{ ...sx.dashboardMain, padding: '12px 8px' }}>
      <h2>This is {title} module</h2>
      <Box component="p" sx={sx.muted}>
        Screen implementation coming in a later iteration ({location.pathname}).
      </Box>
      {searchBy && (
        <Box component="p" sx={sx.muted}>
          Received search request — criteria: <strong>{searchBy}</strong>, value:{' '}
          <strong>{q || '(empty)'}</strong>. Results will render here once the Member Search
          screen is migrated.
        </Box>
      )}
    </Box>
  );
}
