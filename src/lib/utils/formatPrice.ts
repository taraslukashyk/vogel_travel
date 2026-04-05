/**
 * Formats a number as a price with space as thousands separator.
 * Example: 5678 -> "5 678"
 */
export const formatPrice = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null) return '0';
  
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '0';

  // We use 'en-US' then replace commas with spaces to get consistent 
  // grouping while satisfying the user's request for space delimiter.
  return num.toLocaleString('en-US').replace(/,/g, ' ');
};
