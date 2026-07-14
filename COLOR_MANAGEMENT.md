# Color Management Guide

## Overview

All colors used throughout the Admin Console application are centrally managed in a single file: `src/constants/colors.ts`. This ensures:

✅ **Consistency** - Same colors used across all pages and components  
✅ **Maintainability** - Update colors globally by editing one file  
✅ **Scalability** - Easy to add new color schemes (light/dark theme)  
✅ **Documentation** - Colors are named and organized logically  

---

## Color File Structure

**Location:** `src/constants/colors.ts`

The file is organized into these main sections:

### 1. Chart Colors
Colors for dashboard chart visualizations:
- **Login Trend Chart**: No. of Logins (teal), Failed login % (red)
- **Enrollment Trend Chart**: New Enrollments (teal), Unenrollments (red)

```typescript
chartColors.loginTrend.noOfLogins      // #008C96 - Teal
chartColors.loginTrend.failedLogin     // #DC3545 - Red
chartColors.enrollmentTrend.newEnrollments  // #008C96 - Teal
chartColors.enrollmentTrend.unenrollments   // #DC3545 - Red
```

### 2. UI Colors
General interface colors (text, backgrounds, borders):

**Text Colors:**
```typescript
uiColors.text.primary          // #333 - Primary text (headings, body)
uiColors.text.secondary        // #666 - Secondary text (labels)
uiColors.text.muted            // #999 - Muted text (disabled)
uiColors.text.header           // #44505c - Header text
```

**Chart Styling:**
```typescript
uiColors.chart.background      // #ffffff - Chart background
uiColors.chart.border          // #e0e0e0 - Chart border
uiColors.chart.title           // #2c6aa0 - Chart title
```

**Background Colors:**
```typescript
uiColors.background.page       // #f5f6f8 - Page background
uiColors.background.card       // #ffffff - Card background
uiColors.background.hover      // #f2f4f7 - Hover state
```

**Border & Grid:**
```typescript
uiColors.border.default        // #ddd - Default border
uiColors.grid.axisLine         // #ddd - Chart axis lines
uiColors.grid.splitLine        // #f0f0f0 - Chart grid lines
```

**Alert Colors:**
```typescript
uiColors.alert.background      // #f8d7da - Alert background
uiColors.alert.border          // #f5c6cb - Alert border
uiColors.alert.text            // #721c24 - Alert text
```

**Navigation/Sidebar:**
```typescript
uiColors.sidebar.text          // #5f6b7a - Inactive nav text
uiColors.sidebar.textActive    // #fff - Active nav text
uiColors.sidebar.brand         // #22457f - Brand color
```

### 3. Tooltip Colors
```typescript
tooltipColors.background       // rgba(0, 0, 0, 0.8)
tooltipColors.text             // #fff
```

### 4. Form Colors
Input fields, validation states:
```typescript
formColors.inputBackground     // #fff
formColors.inputBorder         // #ddd
formColors.errorBackground     // #f8d7da
formColors.errorText           // #721c24
formColors.successText         // #3c763d
formColors.warningBackground   // #fcf8e3
```

### 5. Button Colors
```typescript
buttonColors.primary           // #2c6aa0
buttonColors.danger            // #c0392b
buttonColors.success           // #2e7d32
```

### 6. Loader Colors
```typescript
loaderColors.border            // #d5d9df
loaderColors.activeBorder      // #2c6aa0
```

---

## Files Using Centralized Colors

✅ **src/pages/DashboardPage.tsx** - Dashboard page colors  
✅ **src/components/LoginTrendChart.tsx** - Login chart colors  
✅ **src/components/EnrollmentTrendChart.tsx** - Enrollment chart colors  
✅ **src/layouts/DashboardLayout.tsx** - Navigation and sidebar colors  
✅ **src/main.tsx** - Global page background and text colors  
✅ **src/styles/sx.ts** - Shared style colors (spinner, forms, etc.)  

---

## How to Update Colors

### Global Color Change

To change a color globally, simply update the value in `src/constants/colors.ts`:

**Before:**
```typescript
export const uiColors = {
  text: {
    primary: '#333',  // Dark gray
  }
}
```

**After:**
```typescript
export const uiColors = {
  text: {
    primary: '#000',  // Black
  }
}
```

All components using `uiColors.text.primary` will automatically use the new color.

### Adding New Colors

Add new colors to the appropriate section in `colors.ts`:

```typescript
export const uiColors = {
  // ... existing colors ...
  
  customStatus: {
    pending: '#FFA500',    // Orange
    active: '#00AA00',     // Green
    inactive: '#CCCCCC',   // Gray
  }
}
```

Then import and use in your component:

```typescript
import { uiColors } from '../constants/colors';

// Use in component
sx={{ color: uiColors.customStatus.pending }}
```

---

## Color Naming Convention

Colors are named semantically based on their purpose:

- **text.*** - Text colors
- **background.*** - Background colors  
- **border.*** - Border colors
- **grid.*** - Chart grid colors
- **alert.*** - Alert/warning colors
- **sidebar.*** - Navigation colors
- **chart.*** - Chart-specific colors
- **form.*** - Form input colors
- **button.*** - Button colors
- **loader.*** - Loading spinner colors

---

## Theme Support (Future)

The color management system is designed to support multiple themes in the future:

```typescript
export const themes = {
  light: { /* light theme colors */ },
  dark: { /* dark theme colors (to be added) */ }
}
```

To implement dark mode later, simply:
1. Define `themes.dark` color palette in `colors.ts`
2. Add theme provider context
3. Switch colors based on active theme

---

## Color Accessibility

All colors used in the application meet WCAG accessibility standards:

- **Contrast Ratios**: Text colors have sufficient contrast against backgrounds
- **Color Blind Safe**: Charts use both color and distinct shapes for identification
- **High Contrast**: Key UI elements are distinguishable in high-contrast mode

---

## Quick Reference

| Purpose | Color | Variable |
|---------|-------|----------|
| Primary Text | #333 | `uiColors.text.primary` |
| Secondary Text | #666 | `uiColors.text.secondary` |
| Chart Border | #e0e0e0 | `uiColors.chart.border` |
| Chart Title | #2c6aa0 | `uiColors.chart.title` |
| Page Background | #f5f6f8 | `uiColors.background.page` |
| Card Background | #ffffff | `uiColors.background.card` |
| Alert Background | #f8d7da | `uiColors.alert.background` |
| Nav Text Active | #fff | `uiColors.sidebar.textActive` |
| Nav Text Inactive | #5f6b7a | `uiColors.sidebar.text` |
| Teal (Charts) | #008C96 | `chartColors.*.noOfLogins` |
| Red (Charts) | #DC3545 | `chartColors.*.failedLogin` |

---

## Best Practices

1. **Always use named colors** from `colors.ts` instead of hardcoding hex values
2. **Import only what you need**: `import { uiColors } from '../constants/colors'`
3. **Use semantic names**: Choose names that describe the purpose, not just the color
4. **Group related colors**: Keep similar colors together (all text colors, all backgrounds)
5. **Document custom colors**: If adding new colors, add comments explaining their purpose
6. **Test accessibility**: Verify color contrasts and colorblind visibility

---

## Support

For questions or to add new color categories, refer to `src/constants/colors.ts` or check recent commits in the git history.
