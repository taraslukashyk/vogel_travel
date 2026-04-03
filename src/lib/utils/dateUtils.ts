/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY.
 * If the input doesn't match YYYY-MM-DD, it returns the input as-is.
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  
  // Case 1: YYYY-MM-DD (structured)
  const isoRegex = /^(\d{4})-(\d{2})-(\d{2})/;
  const isoMatch = dateStr.match(isoRegex);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  // Case 2: DD/MM (legacy)
  const legacyRegex = /^(\d{1,2})\/(\d{1,2})$/;
  const legacyMatch = dateStr.match(legacyRegex);
  if (legacyMatch) {
    const [, day, month] = legacyMatch;
    const d = day.padStart(2, '0');
    const m = month.padStart(2, '0');
    return `${d}/${m}/2026`;
  }
  
  return dateStr;
}

/**
 * Formats a date range.
 */
export function formatDateRange(from: string | undefined | null, to: string | undefined | null): string {
  const f = formatDate(from);
  const t = formatDate(to);
  
  if (f && t) return `${f} — ${t}`;
  if (f) return f;
  if (t) return t;
  return '';
}
