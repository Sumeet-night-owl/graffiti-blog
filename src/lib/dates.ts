const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parses `YYYY-MM-DD` as a calendar date at UTC midnight. Returns undefined for
 * malformed or impossible dates (e.g. 2026-02-30) instead of rolling them over.
 */
export function parseCalendarDate(value: string): Date | undefined {
  const match = ISO_DATE.exec(value.trim());
  if (!match) return undefined;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }
  return date;
}

const displayFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

/** Formats a calendar date in UTC so it never shows a day early in US time zones. */
export function formatDate(date: Date): string {
  return displayFormat.format(date);
}

/** `YYYY-MM-DD`, for `<time datetime>`. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
