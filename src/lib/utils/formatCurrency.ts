function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Format a number using the Indian numbering system (lakh/crore grouping).
 *
 * Example:
 * - 1234567 -> "12,34,567"
 */
export function formatNumber(value: number): string {
  if (!isFiniteNumber(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  // Keep integers only for currency-like formatting; callers can format decimals separately if needed.
  const int = Math.round(abs);
  const s = String(int);

  if (s.length <= 3) return `${sign}${s}`;

  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const restWithCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${restWithCommas},${last3}`;
}

/**
 * Format amount as INR with rupee symbol.
 *
 * Example: 123456 -> "₹1,23,456"
 */
export function formatINR(amount: number): string {
  if (!isFiniteNumber(amount) || amount === 0) return "₹0";
  return `₹${formatNumber(amount)}`;
}

/**
 * Format amount in lakhs.
 *
 * Examples:
 * - 120000 -> "₹1.2L"
 * - 1200000 -> "₹12L"
 */
export function formatLakh(amount: number): string {
  if (!isFiniteNumber(amount) || amount === 0) return "₹0";

  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);

  const lakhs = abs / 100_000;
  const rounded =
    lakhs < 10 ? Math.round(lakhs * 10) / 10 : Math.round(lakhs);

  // Avoid trailing ".0"
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `₹${sign}${text}L`;
}

/**
 * Format amount compactly in lakh/crore.
 *
 * Rules:
 * - < 1 lakh: normal INR format
 * - < 1 crore: format lakh
 * - >= 1 crore: format crore (₹xCr)
 */
export function formatCompact(amount: number): string {
  if (!isFiniteNumber(amount) || amount === 0) return "₹0";

  const abs = Math.abs(amount);
  if (abs < 100_000) return formatINR(amount);

  if (abs < 10_000_000) return formatLakh(amount);

  const sign = amount < 0 ? "-" : "";
  const crores = abs / 10_000_000;
  const rounded = crores < 10 ? Math.round(crores * 10) / 10 : Math.round(crores);
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `₹${sign}${text}Cr`;
}

