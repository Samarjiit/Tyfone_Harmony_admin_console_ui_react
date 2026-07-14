# Dashboard with Apache ECharts - Implementation Guide

**Complete documentation for the React dashboard migration using Apache ECharts v5.5.0**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [Chart Configurations](#chart-configurations)
6. [API Integration](#api-integration)
7. [Styling & UI](#styling--ui)
8. [Feature Gating](#feature-gating)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The admin dashboard displays two interactive charts tracking login trends and enrollment trends over the past 7 days. The implementation uses **Apache ECharts v5.5.0** with **React 18**, **Material-UI 9.2.0**, and **Axios** for API communication.

### Charts Included

1. **Overall Login Trend** - Dual Y-axis line chart
   - Left axis: No. of Logins (Teal #008C96)
   - Right axis: Failed login % (Red #DC3545)

2. **New Enrollment/Unenrollment** - Single Y-axis line chart
   - New Enrollments (Teal #008C96)
   - Unenrollments (Red #DC3545)

---

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI framework |
| Apache ECharts | 5.5.0 | Chart rendering engine |
| Material-UI | 9.2.0 | Component library |
| Axios | 1.7.7 | HTTP client |
| React Router | 6.28.0 | Navigation |
| TypeScript | 5.6.3 | Type safety |
| Vite | 5.4.10 | Build tool |

### Installation

```bash
npm install --legacy-peer-deps
```

---

## Project Structure

```
src/
├── pages/
│   └── DashboardPage.tsx          # Main dashboard container
├── components/
│   ├── LoginTrendChart.tsx        # Dual-axis login chart + legend
│   └── EnrollmentTrendChart.tsx   # Single-axis enrollment chart + legend
├── context/
│   ├── AuthContext.ts             # User authentication
│   └── TenantContext.ts           # Tenant/bank information
├── services/
│   └── http.ts                    # Axios HTTP client
└── App.tsx                        # Main app component
```

---

## Component Architecture

### DashboardPage.tsx

**Location:** `src/pages/DashboardPage.tsx`

Main component that orchestrates:
- Data fetching from two API endpoints
- State management for loading/error states
- Conditional rendering based on tenant (feature gating)
- Layout with CSS Grid (2 columns, responsive)

**Key Functions:**

```typescript
getDateRange()
  // Returns 7-day date range in format: YYYY-MM-DDTHH:MM:SS
  // Example: "2026-07-06T00:00:00" to "2026-07-13T23:59:59"

fetchLoginTrend()
  // API: /get_dashboard_login_trend
  // Returns: validLoginsData, failedLoginsData, finalDates

fetchEnrollmentTrend()
  // API: /get_dashboard_enrollment_trend  
  // Returns: newEnrollmentData, unEnrollmentData, finalDates
```

**Error Handling:**

- Session timeout (status "1000") → Redirect to `/session-timeout`
- Permission denied (status contains "403") → Show error message
- Other errors → Display user-friendly message

**Feature Gating:**

```typescript
const showLoginDiv = tenant?.resourceId !== 'StFr'
// Login chart hidden for StFr bank
```

---

### LoginTrendChart.tsx

**Location:** `src/components/LoginTrendChart.tsx`

Reusable dual-axis line chart component for login trends.

**Props:**

```typescript
interface LoginChartData {
  dates: string[]              // X-axis dates (e.g., ["Jul 5", "Jul 6", ...])
  logins: number[]             // Left Y-axis: No. of Logins
  failedLogins: number[]       // Right Y-axis: Failed login %
  loading: boolean             // Loading state
  error: string                // Error message
}

interface LoginTrendChartProps {
  data: LoginChartData
}
```

**Configuration:**

```typescript
{
  // Tooltip on hover
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    formatter: (params) => `<date>\n<series1: value>\n<series2: value>`
  },
  
  // Grid margins
  grid: { left: 60, right: 60, top: 10, bottom: 40 },
  
  // X-axis (Category)
  xAxis: {
    name: 'Date',
    axisLabel: { show: true, fontSize: 12 },
    nameGap: 25
  },
  
  // Dual Y-axes
  yAxis: [
    {
      name: 'No. of Logins',
      min: 0,
      nameLocation: 'middle',
      nameGap: 50
    },
    {
      name: 'Failed login %',
      position: 'right',
      min: 0,
      nameLocation: 'middle',
      nameGap: 50
    }
  ],
  
  // Series
  series: [
    {
      name: 'No. of Logins',
      type: 'line',
      yAxisIndex: 0,
      lineStyle: { color: '#008C96', width: 2 },
      symbolSize: 4
    },
    {
      name: 'Failed login %',
      type: 'line',
      yAxisIndex: 1,
      lineStyle: { color: '#DC3545', width: 2 },
      symbolSize: 4
    }
  ]
}
```

**Exports:**

- `LoginTrendChart` - Chart component
- `LoginTrendLegend` - Legend with colored dots

---

### EnrollmentTrendChart.tsx

**Location:** `src/components/EnrollmentTrendChart.tsx`

Single-axis line chart component for enrollment trends.

**Props:**

```typescript
interface EnrollmentChartData {
  dates: string[]              // X-axis dates
  enrollments: number[]        // New Enrollments
  unenrollments: number[]      // Unenrollments
  loading: boolean             // Loading state
  error: string                // Error message
}
```

**Configuration:** Similar to LoginTrendChart but with single Y-axis.

---

## Chart Configurations

### Dual Y-Axis Setup (LoginTrendChart)

```typescript
yAxis: [
  {
    type: 'value',
    name: 'No. of Logins',
    nameTextStyle: { color: '#666', fontSize: 12 },
    nameLocation: 'middle',  // Center the label
    nameGap: 50,             // Space between axis and label
    axisLine: { show: false },
    axisLabel: { show: true, fontSize: 12, color: '#666' },
    splitLine: { lineStyle: { color: '#f0f0f0' } },
    min: 0                   // Always start from 0
  },
  {
    type: 'value',
    name: 'Failed login %',
    position: 'right',       // Right side
    nameTextStyle: { color: '#666', fontSize: 12 },
    nameLocation: 'middle',
    nameGap: 50,
    axisLine: { show: false },
    axisLabel: { show: true, fontSize: 12, color: '#666' },
    splitLine: { show: false },  // No split lines on right axis
    min: 0
  }
]
```

### Tooltip Formatter

```typescript
tooltip: {
  trigger: 'axis',
  formatter: (params: any) => {
    let result = `<div>${params[0]?.axisValue}</div>`;
    params.forEach((param: any) => {
      result += `<div style="color: ${param.color}">${param.seriesName}: ${param.value}</div>`;
    });
    return result;
  }
}
```

Shows date on first line, then each series with its color and value.

---

## API Integration

### Endpoints

**1. Login Trend Data**

```
GET /get_dashboard_login_trend
Query Parameters:
  - from: string (ISO datetime format)
  - to: string (ISO datetime format)
  - memberType: string ("ALL")

Response:
{
  status: "0",
  validLoginsData: number[],
  failedLoginsData: number[],
  finalDates: string[]
}
```

**2. Enrollment Trend Data**

```
GET /get_dashboard_enrollment_trend
Query Parameters:
  - from: string (ISO datetime format)
  - to: string (ISO datetime format)
  - memberType: string ("ALL")

Response:
{
  status: "0",
  newEnrollmentData: number[],
  unEnrollmentData: number[],
  finalDates: string[]
}
```

### Error Status Codes

- `"0"` - Success
- `"1000"` - Session timeout (redirect to /session-timeout)
- Contains `"403"` - Permission denied

### Date Range Calculation

```typescript
function getDateRange() {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);  // Yesterday
  endDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(endDate.getTime() - 7 * 86400000);  // 7 days prior
  
  return {
    startDate: formatDate(startDate) + '00:00:00',
    endDate: formatDate(endDate) + '23:59:59'
  };
}
```

---

## Styling & UI

### Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| No. of Logins | #008C96 | Teal (primary metric) |
| Failed login % | #DC3545 | Red (warning metric) |
| Chart border | #e0e0e0 | Subtle gray |
| Title | #2c6aa0 | Dark teal |
| Axis labels | #666 | Medium gray |
| Grid lines | #f0f0f0 | Light gray |

### Layout

**Grid Layout:**
```typescript
display: 'grid'
gridTemplateColumns: '1fr 1fr'  // 2 equal columns
gap: '30px'
```

**Responsive:** Wraps to single column on narrow viewports.

### Chart Container Styling

```typescript
{
  background: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '0px',       // Square corners (no rounding)
  padding: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '400px'
}
```

### Chart Height

```typescript
{
  width: '100%',
  height: 280,              // Fixed height
  marginBottom: '15px'      // Space before legend
}
```

---

## Feature Gating

### StFr Bank Exception

The login chart is hidden for StFr bank:

```typescript
const showLoginDiv = tenant?.resourceId !== 'StFr';

if (showLoginDiv) {
  // Render login chart
} else {
  // Skip login chart
}
```

This is controlled by the `TenantContext` which provides tenant information.

---

## Common Tasks

### Changing Colors

**File:** `src/components/LoginTrendChart.tsx` or `src/components/EnrollmentTrendChart.tsx`

```typescript
// In series configuration
lineStyle: { color: '#NEWCOLOR', width: 2 }
itemStyle: { color: '#NEWCOLOR' }

// In legend
backgroundColor: '#NEWCOLOR'  // Colored dot
```

### Adding Additional Days of Data

No code changes needed. The date range is calculated automatically in `getDateRange()`:

```typescript
// Change this line to adjust the number of days:
const startDate = new Date(endDate.getTime() - DAYS * 86400000);
```

### Modifying Axis Label Spacing

**File:** `src/components/LoginTrendChart.tsx` or `EnrollmentTrendChart.tsx`

```typescript
nameGap: 50,        // Increase to add more space
nameLocation: 'middle'  // 'middle', 'start', or 'end'
```

### Changing Grid Margins

```typescript
grid: {
  left: 60,     // Left margin (for Y-axis labels)
  right: 60,    // Right margin (for right Y-axis)
  top: 10,      // Top margin
  bottom: 40    // Bottom margin (for X-axis labels and date)
}
```

---

## Troubleshooting

### Charts Not Rendering

1. **Check browser console for errors**
   - Open DevTools (F12)
   - Look for red errors in Console tab

2. **Verify data is being fetched**
   - Check Network tab in DevTools
   - Ensure API endpoints return 200 status
   - Verify response data structure matches expectations

3. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Axis Labels Not Showing

Ensure `show: true` is set in axisLabel configuration:

```typescript
axisLabel: { show: true, fontSize: 12, color: '#666' }
```

### Tooltip Not Appearing

Verify tooltip configuration is present:

```typescript
tooltip: {
  trigger: 'axis',
  formatter: (params: any) => { /* ... */ }
}
```

### Chart Instance Disposed Error

This warning is normal during hot module reload (HMR). The chart is automatically disposed and recreated. If it persists, refresh the page.

### Session Timeout Not Redirecting

Verify session timeout check in `DashboardPage.tsx`:

```typescript
if (data.status === '1000') {
  window.location.href = '/session-timeout';
}
```

---

## Performance Considerations

1. **Chart Instance Cleanup**
   - Charts are disposed on unmount
   - Window resize listeners are removed
   - No memory leaks

2. **Responsive Resizing**
   - Charts resize automatically on window resize
   - Debouncing prevents excessive re-renders

3. **Data Loading**
   - Both API calls happen in parallel on component mount
   - Errors in one chart don't block the other

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Apache ECharts v5.5.0 requires modern browsers with ES6 support.

