/**
 * Date formatting utilities
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format enrollment date to MMM/dd/YYYY HH:MM:SS AM/PM format
 * Input formats supported:
 *   - "01/05/2016 08:26:07 AM PST" → "Jan/05/2016 08:26:07 AM"
 *   - "Jan 5, 2016 at 08:26:07 AM PST" → "Jan/05/2016 08:26:07 AM"
 *
 * Note: Timezone is returned separately and will be appended in the UI
 */
export function formatEnrollmentDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;

  try {
    // Handle numeric date format: "01/05/2016 08:26:07 AM PST"
    const numericMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2}:\d{2}\s+[AP]M)/);
    if (numericMatch) {
      const [, month, day, year, time] = numericMatch;
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) return null;
      return `${MONTHS[monthNum - 1]}/${day}/${year} ${time}`;
    }

    // Handle text date format: "Jan 5, 2016 at 08:26:07 AM PST"
    const textMatch = dateStr.match(/^([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})\s+at\s+(\d{2}:\d{2}:\d{2}\s+[AP]M)/);
    if (textMatch) {
      const [, month, day, year, time] = textMatch;
      const paddedDay = day.padStart(2, '0');
      return `${month}/${paddedDay}/${year} ${time}`;
    }

    return null;
  } catch {
    return null;
  }
}
