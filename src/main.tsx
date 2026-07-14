import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles, StyledEngineProvider } from '@mui/material';
import App from './App';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import { uiColors } from './constants/colors';

/**
 * injectFirst puts all MUI/emotion styles at the TOP of <head>, so the
 * backend tenant stylesheets that LoginLayout appends at the end of <head>
 * keep overriding them — same cascade as the old low-specificity global.css.
 *
 * GlobalStyles carries the only rules that can't live on a component:
 * document-level element selectors and the spinner keyframes.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <GlobalStyles
        styles={{
          '*': { boxSizing: 'border-box' },
          'html, body, #root': { height: '100%', margin: 0 },
          body: {
            fontFamily: "'Open Sans', Helvetica, Arial, sans-serif",
            fontSize: '13px',
            backgroundColor: uiColors.background.page,
            color: uiColors.text.primary,
          },
          '@keyframes spin': {
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />
      <TenantProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </TenantProvider>
    </StyledEngineProvider>
  </StrictMode>
);
