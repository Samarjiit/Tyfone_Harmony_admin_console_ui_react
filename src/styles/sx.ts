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

// The backend login.min.css puts `padding: 80px 0 !important` on the
// .login-page body — the wrapper height compensates for those 160px so the
// card sits in the exact center of the VIEWPORT, not of an overflowing box.
export const loginWrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 160px)',
  padding: '0 16px',
};

export const loginCard = {
  background: '#fff',
  width: '452px',
  maxWidth: '94vw',
  padding: '36px 40px 40px',
  borderRadius: '8px',
  boxShadow: '0 2px 18px rgba(0, 0, 0, 0.12)',
  // "Admin Console" heading — JSP renders it left-aligned, large, muted gray
  '& h3': {
    margin: '18px 0 6px',
    fontWeight: 400,
    fontSize: '30px',
    color: '#44505c',
    textAlign: 'left',
  },
};

export const logoImage = {
  // logo renders centered at natural size (not stretched), like the JSP card
  '& img.image': {
    display: 'block',
    maxWidth: '280px',
    maxHeight: '115px',
    width: 'auto',
    margin: '0 auto',
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
  padding: '14px 16px',
  fontSize: '16px',
  color: '#3f4a56',
  border: '1px solid #d4dae0',
  borderRadius: '6px',
  background: '#fff',
  '&::placeholder': { color: '#8a97a3' },
  '&:focus': {
    outline: 'none',
    borderColor: '#7aa7d9',
    boxShadow: '0 0 0 3px rgba(60, 120, 200, 0.18)',
  },
};

// "Show" toggle sits INSIDE the password field, right side, bold dark text —
// matching the JSP rendering of show_hide_password.css.
export const passwordGroup = {
  '& .firstTogglePassword': {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#212529',
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 1,
  },
  '& input': {
    paddingRight: '64px',
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
// Sized to the JSP login button: tall, 6px radius, 18px white text.
export const primarySubmitBtn = {
  ...formControl,
  ...btn,
  ...btnPrimary,
  padding: '13px 16px',
  fontSize: '18px',
  fontWeight: 500,
  borderRadius: '6px',
  backgroundColor: '#22457f',
  borderColor: '#22457f',
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

// OTP page (enter_otp.jsp): left-aligned instruction, "Did not receive OTP?"
// row with the Resend link beside it.
export const otpInstructions = {
  textAlign: 'left',
  color: '#3f4a56',
  fontSize: '16px',
  lineHeight: 1.45,
  margin: '6px 0 16px',
};

export const otpResendRow = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
  margin: '14px 0 18px',
  fontSize: '16px',
  color: '#3f4a56',
};

export const resendLink = {
  color: '#2c6aa0',
  cursor: 'pointer',
  textDecoration: 'none',
  fontSize: '13px',
  '&:hover': { textDecoration: 'underline' },
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

/**
 * Drawer animates open/closed by width (0 <-> 300px), like the JSP sidebar
 * collapse. Outer box owns the animation + its own scrollbar (sticky under
 * the 70px navbar, so every menu item is reachable regardless of page
 * height); inner box keeps a fixed width so labels don't reflow mid-slide.
 */
export const sidebarOuter = {
  flexShrink: 0,
  position: 'sticky',
  top: '70px',
  height: 'calc(100vh - 70px)',
  background: '#fff',
  overflowX: 'hidden',
  overflowY: 'auto',
  transition: 'width 0.3s ease',
  whiteSpace: 'nowrap',
  // scrollable but with the scrollbar itself hidden, like the JSP sidebar
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // legacy Edge/IE
  '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari/new Edge
};

export const sidebarInner = {
  width: '300px',
  paddingTop: '10px',
  paddingBottom: '48px',
  borderRight: '1px solid #e2e5e9',
  minHeight: '100%',
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

/* ---------- logged-out page (logout.jsp) ---------- */

export const logoutHeaderBand = {
  background: '#fff',
  padding: '12px 28px',
  '& img': { height: '64px', width: 'auto' },
};

export const logoutBody = {
  minHeight: 'calc(100vh - 88px)',
  background: '#f5f6f8',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

export const logoutMessage = {
  borderTop: '1px solid #d9dde2',
  borderBottom: '1px solid #d9dde2',
  textAlign: 'center',
  padding: '34px 16px',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '24px',
  fontWeight: 700,
  color: '#1d1d1d',
};

export const logoutLoginLink = {
  display: 'block',
  textAlign: 'center',
  marginTop: '38px',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '25px',
  color: '#2a5db0',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
};

/* ---------- dashboard footer bar (footer.jsp) ---------- */

export const footerBar = {
  background: '#5d6d7e',
  color: 'rgba(255,255,255,0.92)',
  textAlign: 'center',
  padding: '15px 12px',
  fontSize: '15px',
  '& span': { margin: '0 10px' },
};

/* ---------- modal (footer.jsp #logoutModal: top-positioned, wide, no title) ---------- */

export const modalBackdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '110px',
  zIndex: 100,
};

export const modalCard = {
  background: '#fff',
  borderRadius: '6px',
  padding: '20px 24px 16px',
  width: '740px',
  maxWidth: '92vw',
  boxShadow: '0 6px 28px rgba(0, 0, 0, 0.3)',
  fontSize: '15.5px',
  color: '#333',
  '& p': { margin: '0 0 4px' },
};

// Bootstrap .modal-footer look: separator line above the buttons.
export const modalActions = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '16px',
  paddingTop: '14px',
  borderTop: '1px solid #dee2e6',
};

export const modalCancelBtn = {
  padding: '9px 24px',
  fontSize: '15px',
  borderRadius: '6px',
  cursor: 'pointer',
  background: '#fff',
  border: '1px solid #2b5ca8',
  color: '#2b5ca8',
  '&[disabled]': { opacity: 0.65, cursor: 'default' },
};

export const modalOkBtn = {
  padding: '9px 28px',
  fontSize: '15px',
  borderRadius: '6px',
  cursor: 'pointer',
  background: '#22457f',
  border: '1px solid #22457f',
  color: '#fff',
  '&[disabled]': { opacity: 0.65, cursor: 'default' },
};
