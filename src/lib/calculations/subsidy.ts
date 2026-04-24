import { subsidyRates2026, calculateCentralSubsidyINR } from "@/lib/data/subsidyRates";

/**
 * Output of subsidy/cost/savings calculations.
 */
export interface SubsidyResult {
  systemSizeKw: number;

  centralSubsidyINR: number;
  stateSubsidyINR: number;
  totalSubsidyINR: number;

  systemCostINR: number;
  finalCostINR: number;

  estimatedUnitsPerMonth: number;
  estimatedTariffPerUnitINR: number;
  monthlySavingsINR: number;

  paybackPeriodYears: number;
  lifetimeSavingsINR: number;
  co2SavedTonnes: number;
}

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
 * Estimate recommended system size (kW) using simple heuristics.
 *
 * Logic (as requested):
 * - 1 kW per 100 sqft rooftop area
 * - also consider bill-based sizing using typical India generation (~120 units/month per kW)
 * - cap at sanctioned load (kW)
 * - min 1 kW, max 10 kW
 *
 * Notes:
 * - If rooftopArea is missing/invalid, falls back to 1 kW.
 * - For bill-based sizing, we infer a tariff (₹/unit) using a conservative range (₹3–₹12).
 */
export function calculateSystemSize(
  rooftopArea: number,
  sanctionedLoad: number,
  monthlyBill: number
): number {
  const area = isFiniteNumber(rooftopArea) ? rooftopArea : 0;
  const load = isFiniteNumber(sanctionedLoad) ? sanctionedLoad : 0;
  const bill = isFiniteNumber(monthlyBill) ? monthlyBill : 0;

  const areaBased = area > 0 ? area / 100 : 0;

  // Bill-based: estimate monthly units from bill, infer tariff and size to offset similar units.
  // Clamp tariff to ₹3–₹12 per unit.
  const assumedTariff = clamp(bill > 0 ? bill / 375 : 8, 3, 12); // 375 units ~= ₹3000 at ₹8/unit
  const billBasedUnits = bill > 0 ? bill / assumedTariff : 0;
  const billBased = billBasedUnits > 0 ? billBasedUnits / 120 : 0;

  const recommended = Math.max(areaBased, billBased);
  const cappedByLoad = load > 0 ? Math.min(recommended, load) : recommended;

  const kw = cappedByLoad > 0 ? cappedByLoad : 1;
  return clamp(roundTo(kw, 1), 1, 10);
}

/**
 * Calculate the central subsidy for a given system size (kW).
 *
 * Logic (as requested, based on `subsidyRates2026.central`):
 * - up to 2 kW: ₹30,000 per kW
 * - 3rd kW: +₹18,000
 * - max: ₹78,000
 */
export function calculateCentralSubsidy(systemSize: number): number {
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;
  return calculateCentralSubsidyINR(systemSize);
}

/**
 * Calculate additional state subsidy (if available in dataset).
 *
 * Logic:
 * - Look up in `subsidyRates2026.stateAdditional` by `stateSlug`.
 * - If not found OR no amount is present, return 0.
 * - If per-kW: multiply by systemSize and apply maxCap if present.
 * - If flat: return flat (apply maxCap if present).
 */
export function calculateStateSubsidy(systemSize: number, stateSlug: string): number {
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;
  if (typeof stateSlug !== "string" || !stateSlug.trim()) return 0;

  const entry = subsidyRates2026.stateAdditional.find((s) => s.stateSlug === stateSlug);
  const amount = entry?.additionalSubsidyAmount;
  if (!amount) return 0;

  const maxCap = isFiniteNumber(amount.maxCap) ? amount.maxCap : undefined;

  if (isFiniteNumber(amount.perKw)) {
    const raw = amount.perKw * systemSize;
    const capped = typeof maxCap === "number" ? Math.min(raw, maxCap) : raw;
    return Math.max(0, Math.round(capped));
  }

  if (isFiniteNumber(amount.flat)) {
    const raw = amount.flat;
    const capped = typeof maxCap === "number" ? Math.min(raw, maxCap) : raw;
    return Math.max(0, Math.round(capped));
  }

  return 0;
}

/**
 * Total subsidy = central + state (non-negative).
 */
export function calculateTotalSubsidy(centralSubsidy: number, stateSubsidy: number): number {
  const c = isFiniteNumber(centralSubsidy) ? centralSubsidy : 0;
  const s = isFiniteNumber(stateSubsidy) ? stateSubsidy : 0;
  return Math.max(0, Math.round(c + s));
}

/**
 * Estimate installed system cost in India (2026 heuristic).
 *
 * Logic (as requested): avg ₹65,000 per kW.
 */
export function calculateSystemCost(systemSize: number): number {
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;
  const kw = clamp(systemSize, 0, 10_000);
  return Math.max(0, Math.round(kw * 65_000));
}

/**
 * Final cost after subsidy, clamped to >= 0.
 */
export function calculateFinalCost(systemCost: number, totalSubsidy: number): number {
  const cost = isFiniteNumber(systemCost) ? systemCost : 0;
  const subsidy = isFiniteNumber(totalSubsidy) ? totalSubsidy : 0;
  return Math.max(0, Math.round(cost - subsidy));
}

/**
 * Monthly savings estimate.
 *
 * Logic:
 * - 1 kW generates ~120 units/month.
 * - Estimate a tariff per unit from current bill: \(tariff = monthlyBill / monthlyUnits\).
 *   Without consumption data, assume typical 2026 residential usage of ~120 units per 1 kW equivalent.
 * - Savings = min(generatedUnits, assumedMonthlyUnits) * tariff.
 *
 * Edge cases:
 * - If monthlyBill <= 0, savings is 0.
 */
export function calculateMonthlySavings(monthlyBill: number, systemSize: number): number {
  if (!isFiniteNumber(monthlyBill) || monthlyBill <= 0) return 0;
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;

  const generatedUnits = calculateUnitsGeneratedPerMonth(systemSize);

  // Heuristic for baseline monthly units derived from bill:
  // We need a tariff to convert units → INR. Without usage, assume a reasonable tariff floor/ceiling.
  // Infer tariff from bill using a typical usage band; clamp tariff to ₹3–₹12 per unit.
  const assumedUnits = clamp(Math.max(generatedUnits, 120), 60, 1200);
  const rawTariff = monthlyBill / assumedUnits;
  const tariff = clamp(isFiniteNumber(rawTariff) ? rawTariff : 0, 3, 12);

  // Savings can't exceed current bill in this simplified model.
  const savings = Math.min(monthlyBill, generatedUnits * tariff);
  return Math.max(0, Math.round(savings));
}

/**
 * Payback period (years).
 *
 * Logic:
 * - years = finalCost / (monthlySavings * 12)
 * - rounded to 1 decimal
 * - returns 0 if inputs invalid or savings is 0.
 */
export function calculatePaybackPeriod(finalCost: number, monthlySavings: number): number {
  if (!isFiniteNumber(finalCost) || finalCost <= 0) return 0;
  if (!isFiniteNumber(monthlySavings) || monthlySavings <= 0) return 0;

  const annual = monthlySavings * 12;
  if (annual <= 0) return 0;

  return roundTo(finalCost / annual, 1);
}

/**
 * Lifetime savings over N years.
 *
 * Default: 25 years.
 */
export function calculateLifetimeSavings(monthlySavings: number, years: number = 25): number {
  if (!isFiniteNumber(monthlySavings) || monthlySavings <= 0) return 0;
  const y = isFiniteNumber(years) ? years : 25;
  const yrs = clamp(Math.floor(y), 1, 100);
  return Math.max(0, Math.round(monthlySavings * 12 * yrs));
}

/**
 * CO2 saved (tonnes) over N years.
 *
 * Logic (as requested):
 * - 1 kW solar saves ~1.5 tonnes CO2/year (India grid avg)
 */
export function calculateCO2Saved(systemSize: number, years: number): number {
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;
  if (!isFiniteNumber(years) || years <= 0) return 0;

  const kw = clamp(systemSize, 0, 10_000);
  const yrs = clamp(Math.floor(years), 1, 100);
  return roundTo(kw * 1.5 * yrs, 2);
}

/**
 * Helper: estimated monthly units generation using 120 units/month per kW.
 */
export function calculateUnitsGeneratedPerMonth(systemSize: number): number {
  if (!isFiniteNumber(systemSize) || systemSize <= 0) return 0;
  return Math.max(0, roundTo(systemSize * 120, 0));
}

/**
 * Convenience: run full calculation bundle and return a structured result.
 */
export function calculateSubsidyResult(params: {
  rooftopAreaSqft: number;
  sanctionedLoadKw: number;
  monthlyBillINR: number;
  stateSlug: string;
  years?: number;
}): SubsidyResult {
  const systemSizeKw = calculateSystemSize(
    params.rooftopAreaSqft,
    params.sanctionedLoadKw,
    params.monthlyBillINR
  );

  const centralSubsidyINR = calculateCentralSubsidy(systemSizeKw);
  const stateSubsidyINR = calculateStateSubsidy(systemSizeKw, params.stateSlug);
  const totalSubsidyINR = calculateTotalSubsidy(centralSubsidyINR, stateSubsidyINR);

  const systemCostINR = calculateSystemCost(systemSizeKw);
  const finalCostINR = calculateFinalCost(systemCostINR, totalSubsidyINR);

  const estimatedUnitsPerMonth = calculateUnitsGeneratedPerMonth(systemSizeKw);
  const monthlySavingsINR = calculateMonthlySavings(params.monthlyBillINR, systemSizeKw);

  // Derive tariff used (same as calculateMonthlySavings logic, but exposed).
  const assumedUnits = clamp(Math.max(estimatedUnitsPerMonth, 120), 60, 1200);
  const estimatedTariffPerUnitINR = clamp(params.monthlyBillINR / assumedUnits, 3, 12);

  const paybackPeriodYears = calculatePaybackPeriod(finalCostINR, monthlySavingsINR);
  const yrs = isFiniteNumber(params.years) ? params.years : 25;
  const lifetimeSavingsINR = calculateLifetimeSavings(monthlySavingsINR, yrs);
  const co2SavedTonnes = calculateCO2Saved(systemSizeKw, yrs);

  return {
    systemSizeKw,
    centralSubsidyINR,
    stateSubsidyINR,
    totalSubsidyINR,
    systemCostINR,
    finalCostINR,
    estimatedUnitsPerMonth,
    estimatedTariffPerUnitINR: roundTo(estimatedTariffPerUnitINR, 2),
    monthlySavingsINR,
    paybackPeriodYears,
    lifetimeSavingsINR,
    co2SavedTonnes,
  };
}

