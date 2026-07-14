/**
 * Centralized color management for the entire application
 * All colors used across all pages, components, and layouts are defined here
 * Update these values to change colors globally across the app
 */

/* ========== Base Color Palette ========== */
const PALETTE = {
  // Primary colors
  teal: '#008C96',
  darkTeal: '#2c6aa0',
  brandBlue: '#22457f',
  red: '#DC3545',
  darkRed: '#c0392b',
  green: '#2e7d32',

  // Grays
  white: '#ffffff',
  black: '#1d1d1d',
  dark: '#333',
  text: '#666',
  textMuted: '#999',
  textLight: '#777',
  textHeader: '#44505c',
  navText: '#5f6b7a',

  // Light grays
  border: '#ddd',
  borderLight: '#dee2e6',
  borderLighter: '#e6e6e6',
  divider: '#d9dde2',
  gridLine: '#e0e0e0',
  gridSplit: '#f0f0f0',

  // Background
  bgPage: '#f5f6f8',
  bgHover: '#f2f4f7',
  bgLight: '#eef1f4',
  bgInfo: '#faebcc',

  // Status colors
  errorBg: '#f8d7da',
  errorBorder: '#f5c6cb',
  errorText: '#721c24',
  successBg: '#dff0d8',
  successBorder: '#d6e9c6',
  successText: '#3c763d',
  warningBg: '#fcf8e3',
  warningBorder: '#faebcc',
  warningText: '#8a6d3b',

  // Utility
  loaderBorder: '#d5d9df',
  tooltipBg: 'rgba(0, 0, 0, 0.8)',
} as const;

/* ========== Chart Colors ========== */
export const chartColors = {
  loginTrend: {
    noOfLogins: PALETTE.teal,
    failedLogin: PALETTE.red,
  },
  enrollmentTrend: {
    newEnrollments: PALETTE.teal,
    unenrollments: PALETTE.red,
  },
} as const;

/* ========== UI Colors ========== */
export const uiColors = {
  text: {
    primary: PALETTE.dark,
    secondary: PALETTE.text,
    muted: PALETTE.textMuted,
    light: PALETTE.textLight,
    dark: PALETTE.black,
    header: PALETTE.textHeader,
  },
  chart: {
    border: PALETTE.gridLine,
    background: PALETTE.white,
    title: PALETTE.darkTeal,
  },
  grid: {
    axisLine: PALETTE.border,
    splitLine: PALETTE.gridSplit,
  },
  alert: {
    background: PALETTE.errorBg,
    border: PALETTE.errorBorder,
    text: PALETTE.errorText,
  },
  background: {
    page: PALETTE.bgPage,
    card: PALETTE.white,
    hover: PALETTE.bgHover,
    light: PALETTE.bgLight,
    lighter: PALETTE.bgInfo,
  },
  border: {
    default: PALETTE.border,
    light: PALETTE.borderLight,
    lighter: PALETTE.borderLighter,
    divider: PALETTE.divider,
  },
  sidebar: {
    text: PALETTE.navText,
    textActive: PALETTE.white,
    brand: PALETTE.brandBlue,
  },
} as const;

/* ========== Tooltip Colors ========== */
export const tooltipColors = {
  background: PALETTE.tooltipBg,
  text: PALETTE.white,
} as const;

/* ========== Form and Input Colors ========== */
export const formColors = {
  inputBackground: PALETTE.white,
  inputBorder: PALETTE.border,
  inputText: PALETTE.dark,
  focusOutline: PALETTE.darkTeal,
  errorBackground: PALETTE.errorBg,
  errorBorder: PALETTE.errorBorder,
  errorText: PALETTE.errorText,
  successBackground: PALETTE.successBg,
  successBorder: PALETTE.successBorder,
  successText: PALETTE.successText,
  warningBackground: PALETTE.warningBg,
  warningBorder: PALETTE.warningBorder,
  warningText: PALETTE.warningText,
} as const;

/* ========== Button Colors ========== */
export const buttonColors = {
  primary: PALETTE.darkTeal,
  primaryHover: PALETTE.brandBlue,
  secondary: '#6c757d',
  danger: PALETTE.darkRed,
  success: PALETTE.green,
  text: PALETTE.white,
} as const;

/* ========== Spinner/Loader Colors ========== */
export const loaderColors = {
  border: PALETTE.loaderBorder,
  activeBorder: PALETTE.darkTeal,
} as const;

/**
 * Get color by chart and metric type
 */
export function getChartColor(
  chartType: 'login' | 'enrollment',
  metricType: 'primary' | 'secondary'
): string {
  const charts = {
    login: [chartColors.loginTrend.noOfLogins, chartColors.loginTrend.failedLogin],
    enrollment: [chartColors.enrollmentTrend.newEnrollments, chartColors.enrollmentTrend.unenrollments],
  };
  return charts[chartType][metricType === 'primary' ? 0 : 1];
}

/**
 * Color palette for easy access to all colors
 */
export const colorPalette = {
  ...PALETTE,
  ...uiColors,
  ...chartColors,
  ...formColors,
  ...buttonColors,
  ...loaderColors,
} as const;

/**
 * Theme configuration for future multi-theme support
 */
export const themes = {
  light: colorPalette,
} as const;

// Type exports for TypeScript usage
export type UIColor = typeof uiColors;
export type ChartColor = typeof chartColors;
export type FormColor = typeof formColors;
export type ButtonColor = typeof buttonColors;
