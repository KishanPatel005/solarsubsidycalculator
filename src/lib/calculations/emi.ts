/**
 * EMI (Equated Monthly Installment) calculation outputs.
 */
export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function roundMoney(value: number): number {
  if (!isFiniteNumber(value)) return 0;
  return Math.round(value);
}

/**
 * Calculate reducing-balance EMI.
 *
 * Formula:
 * \[
 * EMI = P \cdot r \cdot \frac{(1+r)^n}{(1+r)^n - 1}
 * \]
 * where:
 * - \(P\) = principal
 * - \(r\) = monthly interest rate (annualRate / 12 / 100)
 * - \(n\) = tenureMonths
 *
 * Edge cases:
 * - If rate is 0 → EMI = principal / tenureMonths
 * - Invalid/negative inputs → 0
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (!isFiniteNumber(principal) || principal <= 0) return 0;
  if (!isFiniteNumber(tenureMonths) || tenureMonths <= 0) return 0;
  if (!isFiniteNumber(annualRate) || annualRate < 0) return 0;

  const n = Math.floor(tenureMonths);
  const r = annualRate / 12 / 100;

  if (r === 0) return roundMoney(principal / n);

  const pow = (1 + r) ** n;
  const emi = principal * r * (pow / (pow - 1));
  return roundMoney(emi);
}

/**
 * Total payment over tenure (EMI * months).
 */
export function calculateTotalPayment(emi: number, tenureMonths: number): number {
  if (!isFiniteNumber(emi) || emi <= 0) return 0;
  if (!isFiniteNumber(tenureMonths) || tenureMonths <= 0) return 0;
  return roundMoney(emi * Math.floor(tenureMonths));
}

/**
 * Total interest paid = totalPayment - principal (clamped to >= 0).
 */
export function calculateTotalInterest(totalPayment: number, principal: number): number {
  const tp = isFiniteNumber(totalPayment) ? totalPayment : 0;
  const p = isFiniteNumber(principal) ? principal : 0;
  return Math.max(0, roundMoney(tp - p));
}

/**
 * Generate a month-by-month amortization schedule.
 *
 * Each entry includes:
 * - month
 * - emi
 * - principal component
 * - interest component
 * - remaining balance
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): AmortizationEntry[] {
  if (!isFiniteNumber(principal) || principal <= 0) return [];
  if (!isFiniteNumber(tenureMonths) || tenureMonths <= 0) return [];
  if (!isFiniteNumber(annualRate) || annualRate < 0) return [];

  const n = Math.floor(tenureMonths);
  const r = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, n);
  if (emi <= 0) return [];

  let balance = principal;
  const schedule: AmortizationEntry[] = [];

  for (let month = 1; month <= n; month += 1) {
    const interest = r === 0 ? 0 : balance * r;
    const principalComponent = Math.max(0, emi - interest);

    // On the last month, adjust to close the loan (avoid negative balance due to rounding).
    const actualPrincipal =
      month === n ? balance : Math.min(balance, principalComponent);
    balance = Math.max(0, balance - actualPrincipal);

    schedule.push({
      month,
      emi: roundMoney(emi),
      principal: roundMoney(actualPrincipal),
      interest: roundMoney(interest),
      balance: roundMoney(balance),
    });
  }

  return schedule;
}

/**
 * Convenience wrapper to compute EMI + totals.
 */
export function calculateEMIResult(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMIResult {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const totalPayment = calculateTotalPayment(emi, tenureMonths);
  const totalInterest = calculateTotalInterest(totalPayment, principal);
  return { emi, totalPayment, totalInterest };
}

