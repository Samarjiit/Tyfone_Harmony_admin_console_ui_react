# Admin Console Dashboard — React with Apache ECharts

Modern React dashboard application for the Tyfone Admin Console using Apache ECharts v5.5.0 for interactive data visualization.

## Overview

This is the **dashboard page** of the admin console — a React frontend that connects to the Spring backend's existing authentication and API wire protocol. The dashboard displays interactive charts for login trends and enrollment trends.

### Key Features

✅ **Overall Login Trend Chart** (Dual Y-axis)
- Left axis: Number of Logins (Teal #008C96)
- Right axis: Failed Login % (Red #DC3545)
- Interactive tooltip with date and values

✅ **New Enrollment/Unenrollment Chart** (Single Y-axis)
- New Enrollments (Teal #008C96)
- Unenrollments (Red #DC3545)
- Interactive tooltip and legend

✅ **Backend Integration**
- Multitenancy: Tenant resolved at runtime via `GET /bank_id`
- Session management: JSESSIONID cookie with timeout handling
- CSRF protection: antiCsrfToken header
- Error handling: Permission denied, session timeout detection

## Prerequisites

1. **Node.js 18+**
2. **Spring backend running** (Tomcat with `adminconsole-ux` deployed)
3. **Tenant domains** mapped in your hosts file:
   ```
   127.0.0.1 staronedev.tyfone.com
   127.0.0.1 diamondcudev1.tyfone.com
   ```

## Quick Start

### Installation

```bash
# Navigate to project
cd Tyfone_Harmony_admin_console_ui_react

# Install dependencies
npm install --legacy-peer-deps
```

### Development

```bash
# Start dev server
npm run dev

# Navigate to:
# http://localhost:3000/login (authenticate)
# http://localhost:3000/dashboard (view dashboard)
```

### Production

```bash
# Build for production
npm run build

# Output: dist/ directory
# Serve from same origin as backend
```

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Framework |
| Apache ECharts | 5.5.0 | Chart Rendering |
| Material-UI | 9.2.0 | Component Library |
| Axios | 1.7.7 | HTTP Client |
| React Router | 6.28.0 | Navigation |
| TypeScript | 5.6.3 | Type Safety |
| Vite | 5.4.10 | Build Tool |

## Project Structure

```
src/
├── pages/
│   ├── DashboardPage.tsx              # Main dashboard (ECHARTS)
│   ├── LoginPage.tsx
│   ├── EnterOtpPage.tsx
│   ├── LogoutPage.tsx
│   └── SessionTimeoutPage.tsx
│
├── components/
│   ├── LoginTrendChart.tsx            # Dual-axis chart (ECHARTS)
│   ├── EnrollmentTrendChart.tsx       # Single-axis chart (ECHARTS)
│   └── RequireAuth.tsx
│
├── context/
│   ├── AuthContext.ts                 # Authentication state
│   └── TenantContext.ts               # Tenant/branding state
│
├── services/
│   ├── basePath.ts                    # Backend context path
│   ├── csrf.ts                        # CSRF token handling
│   ├── http.ts                        # Axios instance
│   ├── legacyPage.ts                  # JSP adapter
│   └── auth.service.ts                # Auth endpoints
│
├── utils/
│   └── tenant.ts                      # Tenant resolution
│
├── layouts/
│   └── LoginLayout.tsx                # Login page structure
│
└── App.tsx                            # Main app component
```

## Dashboard Components

### DashboardPage.tsx
Main dashboard container that:
- Fetches login and enrollment trend data from API
- Manages loading and error states
- Renders both Apache ECharts components
- Implements feature gating (StFr bank)
- Handles session timeouts
- Responsive grid layout

### LoginTrendChart.tsx
Dual-axis line chart using Apache ECharts:
- **Configuration**: Dual Y-axes with custom axis names
- **Colors**: Teal (#008C96) for logins, Red (#DC3545) for failed %
- **Interactivity**: Tooltip on hover, custom legend
- **Export**: Chart component + Legend component

### EnrollmentTrendChart.tsx
Single-axis line chart using Apache ECharts:
- **Configuration**: Single Y-axis with axis name
- **Colors**: Teal for enrollments, Red for unenrollments
- **Interactivity**: Tooltip on hover, custom legend
- **Export**: Chart component + Legend component

## API Endpoints

### Dashboard Data

```
GET /get_dashboard_login_trend
  Query: from, to, memberType
  Response: status, validLoginsData[], failedLoginsData[], finalDates[]

GET /get_dashboard_enrollment_trend
  Query: from, to, memberType
  Response: status, newEnrollmentData[], unEnrollmentData[], finalDates[]
```

### Authentication (Backend)

```
POST /login              (form-encoded)
POST /enter_otp          (form-encoded)
POST /logout
GET /bank_id             (tenant resolution)
```

## Configuration — `.env`

```properties
VITE_CONTEXT_PATH=/adminconsole-ux
VITE_BACKEND_TARGET=http://staronedev.tyfone.com
```

- **Switch tenant**: Update `VITE_BACKEND_TARGET` and restart `npm run dev`
- **Custom port**: `http://staronedev.tyfone.com:8080`

## Dashboard Styling

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| No. of Logins | Teal | #008C96 |
| Failed Login % | Red | #DC3545 |
| Chart Title | Dark Teal | #2c6aa0 |

### Layout
- **Grid**: 2 columns (desktop), 1 column (mobile)
- **Chart Height**: 280px
- **Container**: 400px minimum, white background, subtle border

## Error Handling

| Scenario | Status | Behavior |
|----------|--------|----------|
| Session timeout | "1000" | Redirect to `/session-timeout` |
| Permission denied | "403" | Show error message |
| No data | Empty array | Display "no data" message |
| Network error | Error | Show user-friendly message |

## Feature Gating

The login chart is hidden for StFr bank:

```typescript
const showLoginDiv = tenant?.resourceId !== 'StFr'
```

## Documentation

### Full Implementation Guide
See **[ECHARTS_IMPLEMENTATION.md](./ECHARTS_IMPLEMENTATION.md)** for:
- Detailed component architecture
- ECharts configuration options
- API integration specifications
- Styling guidelines
- Common customizations
- Troubleshooting

### Quick Reference
See **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for:
- Command reference
- Configuration values
- Debugging tips
- Common tasks

## Common Tasks

### Change Chart Colors

Edit `src/components/LoginTrendChart.tsx` or `EnrollmentTrendChart.tsx`:

```typescript
lineStyle: { color: '#YOURCOLOR', width: 2 }
itemStyle: { color: '#YOURCOLOR' }
```

### Modify Date Range

Edit `src/pages/DashboardPage.tsx` in `getDateRange()`:

```typescript
const startDate = new Date(endDate.getTime() - DAYS * 86400000);
```

### Adjust Chart Height

Edit component Box sx:

```typescript
height: 320,  // Change from 280
```

## Development Workflow

### Hot Module Reload (HMR)
Vite provides fast HMR for React components. Changes to code, styles, and configurations reflect instantly.

### Building
```bash
npm run build
# Runs: tsc -b && vite build
# Output: dist/ directory
```

## Troubleshooting

### Charts Not Rendering
1. Check browser console (F12) for errors
2. Verify API endpoints in Network tab
3. Confirm response structure matches expected format

### Axis Labels Missing
Ensure `show: true` in axisLabel configuration

### Session Timeout Not Working
Verify status "1000" check in DashboardPage.tsx

### Backend Not Reachable
Confirm Tomcat is running and tenant domains resolve to localhost

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Requires ES6+ support

## Notes

- **Multitenancy**: One build serves all tenants via relative URLs
- **Session**: JSESSIONID cookie managed by backend
- **CSRF**: Tokens harvested from login page and sent with API requests
- **Responsive**: Charts adapt to viewport size
- **Performance**: Proper cleanup on component unmount, no memory leaks

## Contact

For questions about:
- **Dashboard/ECharts implementation**: See ECHARTS_IMPLEMENTATION.md
- **Authentication/Backend**: Check the JSP source files
- **Build/Setup**: Review this README and QUICK_REFERENCE.md
