/**
 * Shared MUI `sx` style objects — a 1:1 port of the old styles/global.css.
 *
 * The login screens additionally load the ORIGINAL backend stylesheets
 * (/resources/customcss/login.min.css + /resources/<tenant>/css/bank_login.css),
 * which style .login-page / .login-wrapper / .form-control / .btn-primary and
 * carry the tenant brand color. The class names are therefore KEPT on every
 * element; these sx objects only replace the local fallback rules.
 *
 * <StyledEngineProvider injectFirst> (see main.tsx) injects every sx style at
 * the TOP of <head>, while the backend <link> stylesheets are appended at the
 * end — so on equal specificity the backend CSS keeps winning, exactly like
 * the old low-specificity CSS fallbacks did.
 *
 * All values are explicit px strings: bare numbers in sx shorthand keys
 * (padding/margin/gap/borderRadius) would be multiplied by the theme, which
 * would change the rendered output.
 */

/* ---------- boot loader ---------- */

export const bootLoader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
};

// `@keyframes spin` lives in the GlobalStyles block in main.tsx.
export const spinner = {
  width: '36px',
  height: '36px',
  border: '4px solid #d5d9df',
  borderTopColor: '#2c6aa0',
  borderRadius: '50%',
  animation: 'spin 0.9s linear infinite',
};

/* ---------- login (fallbacks; backend login.min.css/bank_login.css win) ---------- */

export const loginWrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '16px',
};

export const loginCard = {
  background: '#fff',
  width: '380px',
  maxWidth: '94vw',
  padding: '28px 30px',
  borderRadius: '4px',
  boxShadow: '0 2px 14px rgba(0, 0, 0, 0.18)',
  // was `.login-card h3` — nested selector keeps the same specificity
  '& h3': {
    margin: '8px 0 4px',
    fontWeight: 400,
    textAlign: 'center',
  },
};

export const logoImage = {
  // was `.logo-image img.image`
  '& img.image': {
    display: 'block',
    maxWidth: '100%',
  },
};

export const logoFallback = {
  textAlign: 'center',
  fontSize: '18px',
  padding: '12px 0',
  color: '#555',
};

export const hrclas = {
  // `hr&` compiles to `hr.<class>` — same specificity as the old `hr.hrclas`
  'hr&': {
    border: 0,
    borderTop: '1px solid #ddd',
    margin: '12px 0 18px',
  },
};

export const formGroup = {
  marginBottom: '14px',
  position: 'relative',
};

export const formControl = {
  display: 'block',
  width: '100%',
  padding: '8px 10px',
  fontSize: '13px',
  border: '1px solid #ccc',
  borderRadius: '3px',
  background: '#fff',
  '&:focus': {
    outline: 'none',
    borderColor: '#2c6aa0',
  },
};

// was `.password-group .firstTogglePassword` / `.password-group input` —
// applied on the .password-group wrapper so specificity matches the old rules.
export const passwordGroup = {
  '& .firstTogglePassword': {
    position: 'absolute',
    right: '10px',
    top: '8px',
    margin: 0,
    fontSize: '12px',
    color: '#2c6aa0',
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 1,
  },
  '& input': {
    paddingRight: '46px',
  },
};

export const btnspace = {
  marginTop: '18px',
  textAlign: 'center',
};

export const btn = {
  display: 'inline-block',
  padding: '8px 14px',
  fontSize: '13px',
  border: '1px solid transparent',
  borderRadius: '3px',
  cursor: 'pointer',
  background: '#e6e6e6',
  '&[disabled]': {
    opacity: 0.65,
    cursor: 'default',
  },
};

export const btnPrimary = {
  backgroundColor: '#2c6aa0', // overridden by tenant bank_login.css / bank.css
  borderColor: '#2c6aa0',
  color: '#fff',
};

// "btn btn-primary form-control" submit buttons — spread order mirrors the
// rule order in the old stylesheet so the same declarations win.
export const primarySubmitBtn = {
  ...formControl,
  ...btn,
  ...btnPrimary,
};

export const errorLabel = {
  // `label&` compiles to `label.<class>` — same specificity as `label.error`
  'label&': {
    display: 'block',
    color: '#c0392b',
    marginTop: '8px',
    fontSize: '12.5px',
  },
};

export const alertSuccessText = {
  color: '#2e7d32',
  textAlign: 'center',
};

export const otpInstructions = {
  textAlign: 'center',
  color: '#555',
  marginBottom: '14px',
};

export const resendLink = {
  color: '#2c6aa0',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '12.5px',
};

export const centeredText = {
  textAlign: 'center',
};

export const muted = {
  color: '#777',
};

/* ---------- dashboard placeholder ---------- */

export const dashboardShell = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const dashboardHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  background: '#fff',
  borderBottom: '1px solid #e2e5e9',
  padding: '8px 20px',
};

export const headerLogo = {
  height: '36px',
};

export const headerSpacer = {
  flex: 1,
};

export const headerUser = {
  color: '#555',
};

export const logoutBtn = {
  ...btn,
  ...btnPrimary,
  padding: '6px 14px', // `.logout-btn` came after `.btn`, so it won
};

export const dashboardMain = {
  flex: 1,
  padding: '40px',
  // was `.dashboard-main h2`
  '& h2': {
    fontWeight: 400,
  },
};

export const dashboardFooter = {
  textAlign: 'center',
  color: '#999',
  padding: '12px',
  fontSize: '12px',
};

/* ---------- authenticated shell: top navbar + sidebar (header.jsp / sidebar.jsp) ---------- */

export const shellRoot = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const topNavbar = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  minHeight: '70px', // header.jsp: min-height:70px
  background: '#fff',
  borderBottom: '1px solid #e2e5e9',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  padding: '0 22px',
};

export const hamburgerBtn = {
  border: 'none',
  background: '#fff',
  cursor: 'pointer',
  padding: '6px',
  display: 'inline-flex',
  alignItems: 'center',
};

export const navbarLogo = {
  height: '52px',
  maxWidth: '160px',
  objectFit: 'contain',
  cursor: 'pointer',
};

export const navbarCenter = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
};

export const navbarRight = {
  display: 'flex',
  alignItems: 'center',
  gap: '22px',
};

export const navIconBtn = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: '6px',
  display: 'inline-flex',
  alignItems: 'center',
  '& svg': { fontSize: '26px' },
};

export const navPopover = {
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 8px)',
  background: '#fff',
  border: '1px solid #dfe3e8',
  borderRadius: '4px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  padding: '12px 16px',
  minWidth: '220px',
  fontSize: '13px',
  color: '#444',
  zIndex: 60,
};

/* header search (#searchBar / #searchOptions) */

export const searchBarWrap = {
  position: 'relative',
  width: 'min(560px, 46vw)',
};

export const searchBarRow = {
  display: 'flex',
  alignItems: 'stretch',
};

export const searchInput = {
  flex: 1,
  minWidth: 0,
  border: '1px solid #cfd5dc',
  borderRight: 'none',
  borderRadius: '4px 0 0 4px',
  padding: '10px 14px',
  fontSize: '14px',
  '&:focus': { outline: 'none', borderColor: '#9fb0c4' },
};

export const nameSeparator = {
  width: '1px',
  background: '#cfd5dc',
};

export const searchButton = {
  border: 'none',
  borderRadius: '0 4px 4px 0',
  width: '86px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const searchOptionsPanel = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  background: '#fff',
  border: '1px solid #dfe3e8',
  borderRadius: '4px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.16)',
  padding: '12px 14px',
  zIndex: 60,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px 16px',
};

export const searchRadioItem = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12.5px',
  color: '#444',
  cursor: 'pointer',
  '& input': { cursor: 'pointer' },
};

export const searchHideBtn = {
  ...{
    display: 'inline-block',
    padding: '4px 12px',
    fontSize: '12px',
    border: '1px solid #c8ced6',
    borderRadius: '3px',
    cursor: 'pointer',
    background: '#eef1f4',
    color: '#444',
  },
  marginLeft: 'auto',
};

export const searchError = {
  width: '100%',
  background: '#fcf8e3',
  border: '1px solid #faebcc',
  color: '#8a6d3b',
  borderRadius: '3px',
  padding: '6px 10px',
  fontSize: '11px',
};

/* sidebar drawer */

export const shellBody = {
  display: 'flex',
  flex: 1,
  alignItems: 'stretch',
};

export const sidebar = {
  width: '300px',
  flexShrink: 0,
  background: '#fff',
  borderRight: '1px solid #e2e5e9',
  paddingTop: '10px',
};

export const sidebarList = {
  listStyle: 'none',
  margin: 0,
  padding: '0 10px',
};

export const sidebarItemLi = {
  marginBottom: '2px',
};

export const sidebarItem = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  textDecoration: 'none',
  userSelect: 'none',
  '&:hover': { background: '#f2f4f7' },
};

export const sidebarItemActive = {
  '&:hover': { filter: 'brightness(1.05)' },
};

export const sidebarItemInner = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
};

export const sidebarItemLabel = {
  fontSize: '15px',
};

export const sidebarSubList = {
  listStyle: 'none',
  margin: '2px 0 6px',
  padding: '0 0 0 44px',
};

export const sidebarSubItem = {
  display: 'block',
  padding: '8px 10px',
  fontSize: '13.5px',
  color: '#5f6b7a',
  borderRadius: '4px',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': { background: '#f2f4f7' },
};

export const shellMain = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '28px 32px 0',
};

/* ---------- modal ---------- */

export const modalBackdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

export const modalCard = {
  background: '#fff',
  borderRadius: '4px',
  padding: '20px 24px',
  width: '340px',
  maxWidth: '92vw',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
  // was `.modal-card h4`
  '& h4': {
    margin: '0 0 10px',
  },
};

export const modalActions = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '18px',
};
