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
import { formatEnrollmentDate } from '../utils/dateFormat';
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
        // Enrollment date and timezone are extracted from /my_profile JSP during login
        // and stored in the user object from the backend session
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
            enrollmentDate: user.enrollmentDate,
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
      {/* Breadcrumb - matches JSP structure */}
      <div id="breadcrumbs" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
        <ul
          className="breadcrumb"
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0',
          }}
        >
          <li
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: uiColors.text.primary,
            }}
          >
            <i className="fa fa-home" style={{ fontSize: '16px', color: uiColors.text.secondary }}></i>
            <a href="/dashboard" style={{ color: uiColors.text.primary, textDecoration: 'none' }}>
              Home
            </a>
            <span className="divider" style={{ margin: '0 8px', color: uiColors.text.secondary }}>
              <i className="fa fa-angle-right"></i>
            </span>
          </li>
          <li className="active" style={{ fontSize: '14px', color: uiColors.text.primary }}>
            Edit My Profile
          </li>
        </ul>
      </div>

      {/* Card container - matches JSP structure */}
      <div className="card" style={{ backgroundColor: uiColors.background.card, borderRadius: '0px', marginBottom: '20px', border: 'none' }}>
        {/* Card Header with Title - matches JSP */}
        <div className="card-header" style={{ backgroundColor: uiColors.background.card, borderBottom: `1px solid ${uiColors.border.default}`, padding: '15px 20px' }}>
          <h3 className="card-title" style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: uiColors.text.primary }}>
            Edit My Profile
          </h3>
        </div>

        {/* Card Body */}
        <div className="card-body" id="usersprofile" style={{ padding: '20px', backgroundColor: uiColors.background.card }}>
          {/* User Profile Info Section - matches JSP lines 70-95 */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-6" style={{ display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: 0, marginBottom: '8px', fontWeight: 600, fontSize: '16px', color: uiColors.text.primary }}>
                <span style={{ fontWeight: 'bold' }}>
                  {profileData?.adminUser.firstname} {profileData?.adminUser.lastname}
                </span>
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: uiColors.text.secondary, fontFamily: "'Open Sans', Helvetica, Arial, sans-serif" }}>
                <span style={{ marginRight: '4px' }}>Enrolled Since:</span>
                {profileData?.enrollmentDate ? (
                  <span id="enrollmentDateSpan" style={{ fontWeight: 500, color: uiColors.text.primary, fontFamily: "'Open Sans', Helvetica, Arial, sans-serif" }}>
                    {formatEnrollmentDate(profileData.enrollmentDate)}
                    {profileData.timezone && ` ${profileData.timezone}`}
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </p>
            </div>
          </div>

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

          {/* Tabs - Using Bootstrap nav-tabs - matches JSP lines 98-111 */}
          <div style={{ borderBottom: `1px solid ${uiColors.border.default}`, marginBottom: '20px', marginTop: '20px' }}>
            <ul id="myTab1" className="nav nav-tabs" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex' }}>
              <li className="nav-item" style={{ marginRight: 0 }}>
                <a
                  id="profiletab"
                  href="#profile"
                  className={`nav-link ${tabValue === 0 ? 'active anchor_click' : 'anchor_click'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTabValue(0);
                  }}
                  style={{
                    color: tabValue === 0 ? uiColors.chart.title : uiColors.text.secondary,
                    borderBottom: tabValue === 0 ? `3px solid ${uiColors.chart.title}` : 'none',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: tabValue === 0 ? 600 : 400,
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Profile
                </a>
              </li>
              <li className="nav-item" style={{ marginRight: 0 }}>
                <a
                  id="operationstab"
                  href="#accounts"
                  data-target="#accounts"
                  className={`nav-link ${tabValue === 1 ? 'active anchor_click' : 'anchor_click'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTabValue(1);
                  }}
                  style={{
                    color: tabValue === 1 ? uiColors.chart.title : uiColors.text.secondary,
                    borderBottom: tabValue === 1 ? `3px solid ${uiColors.chart.title}` : 'none',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: tabValue === 1 ? 600 : 400,
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Operations/Accounts
                </a>
              </li>
              <li className="nav-item" style={{ marginRight: 0 }}>
                <a
                  id="changepasswordtab"
                  href="#changePassword"
                  data-target="#changePassword"
                  className={`nav-link ${tabValue === 2 ? 'active anchor_click' : 'anchor_click'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTabValue(2);
                  }}
                  style={{
                    color: tabValue === 2 ? uiColors.chart.title : uiColors.text.secondary,
                    borderBottom: tabValue === 2 ? `3px solid ${uiColors.chart.title}` : 'none',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: tabValue === 2 ? 600 : 400,
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Change Password
                </a>
              </li>
            </ul>
          </div>

          {/* Tab Content - matches JSP lines 134-440 */}
          <div id="myTabContent1" className="tab-content" style={{ marginTop: '0' }}>
            {/* Profile Tab Pane - matches JSP lines 136-241 */}
            <div
              className={`tab-pane ${tabValue === 0 ? 'fade in active' : ''}`}
              id="profile"
              style={{ display: tabValue === 0 ? 'block' : 'none', paddingTop: '20px' }}
            >
              <div className="panel-group" id="accordion1">
                <div className="card-body" style={{ padding: '0' }}>
                  <div className="row">
                    <div className="col-md-12">
                      <EditProfileForm adminUser={profileData.adminUser} allowedEmailDomains={profileData.allowedEmailDomains} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts Tab Pane - matches JSP lines 243-314 */}
            <div
              className={`tab-pane ${tabValue === 1 ? 'fade in active' : ''}`}
              id="accounts"
              style={{ display: tabValue === 1 ? 'block' : 'none', paddingTop: '20px' }}
            >
              <OperationsTab myProfileConfig={profileData.myProfileConfig} />
            </div>

            {/* Change Password Tab Pane - matches JSP lines 317-439 */}
            <div
              className={`tab-pane fade ${tabValue === 2 ? 'in active' : ''}`}
              id="changePassword"
              style={{ display: tabValue === 2 ? 'block' : 'none', paddingTop: '20px' }}
            >
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
