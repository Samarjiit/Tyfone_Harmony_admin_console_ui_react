/**
 * Navigation + header-search spec — verbatim transcription of
 * WEB-INF/views/others/sidebar.jsp and header/header.jsp.
 *
 * Every item carries the numeric feature id from the JSP (`<li id="101">`);
 * an item is visible when that id is in the session `features` set — the
 * exact rule the JSP sidebar JS applies (`feature: null` = no gate).
 * Labels come from properties/labels/masterlabels.properties.
 */

export interface NavChild {
  label: string;
  feature: number | null;
  route: string;
}

export interface NavSection {
  label: string;
  feature: number | null;
  icon:
    | 'home'
    | 'users'
    | 'th-list'
    | 'table'
    | 'pencil-square'
    | 'list'
    | 'desktop'
    | 'user'
    | 'question';
  route?: string;
  /** collapse-group id from the JSP (data-target) — doubles as React key */
  id: string;
  children?: NavChild[];
  /** open in a new tab, like helpDocsTag target="_blank" */
  newTab?: boolean;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'home', label: 'Home', feature: 200, icon: 'home', route: '/dashboard' },
  {
    id: 'member_search',
    label: 'Manage Members',
    feature: 100,
    icon: 'users',
    children: [
      { label: 'Search for a Member', feature: 101, route: '/search_for_member' },
      { label: 'Search for a Transaction', feature: 115, route: '/search_member_transactions' },
      { label: 'Pre-Enrolled Block', feature: 305, route: '/preenrolled_members' },
      { label: 'Enrollment Blacklist Members', feature: 301, route: '/blocked_members' },
      { label: 'Locked Members', feature: 113, route: '/locked_members' },
      { label: 'Blocked Members', feature: 134, route: '/post_enrollment_blocked_members' },
      { label: 'Verification Pending Members', feature: 130, route: '/verif_pending_members' },
      { label: 'Blocked Members New', feature: 312, route: '/merged_blocked_members' }
    ]
  },
  {
    id: 'manage_business',
    label: 'Manage Businesses',
    feature: 710,
    icon: 'th-list',
    children: [
      { label: 'Search for a Business', feature: 712, route: '/search_for_business' },
      { label: 'Manage Labels', feature: 709, route: '/manageLabels' },
      { label: 'Add a New Business', feature: 711, route: '/addBusiness' },
      { label: 'Permission Templates', feature: 724, route: '/view_permission_templates' },
      { label: 'Role Templates', feature: 717, route: '/manage_view_role_templates' },
      { label: 'ACH Reversal Requests', feature: 746, route: '/get_ach_reversals' },
      { label: 'Treasury Management', feature: 751, route: '/get_treasury_operations_page' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    feature: 200,
    icon: 'table',
    children: [
      { label: 'User Report', feature: 219, route: '/user_new_report' },
      { label: 'Usage Report', feature: 220, route: '/usage_new_report' },
      { label: 'Summary', feature: 201, route: '/summary' },
      { label: 'Login Trend', feature: 202, route: '/get_overall_login_trend_report' },
      { label: 'Enrollment', feature: 203, route: '/enrollment_report' },
      { label: 'Feedback', feature: 209, route: '/rating_feedback' },
      { label: 'Transaction Details', feature: 205, route: '/transaction_details_report' },
      { label: 'Alerts', feature: 208, route: '/alert_report' },
      { label: 'Generate New Report', feature: 501, route: '/report_generation' },
      { label: 'View Scheduled Reports', feature: 503, route: '/view_scheduled_reports' },
      { label: 'View Generated Reports', feature: 505, route: '/view_generated_reports' },
      { label: 'View ACH Reports', feature: 819, route: '/view_ach_reports' },
      { label: 'View e-Notice Reports', feature: 825, route: '/view_enot_reports' },
      { label: 'View SRT Reports', feature: 826, route: '/view_srt_reports' },
      { label: 'View Business ACH Reports', feature: 861, route: '/view_business_ach_reports' }
    ]
  },
  {
    id: 'manage_administrator',
    label: 'Manage Administrators',
    feature: 400,
    icon: 'pencil-square',
    children: [
      { label: 'View/Edit Users', feature: 402, route: '/manage_user_admin' },
      { label: 'Admin Activity', feature: 409, route: '/search_admin_transactions' }
    ]
  },
  {
    id: 'manage_content',
    label: 'Manage Content',
    feature: 600,
    icon: 'list',
    children: [
      { label: 'Rates', feature: 601, route: '/upload_rates' },
      { label: 'FICO', feature: 637, route: '/fico_search_new' },
      { label: 'Tokenize', feature: 638, route: '/tokenize_list' },
      { label: 'Group', feature: 639, route: '/group_list' },
      { label: 'Banner Ads', feature: 603, route: '/banner_management' },
      { label: 'Static Content', feature: 608, route: '/upload_static_content' },
      { label: 'File Exchange', feature: 640, route: '/view_file_exchange' },
      { label: 'Notifications', feature: 609, route: '/notification_management' },
      { label: 'System Downtime', feature: 634, route: '/outage_system_downtime' },
      { label: 'Terms & Conditions', feature: 908, route: '/view_all_terms' },
      { label: 'Zelle UIP Override', feature: 913, route: '/zelle_uip_override' }
    ]
  },
  {
    id: 'manage_system',
    label: 'Manage System',
    feature: 900,
    icon: 'th-list',
    children: [
      { label: 'System Outages', feature: 621, route: '/view_all_outages' },
      { label: 'App Deprecation', feature: 613, route: '/app_deprecation_list' }
    ]
  },
  {
    id: 'launchpad',
    label: 'Digital Solutions Launchpad',
    feature: 255,
    icon: 'desktop',
    route: '/launchpad_sso'
  },
  { id: 'my_profile', label: 'Edit My Profile', feature: 4000, icon: 'user', route: '/my_profile' },
  {
    id: 'help_docs',
    label: 'Help Docs',
    feature: 4003,
    icon: 'question',
    route: '/help_docs',
    newTab: true
  }
];

/**
 * Header global-search criteria — the radio options in header.jsp's
 * #searchOptions panel, with their gating feature ids (the numeric CSS
 * classes on each label, e.g. class="radio-item 129").
 * "name" uses two inputs (first/last name) like the JSP.
 */
export interface SearchCriterion {
  value: string;
  label: string;
  feature: number | null;
  twoFields?: boolean;
  numeric?: boolean;
}

export const SEARCH_CRITERIA: SearchCriterion[] = [
  { value: 'username', label: 'User ID', feature: 129 },
  { value: 'name', label: 'Member Name', feature: 129, twoFields: true },
  { value: 'mobile', label: 'Phone Number', feature: 129, numeric: true },
  { value: 'member_number', label: 'Member Number (Exact Search)', feature: null },
  { value: 'ind_id', label: 'Individual ID', feature: 161 },
  { value: 'business_id', label: 'Business ID (Exact Search)', feature: 188 },
  { value: 'business_name', label: 'Business Name', feature: 188 },
  { value: 'label_name', label: 'Label Name', feature: 718 },
  { value: 'email', label: 'Email address', feature: 248 }
];

/**
 * Visibility rule with a skeleton-phase safety net: when the feature list
 * could not be parsed from the session (empty array), show everything so the
 * shell remains navigable. Once feature extraction is verified against every
 * role, drop the `features.length === 0` clause for strict JSP parity.
 */
export function isVisible(features: number[], id: number | null): boolean {
  return id === null || features.length === 0 || features.includes(id);
}
