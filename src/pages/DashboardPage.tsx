/**
 * Dashboard (Home) — migrated from JSP dashboard.jsp to React with MUI Charts
 * Displays login trend and enrollment trend charts for the last 7 days.
 * Uses reusable chart components with clean separation of concerns.
 */
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { LoginTrendChart, LoginTrendLegend } from '../components/LoginTrendChart';
import { EnrollmentTrendChart, EnrollmentTrendLegend } from '../components/EnrollmentTrendChart';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { http } from '../services/http';

interface DashboardResponse {
  status: string;
  message?: string;
  validLoginsData?: number[];
  failedLoginsData?: number[];
  newEnrollmentData?: number[];
  unEnrollmentData?: number[];
  finalDates?: string[];
  trendCategoryList?: string[];
  validLoginChartTick?: { max: number; min: number; limit: number };
  failedLoginChartTick?: { max: number; min: number; limit: number };
  unenrollmentChartTick?: { max: number; min: number; limit: number };
}

function getDateRange() {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate.getTime() - 7 * 86400000);

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T`;
  };

  return {
    startDate: formatDate(startDate) + '00:00:00',
    endDate: formatDate(endDate) + '23:59:59'
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();

  const [loginLoading, setLoginLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [enrollmentError, setEnrollmentError] = useState('');
  const [loginData, setLoginData] = useState<DashboardResponse | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<DashboardResponse | null>(null);

  const showLoginDiv = tenant?.resourceId !== 'StFr';

  useEffect(() => {
    const fetchLoginTrend = async () => {
      try {
        setLoginLoading(true);
        setLoginError('');
        const { startDate, endDate } = getDateRange();
        const response = await http.get<DashboardResponse>(
          '/get_dashboard_login_trend',
          {
            params: {
              from: startDate,
              to: endDate,
              memberType: 'ALL'
            }
          }
        );

        const data = response.data;
        if (data.status === '0') {
          if (
            data.validLoginsData &&
            data.failedLoginsData &&
            data.validLoginsData.length > 0 &&
            data.failedLoginsData.length > 0
          ) {
            setLoginData(data);
          } else {
            setLoginError(
              (data.message || 'Error') + ' There is no login data to show.'
            );
          }
        } else if (data.status === '1000') {
          window.location.href = '/session-timeout';
        } else {
          if (data.message?.indexOf('403') !== -1) {
            setLoginError(
              "Permission Denied!!! You don't have permission to access the requested feature."
            );
          } else {
            setLoginError(data.message || 'Unable to process your request.');
          }
        }
      } catch (error) {
        setLoginError('Unable to process your request. Please try again later.');
      } finally {
        setLoginLoading(false);
      }
    };

    const fetchEnrollmentTrend = async () => {
      try {
        setEnrollmentLoading(true);
        setEnrollmentError('');
        const { startDate, endDate } = getDateRange();
        const response = await http.get<DashboardResponse>(
          '/get_dashboard_enrollment_trend',
          {
            params: {
              from: startDate,
              to: endDate,
              memberType: 'ALL'
            }
          }
        );

        const data = response.data;
        if (data.status === '0') {
          if (
            data.newEnrollmentData &&
            data.unEnrollmentData &&
            data.newEnrollmentData.length > 0 &&
            data.unEnrollmentData.length > 0
          ) {
            setEnrollmentData(data);
          } else {
            setEnrollmentError(
              (data.message || 'Error') + ' There is no enrollment data to show.'
            );
          }
        } else if (data.status === '1000') {
          window.location.href = '/session-timeout';
        } else {
          if (data.message?.indexOf('403') !== -1) {
            setEnrollmentError(
              "Permission Denied!!! You don't have permission to access the requested feature."
            );
          } else {
            setEnrollmentError(data.message || 'Unable to process your request.');
          }
        }
      } catch (error) {
        setEnrollmentError('Unable to process your request. Please try again later.');
      } finally {
        setEnrollmentLoading(false);
      }
    };

    fetchLoginTrend();
    fetchEnrollmentTrend();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Breadcrumb */}
      <Box id="breadcrumbs" sx={{ marginBottom: '20px', paddingBottom: '12px' }}>
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
              color: '#333',
              fontWeight: '500',
            }}
          >
            <i className="fa fa-home" style={{ fontSize: '16px', color: '#666' }}></i>
            Home
          </li>
        </ul>
      </Box>

      {/* Dashboard container */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%' }}>
          <Box
            className="box"
            sx={{
              marginBottom: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '0px',
            }}
          >
            <Box
              className="box-content"
              sx={{
                padding: '20px',
                backgroundColor: '#ffffff',
              }}
            >
              {/* Alert message */}
              {(loginError || enrollmentError) && (
                <Box
                  sx={{
                    marginBottom: '20px',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    color: '#721c24',
                  }}
                >
                  <p id="alertMessageTag" style={{ margin: 0, fontSize: '13px' }}>
                    {loginError || enrollmentError}
                  </p>
                </Box>
              )}

              {/* Charts Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '30px',
                }}
              >
                {/* Login Trend Chart */}
                {showLoginDiv && (
                  <Box id="loginDiv">
                    <Box
                      className="chartBox"
                      sx={{
                        background: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '0px',
                        padding: '20px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '400px',
                      }}
                      title="Overall login trend graph"
                    >
                      <h4
                        id="loginLabel"
                        style={{
                          textAlign: 'center',
                          margin: '0 0 20px 0',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#2c6aa0',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Overall Login Trend
                      </h4>

                      <LoginTrendChart
                        data={{
                          dates: loginData?.finalDates || [],
                          logins: loginData?.validLoginsData || [],
                          failedLogins: loginData?.failedLoginsData || [],
                          loading: loginLoading,
                          error: loginError,
                        }}
                      />

                      {!loginLoading && !loginError && loginData && <LoginTrendLegend />}
                    </Box>
                  </Box>
                )}

                {/* Enrollment Trend Chart */}
                <Box>
                  <Box
                    className="chartBox"
                    sx={{
                      background: '#ffffff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '0px',
                      padding: '20px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '400px',
                    }}
                    title="New Enrollment/Unenrollment graph"
                  >
                    <h4
                      id="enrollLabel"
                      style={{
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#2c6aa0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      New Enrollment/Unenrollment
                    </h4>

                    <EnrollmentTrendChart
                      data={{
                        dates: enrollmentData?.finalDates || [],
                        enrollments: enrollmentData?.newEnrollmentData || [],
                        unenrollments: enrollmentData?.unEnrollmentData || [],
                        loading: enrollmentLoading,
                        error: enrollmentError,
                      }}
                    />

                    {!enrollmentLoading && !enrollmentError && enrollmentData && <EnrollmentTrendLegend />}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
