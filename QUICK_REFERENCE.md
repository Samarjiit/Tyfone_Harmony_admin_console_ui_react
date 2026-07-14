# Apache ECharts Dashboard - Quick Reference

Quick command reference for developers.

## Setup & Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

## Project Files

| File | Purpose |
|------|---------|
| `src/pages/DashboardPage.tsx` | Main dashboard container |
| `src/components/LoginTrendChart.tsx` | Dual-axis login chart |
| `src/components/EnrollmentTrendChart.tsx` | Single-axis enrollment chart |
| `src/context/AuthContext.ts` | User authentication |
| `src/context/TenantContext.ts` | Tenant/bank info |
| `src/services/http.ts` | API client (Axios) |

## API Endpoints

```
GET /get_dashboard_login_trend?from=START&to=END&memberType=ALL
GET /get_dashboard_enrollment_trend?from=START&to=END&memberType=ALL
```

Date format: `YYYY-MM-DDTHH:MM:SS`

## Chart Configuration Checklist

- [x] Dual Y-axes for login chart (left: logins, right: failed %)
- [x] Single Y-axis for enrollment chart
- [x] Teal (#008C96) and Red (#DC3545) colors
- [x] Y-axes start from 0 (min: 0)
- [x] Axis names displayed (No. of Logins, Failed login %, Date)
- [x] Tooltip shows date + series values
- [x] Legend below each chart with colored dots
- [x] Responsive grid layout (2 columns)
- [x] White background with subtle border (#e0e0e0)

## Common Configuration Values

```typescript
// Colors
logins: '#008C96'           // Teal
failures: '#DC3545'         // Red

// Grid margins (in pixels)
left: 60, right: 60, top: 10, bottom: 40

// Font sizes
axisLabel: 12px
axisName: 12px
title: 16px (fontWeight: 600)

// Spacing
chartHeight: 280px
margin: 30px (between charts)
padding: 20px (inside containers)
```

## State Management

### DashboardPage Component State

```typescript
const [loginLoading, setLoginLoading] = useState(true)
const [enrollmentLoading, setEnrollmentLoading] = useState(true)
const [loginError, setLoginError] = useState('')
const [enrollmentError, setEnrollmentError] = useState('')
const [loginData, setLoginData] = useState<DashboardResponse | null>(null)
const [enrollmentData, setEnrollmentData] = useState<DashboardResponse | null>(null)
```

### Feature Gating

```typescript
const showLoginDiv = tenant?.resourceId !== 'StFr'
// Login chart hidden for StFr bank
```

## Error Handling Flow

1. **Session Timeout** (status === "1000")
   - Redirect to `/session-timeout`

2. **Permission Denied** (status includes "403")
   - Show error message in alert box

3. **Other Errors**
   - Display user-friendly message
   - Allow user to retry

4. **No Data**
   - Show error: "There is no [login/enrollment] data to show."

## Debugging Tips

1. **Check API response**
   ```bash
   # Browser DevTools > Network tab
   # Look for /get_dashboard_login_trend and /get_dashboard_enrollment_trend
   # Verify response status is 200 and status field is "0"
   ```

2. **Verify data structure**
   ```typescript
   console.log(loginData);  // Should have: validLoginsData, failedLoginsData, finalDates
   console.log(enrollmentData);  // Should have: newEnrollmentData, unEnrollmentData, finalDates
   ```

3. **Check chart instance**
   ```javascript
   // In browser console
   console.log(echarts.getInstanceByDom(chartRef.current))
   ```

4. **View ECharts warnings**
   - Check browser console for "[ECharts]" messages

## Styling Customization

### Change Colors

Edit in LoginTrendChart.tsx or EnrollmentTrendChart.tsx:

```typescript
lineStyle: { color: '#YOURCOLOR', width: 2 }
itemStyle: { color: '#YOURCOLOR' }
```

### Change Chart Height

Edit in component's Box sx prop:

```typescript
height: 320,  // Change from 280
```

### Change Grid Margins

Edit in chart option:

```typescript
grid: { left: 80, right: 80, top: 15, bottom: 45 }
```

## Browser DevTools

### Console Logs
- Look for "[ECharts] Instance ... has been disposed" during hot reload (normal)
- Check for network errors from API calls

### Network Tab
- Verify API calls complete with 200 status
- Check response payload structure
- Monitor for slow requests

### Performance
- Check Component render times
- Verify chart resize handler doesn't spam

## Dependencies

```json
{
  "echarts": "^5.5.0",           // Chart library
  "react": "^18.3.1",            // UI framework
  "@mui/material": "^9.2.0",     // Components
  "axios": "^1.7.7",             // HTTP client
  "react-router-dom": "^6.28.0"  // Navigation
}
```

## Environment

- **Node.js**: 16+ (check with `node --version`)
- **npm**: 8+ (check with `npm --version`)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## URLs

| Page | URL |
|------|-----|
| Dashboard | `/dashboard` |
| Session Timeout | `/session-timeout` |
| Dev Server | `http://localhost:3000` |

## Notes

- Date range is auto-calculated as last 7 days
- Both API calls run in parallel
- Charts resize automatically on window resize
- No chart data caching (fresh data on each page load)
- Component cleanup prevents memory leaks

