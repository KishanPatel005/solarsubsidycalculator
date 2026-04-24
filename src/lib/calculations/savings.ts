function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, decimals: number): number {
  if (!isFiniteNumber(value)) return 0;
  const d = Math.max(0, Math.floor(decimals));
  const factor = 10 ** d;
  return Math.round(value * factor) / factor;
}

/**
 * Estimate annual savings from monthly bill and system size.
 *
 * Assumptions:
 * - 1 kW generates ~120 units/month
 * - Uses a simple tariff inference from bill; clamps tariff to ₹3–₹12/unit
 */
export function calculateAnnualSavings(monthlyBill: number, systemSize: number): number {
  if (!isFiniteNumber(monthlyBill) || monthlyBill <= 0) return 0;
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;

  const monthlyUnits = systemSize * 120;
  const assumedUnits = clamp(Math.max(monthlyUnits, 120), 60, 1200);
  const tariff = clamp(monthlyBill / assumedUnits, 3, 12);

  const monthlySavings = Math.min(monthlyBill, monthlyUnits * tariff);
  return Math.max(0, Math.round(monthlySavings * 12));
}

/**
 * ROI (%) = (annualSavings / systemCost) * 100
 */
export function calculateROI(systemCost: number, annualSavings: number): number {
  if (!isFiniteNumber(systemCost) || systemCost <= 0) return 0;
  if (!isFiniteNumber(annualSavings) || annualSavings <= 0) return 0;
  return roundTo((annualSavings / systemCost) * 100, 1);
}

/**
 * Calculate annual units generated.
 *
 * Default: 5.5 peak sun hours/day (India average).
 * Simple model: kW * hoursPerDay * 30 days * 12 months.
 */
export function calculateUnitsGenerated(systemSize: number, hoursPerDay: number = 5.5): number {
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;
  const h = isFiniteNumber(hoursPerDay) ? hoursPerDay : 5.5;
  const hrs = clamp(h, 0, 10);
  const annualUnits = systemSize * hrs * 30 * 12;
  return Math.max(0, Math.round(annualUnits));
}

/**
 * Breakeven year = ceil(finalCost / annualSavings), returned as number of years.
 * Returns 0 if annualSavings is 0 or inputs invalid.
 */
export function calculateBreakevenYear(finalCost: number, annualSavings: number): number {
  if (!isFiniteNumber(finalCost) || finalCost <= 0) return 0;
  if (!isFiniteNumber(annualSavings) || annualSavings <= 0) return 0;
  return Math.max(1, Math.ceil(finalCost / annualSavings));
}

