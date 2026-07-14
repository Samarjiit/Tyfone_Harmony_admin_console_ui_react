/**
 * Edit My Profile Page — migrated from JSP my_profile.jsp to React
 * Displays user profile info, transaction history, and password change functionality
 * Uses Material-UI tabs for Profile, Operations/Accounts, and Change Password sections
 */
import { useEffect, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { http } from '../services/http';
import { uiColors } from '../constants/colors';
import EditProfileForm from '../components/EditProfileForm';
import OperationsTab from '../components/OperationsTab';
import ChangePasswordTab from '../components/ChangePasswordTab';

interface AdminUser {
  firstname: string;
  lastname: string;
  emailAddress: string;
  username: string;
  mobileno: string;
  roleName: string;
  roleSlug: string;
  enrollmentDate?: string;
  timezone?: string;
}

interface ProfileContextData {
  adminUser: AdminUser;
  enrollmentDate?: string;
  timezone?: string;
  myProfileConfig?: unknown;
  passwordPolicy?: string;
  allowedEmailDomains?: string;
}

function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
  const { children, value, index } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{
        display: value === index ? 'block' : 'none',
        padding: '20px 0',
      }}
    >
      {children}
    </Box>
  );
}

export default function EditMyProfilePage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState<ProfileContextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupProfileData = async () => {
      try {
        setLoading(true);

        // Use authenticated user info from AuthContext (set during login via session probe)
        // This mirrors JSP approach: user data comes from session, not from /my_profile API
        // Note: /my_profile endpoint returns JSP HTML, not JSON data
        if (user) {
          setProfileData({
            adminUser: {
              firstname: user.firstname,
              lastname: user.lastname,
              emailAddress: user.emailAddress,
              username: user.username,
              mobileno: user.mobileno,
              roleName: user.roleName,
              roleSlug: user.roleSlug,
            },
            timezone: user.timezone || 'UTC',
            myProfileConfig: [],
            passwordPolicy: '',
            allowedEmailDomains: '',
          });

          // Optionally fetch additional server-side config if available
          // (password policy, email domains, etc.)
          // These are typically stored as session attributes in JSP, not API endpoints
        }
      } catch (err) {
        console.error('Error setting up profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setupProfileData();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center', color: uiColors.text.primary }}>
        Loading profile...
      </Box>
    );
  }

  if (!profileData?.adminUser) {
    return (
      <Box sx={{ padding: '20px', color: uiColors.text.primary }}>
        No profile data found.
      </Box>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Breadcrumb */}
      <div id="breadcrumbs" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
        <ul
          className="breadcrumb"
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <li
            className="active"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: uiColors.text.primary,
              fontWeight: '500',
            }}
          >
            <i className="fa fa-home" style={{ fontSize: '16px', color: uiColors.text.secondary }}></i>
            Edit My Profile
          </li>
        </ul>
      </div>

      {/* Card container - matches JSP structure */}
      <div className="box" style={{ backgroundColor: uiColors.background.card, borderRadius: '0px', marginBottom: '20px' }}>
        <div className="box-content" style={{ padding: '20px', backgroundColor: uiColors.background.card }}>
          {/* Success Alert */}
          <div
            className="alert alert-success"
            id="successdiv"
            style={{
              display: 'none',
              marginBottom: '20px',
              backgroundColor: '#dff0d8',
              borderColor: '#d6e9c6',
              color: '#3c763d',
            }}
          >
            <p>
              <label id="successtxt" style={{ margin: 0 }}></label>
            </p>
          </div>

          {/* Info Alert */}
          <div
            className="alert alert-warning"
            id="infodiv"
            style={{
              display: 'none',
              marginBottom: '20px',
              backgroundColor: '#faebcc',
              borderColor: '#faebcc',
              color: '#8a6d3b',
            }}
          >
            <p>
              <label id="infotxt" style={{ margin: 0 }}></label>
            </p>
          </div>

          {/* Danger Alert */}
          <div
            className="alert alert-danger"
            id="dangerdiv"
            style={{
              display: 'none',
              marginBottom: '20px',
              backgroundColor: '#f8d7da',
              borderColor: '#f5c6cb',
              color: '#721c24',
            }}
          >
            <p>
              <label id="errortxt" style={{ margin: 0 }}></label>
            </p>
          </div>

          {/* Tabs - Using Bootstrap nav-tabs */}
          <div style={{ borderBottom: `1px solid ${uiColors.border.default}`, marginBottom: '20px' }}>
            <ul id="myTab1" className="nav nav-tabs" style={{ margin: 0, padding: 0 }}>
              <li className="nav-item">
                <a
                  id="profiletab"
                  href="#profile"
                  className={`nav-link ${tabValue === 0 ? 'active' : ''} anchor_click`}
                  onClick={() => setTabValue(0)}
                  style={{
                    color: tabValue === 0 ? uiColors.chart.title : uiColors.text.secondary,
                    borderBottom: tabValue === 0 ? `3px solid ${uiColors.chart.title}` : 'none',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: tabValue === 0 ? 600 : 400,
                  }}
                >
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  id="operationstab"
                  href="#accounts"
                  data-target="#accounts"
                  className={`nav-link ${tabValue === 1 ? 'active' : ''} anchor_click`}
                  onClick={() => setTabValue(1)}
                  style={{
                    color: tabValue === 1 ? uiColors.chart.title : uiColors.text.secondary,
                    borderBottom: tabValue === 1 ? `3px solid ${uiColors.chart.title}` : 'none',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: tabValue === 1 ? 600 : 400,
                  }}
                >
                  Operations/Accounts
                </a>
              </li>
              <li className="nav-item">
                <a
                  id="changepasswordtab"
                  href="#changePassword"
                  data-target="#changePassword"
                  className={`nav-link ${tabValue === 2 ? 'active' : ''} anchor_click`}
                  onClick={() => setTabValue(2)}
                  style={{
                    color: tabValue === 2 ? uiColors.chart.title : uiColors.text.secondary,
                    borderBottom: tabValue === 2 ? `3px solid ${uiColors.chart.title}` : 'none',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: tabValue === 2 ? 600 : 400,
                  }}
                >
                  Change Password
                </a>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div id="myTabContent1" className="tab-content">
            {/* Profile Tab Pane */}
            <div className={`tab-pane fade ${tabValue === 0 ? 'in active' : ''}`} id="profile" style={{ display: tabValue === 0 ? 'block' : 'none', paddingTop: '20px' }}>
              <div className="panel-group" id="accordion1">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <EditProfileForm adminUser={profileData.adminUser} allowedEmailDomains={profileData.allowedEmailDomains} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts Tab Pane */}
            <div className={`tab-pane ${tabValue === 1 ? 'fade in active' : ''}`} id="accounts" style={{ display: tabValue === 1 ? 'block' : 'none', paddingTop: '20px' }}>
              <OperationsTab myProfileConfig={profileData.myProfileConfig} />
            </div>

            {/* Change Password Tab Pane */}
            <div className={`tab-pane fade ${tabValue === 2 ? 'in active' : ''}`} id="changePassword" style={{ display: tabValue === 2 ? 'block' : 'none', paddingTop: '20px' }}>
              <div className="row">
                <div className="col-md-12">
                  <ChangePasswordTab passwordPolicy={profileData.passwordPolicy} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
