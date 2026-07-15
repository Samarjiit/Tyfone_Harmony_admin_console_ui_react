/**
 * Authenticated shell — port of the JSP composition:
 *   header/header.jsp   top navbar: hamburger, tenant logo (click -> dashboard),
 *                       global member search, contact / profile / logout icons
 *   others/sidebar.jsp  collapsible left drawer, feature-id-gated items,
 *                       expandable submenus with angle-right arrows
 *   header/footer.jsp   "Powered by Tyfone Inc." + logout confirm modal
 *
 * Tenant branding: injects /resources/<tenant>/css/bank.css (what every
 * authenticated JSP links) and probes the tenant brand color from it for the
 * active-item highlight / icons — so Diamond renders Diamond blue, StarOne
 * renders StarOne's color, with zero per-tenant code.
 *
 * DO NOT put auth or tenant logic here — AuthContext/TenantContext own it.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TableChartIcon from '@mui/icons-material/TableChart';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { TENANT_ASSETS, tenantResourceUrl } from '../utils/tenant';
import { NAV_SECTIONS, isVisible, type NavSection } from '../utils/navigation';
import HeaderSearch from '../components/HeaderSearch';
import * as sx from '../styles/sx';
import { uiColors } from '../constants/colors';

const DEFAULT_BRAND = uiColors.sidebar.brand;

function injectOnce(href: string, id: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/** Read the tenant brand color from the injected bank.css (.btn-primary bg). */
function probeBrandColor(): string | null {
  const probe = document.createElement('button');
  probe.className = 'btn btn-primary';
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).backgroundColor;
  document.body.removeChild(probe);
  return color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent' ? color : null;
}

const SECTION_ICONS: Record<NavSection['icon'], (color: string) => ReactNode> = {
  home: (c) => <HomeIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  users: (c) => <GroupsIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  'th-list': (c) => <ListAltIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  table: (c) => <TableChartIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  'pencil-square': (c) => <EditNoteIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  list: (c) => <FormatListBulletedIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  desktop: (c) => <DesktopWindowsIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  user: (c) => <PersonIcon sx={{ fontSize: 20 }} htmlColor={c} />,
  question: (c) => <HelpOutlineIcon sx={{ fontSize: 20 }} htmlColor={c} />
};

export default function DashboardLayout() {
  const { user, features, buildVersion, logout } = useAuth();
  const { tenant, asset } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState<string>(DEFAULT_BRAND);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Tenant app stylesheet (bank.css) + brand color probe.
  useEffect(() => {
    if (!tenant) return;
    injectOnce(tenantResourceUrl(tenant, TENANT_ASSETS.appCss), 'tenant-bank-css');
    const t = window.setTimeout(() => {
      const c = probeBrandColor();
      if (c) setBrandColor(c);
    }, 350);
    return () => window.clearTimeout(t);
  }, [tenant]);

  // Keep the section owning the current route expanded (JSP sidebar.js does
  // the same via localStorage view_name) so its highlight survives reloads
  // and deep links.
  useEffect(() => {
    const owner = NAV_SECTIONS.find((s) =>
      s.children?.some((c) => c.route === location.pathname)
    );
    // Navigating to a direct route (e.g. Home) collapses any expanded group,
    // so exactly one sidebar item carries the highlight at a time.
    setOpenSection(owner ? owner.id : null);
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate('/logout', { replace: true });
    }
  };

  const goTo = (section: NavSection) => {
    if (!section.route) return;
    if (section.newTab) window.open(section.route, '_blank');
    else navigate(section.route);
  };

  return (
    <Box sx={sx.shellRoot}>
      {/* ================= Top navbar (header.jsp #navbar) ================= */}
      <Box component="header" id="navbar" sx={sx.topNavbar}>
        <Box
          component="button"
          id="header_collapse_btn"
          type="button"
          title="Toggle menu"
          sx={sx.hamburgerBtn}
          onClick={() => setDrawerOpen((o) => !o)}
        >
          {tenant ? (
            <Box
              component="img"
              src={asset('img/hamburger.svg')}
              alt="menu"
              sx={{ width: '26px', height: '26px' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                // tenant folder without hamburger.svg -> fall back to icon
                e.currentTarget.style.display = 'none';
                const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (sib) sib.style.display = 'inline-flex';
              }}
            />
          ) : null}
          <Box component="span" sx={{ display: tenant ? 'none' : 'inline-flex' }}>
            <MenuIcon htmlColor={brandColor} />
          </Box>
        </Box>

        <Box id="CULogoDiv">
          {tenant && (
            <Box
              component="img"
              id="bankLogo"
              className="logo anchor_click"
              title="Bank Logo"
              src={asset(TENANT_ASSETS.headerLogo)}
              alt={tenant.bankName || 'Bank logo'}
              sx={sx.navbarLogo}
              onClick={() => navigate('/dashboard')}
            />
          )}
        </Box>

        <Box sx={sx.navbarCenter}>
          <HeaderSearch brandColor={brandColor} />
        </Box>

        {/* Right icon cluster (contact / profile / logout) */}
        <Box id="navbarAreaRight" sx={sx.navbarRight}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="button"
              type="button"
              title="Contact"
              sx={sx.navIconBtn}
              onClick={() => {
                setContactOpen((o) => !o);
                setProfileOpen(false);
              }}
            >
              <PhoneIcon htmlColor={brandColor} />
            </Box>
            {contactOpen && (
              <Box sx={sx.navPopover}>
                <strong>Contact Us</strong>
                <Box component="p" sx={{ margin: '6px 0 0' }}>
                  Contact information is provided by your institution.
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box
              component="button"
              type="button"
              id="profileButton"
              title="Logged In"
              sx={sx.navIconBtn}
              onClick={() => {
                setProfileOpen((o) => !o);
                setContactOpen(false);
              }}
            >
              <PersonIcon htmlColor={brandColor} />
            </Box>
            {profileOpen && (
              <Box id="profileInformation" sx={sx.navPopover}>
                Logged in as{' '}
                <Box component="strong" sx={{ color: brandColor, whiteSpace: 'nowrap' }}>
                  {user?.username || 'Administrator'}
                </Box>
              </Box>
            )}
          </Box>

          <Box
            component="button"
            type="button"
            id="logoutbutton"
            title="Logout"
            sx={sx.navIconBtn}
            onClick={() => setLogoutConfirm(true)}
          >
            <LogoutIcon htmlColor={brandColor} />
          </Box>
        </Box>
      </Box>

      {/* ================= Body: drawer + content ================= */}
      <Box sx={sx.shellBody}>
        {/* Sidebar (others/sidebar.jsp) — width animates 300px <-> 0 like the
            JSP collapse; own scrollbar keeps every item reachable.
            NOTE: deliberately NOT id="sidebar"/.sidebar — tenant bank.css has
            `@media (max-width:979px){ #sidebar{ background:#248dc1 !important }}`
            which would repaint the drawer blue on small screens. */}
        <Box
          component="nav"
          id="app-sidebar"
          sx={{ ...sx.sidebarOuter, width: drawerOpen ? '300px' : '0px' }}
          aria-hidden={!drawerOpen}
        >
          <Box sx={sx.sidebarInner}>
            <Box component="ul" sx={sx.sidebarList}>
              {NAV_SECTIONS.filter((s) => isVisible(features, s.feature)).map((section) => {
                const children =
                  section.children?.filter((c) => isVisible(features, c.feature)) ?? [];
                if (section.children && children.length === 0) return null;

                const hasActiveChild = children.some((c) => c.route === location.pathname);
                const isOpen = openSection === section.id;
                // Exactly ONE item carries the navy highlight at a time:
                // an expanded group takes precedence; only when nothing is
                // expanded does the active route (group owner or direct item)
                // hold it. Expanding "Manage Businesses" while on Home
                // therefore un-highlights Home.
                const anyExpanded = openSection !== null;
                const highlighted = section.children
                  ? isOpen || (!anyExpanded && hasActiveChild)
                  : !anyExpanded && section.route === location.pathname;
                const itemColor = highlighted
                  ? uiColors.sidebar.textActive
                  : uiColors.sidebar.text;

                return (
                  <Box component="li" key={section.id} sx={sx.sidebarItemLi}>
                    <Box
                      component="a"
                      role="button"
                      tabIndex={0}
                      sx={{
                        ...sx.sidebarItem,
                        ...(highlighted
                          ? { ...sx.sidebarItemActive, backgroundColor: brandColor }
                          : {})
                      }}
                      onClick={() => {
                        if (section.children) setOpenSection(isOpen ? null : section.id);
                        else goTo(section);
                      }}
                    >
                      <Box component="span" sx={sx.sidebarItemInner}>
                        {SECTION_ICONS[section.icon](itemColor)}
                        <Box
                          component="span"
                          sx={{
                            ...sx.sidebarItemLabel,
                            color: itemColor
                          }}
                        >
                          {section.label}
                        </Box>
                      </Box>
                      {section.children &&
                        (isOpen ? (
                          <KeyboardArrowDownIcon sx={{ fontSize: 20 }} htmlColor={itemColor} />
                        ) : (
                          <KeyboardArrowRightIcon sx={{ fontSize: 20 }} htmlColor={itemColor} />
                        ))}
                    </Box>

                    {section.children && isOpen && (
                      <Box component="ul" sx={sx.sidebarSubList}>
                        {children.map((child) => (
                          <Box component="li" key={child.route + child.label}>
                            <Box
                              component="a"
                              role="button"
                              tabIndex={0}
                              sx={{
                                ...sx.sidebarSubItem,
                                ...(location.pathname === child.route
                                  ? sx.sidebarSubItemActive
                                  : {})
                              }}
                              onClick={() => navigate(child.route)}
                            >
                              {child.label}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Main content */}
        <Box component="main" sx={sx.shellMain}>
          <Outlet />
        </Box>
      </Box>

      {/* Footer bar (footer.jsp): dark slate, full width */}
      <Box component="footer" sx={sx.footerBar}>
        © {new Date().getFullYear()} Powered by Tyfone Inc.
        {buildVersion && <span>v{buildVersion}</span>}
      </Box>

      {/* Logout confirm modal (footer.jsp #logoutModal): no title, Cancel/OK */}
      {logoutConfirm && (
        <Box className="modal-backdrop" sx={sx.modalBackdrop} role="dialog" aria-modal="true">
          <Box className="modal-card" sx={sx.modalCard}>
            <p>Are you sure you want to logout?</p>
            {/* no .btn classes here: tenant bank.css .btn rules would strip
                the border/background these buttons need to match the JSP */}
            <Box className="modal-actions" sx={sx.modalActions}>
              <Box
                component="button"
                type="button"
                sx={sx.modalCancelBtn}
                onClick={() => setLogoutConfirm(false)}
                disabled={loggingOut}
              >
                Cancel
              </Box>
              <Box
                component="button"
                type="button"
                sx={{ ...sx.modalOkBtn, backgroundColor: brandColor, borderColor: brandColor }}
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? '…' : 'OK'}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
