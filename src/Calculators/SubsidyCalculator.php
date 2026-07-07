<?php

namespace Calculators;

use Core\ICalculator;
use Data\SubsidyRates;

class SubsidyCalculator implements ICalculator {
    public function calculate(array $params): array {
        $rooftopArea = (float)($params['rooftopAreaSqft'] ?? 0);
        $sanctionedLoad = (float)($params['sanctionedLoadKw'] ?? 0);
        $monthlyBill = (float)($params['monthlyBillINR'] ?? 0);
        $stateSlug = (string)($params['stateSlug'] ?? '');
        $years = (int)($params['years'] ?? 25);

        $systemSizeKw = $this->calculateSystemSize($rooftopArea, $sanctionedLoad, $monthlyBill);
        $centralSubsidyINR = $this->calculateCentralSubsidy($systemSizeKw);
        $stateSubsidyINR = $this->calculateStateSubsidy($systemSizeKw, $stateSlug);
        $totalSubsidyINR = $this->calculateTotalSubsidy($centralSubsidyINR, $stateSubsidyINR);

        $systemCostINR = $this->calculateSystemCost($systemSizeKw);
        $finalCostINR = $this->calculateFinalCost($systemCostINR, $totalSubsidyINR);

        $estimatedUnitsPerMonth = $this->calculateUnitsGeneratedPerMonth($systemSizeKw);
        $monthlySavingsINR = $this->calculateMonthlySavings($monthlyBill, $systemSizeKw);

        // Derive tariff used.
        $assumedUnits = $this->clamp(max($estimatedUnitsPerMonth, 120.0), 60.0, 1200.0);
        $estimatedTariffPerUnitINR = $this->clamp($monthlyBill / $assumedUnits, 3.0, 12.0);

        $paybackPeriodYears = $this->calculatePaybackPeriod($finalCostINR, $monthlySavingsINR);
        $lifetimeSavingsINR = $this->calculateLifetimeSavings($monthlySavingsINR, $years);
        $co2SavedTonnes = $this->calculateCO2Saved($systemSizeKw, $years);

        return [
            'systemSizeKw' => $systemSizeKw,
            'centralSubsidyINR' => $centralSubsidyINR,
            'stateSubsidyINR' => $stateSubsidyINR,
            'totalSubsidyINR' => $totalSubsidyINR,
            'systemCostINR' => $systemCostINR,
            'finalCostINR' => $finalCostINR,
            'estimatedUnitsPerMonth' => $estimatedUnitsPerMonth,
            'estimatedTariffPerUnitINR' => $this->roundTo($estimatedTariffPerUnitINR, 2),
            'monthlySavingsINR' => $monthlySavingsINR,
            'paybackPeriodYears' => $paybackPeriodYears,
            'lifetimeSavingsINR' => $lifetimeSavingsINR,
            'co2SavedTonnes' => $co2SavedTonnes
        ];
    }

    public function calculateSystemSize(float $rooftopArea, float $sanctionedLoad, float $monthlyBill): float {
        $areaBased = $rooftopArea > 0 ? $rooftopArea / 100.0 : 0.0;

        // Bill-based sizing
        $assumedTariff = $this->clamp($monthlyBill > 0 ? $monthlyBill / 375.0 : 8.0, 3.0, 12.0);
        $billBasedUnits = $monthlyBill > 0 ? $monthlyBill / $assumedTariff : 0.0;
        $billBased = $billBasedUnits > 0 ? $billBasedUnits / 120.0 : 0.0;

        $recommended = max($areaBased, $billBased);
        $cappedByLoad = $sanctionedLoad > 0 ? min($recommended, $sanctionedLoad) : $recommended;

        $kw = $cappedByLoad > 0 ? $cappedByLoad : 1.0;
        return $this->clamp($this->roundTo($kw, 1), 1.0, 10.0);
    }

    public function calculateCentralSubsidy(float $systemSizeKw): float {
        return SubsidyRates::calculateCentralSubsidy($systemSizeKw);
    }

    public function calculateStateSubsidy(float $systemSizeKw, string $stateSlug): float {
        return SubsidyRates::calculateStateSubsidy($systemSizeKw, $stateSlug);
    }

    public function calculateTotalSubsidy(float $central, float $state): float {
        return max(0.0, round($central + $state));
    }

    public function calculateSystemCost(float $systemSizeKw): float {
        $kw = $this->clamp($systemSizeKw, 0.0, 10000.0);
        return max(0.0, round($kw * 65000.0));
    }

    public function calculateFinalCost(float $systemCost, float $totalSubsidy): float {
        return max(0.0, round($systemCost - $totalSubsidy));
    }

    public function calculateMonthlySavings(float $monthlyBill, float $systemSizeKw): float {
        if ($monthlyBill <= 0 || $systemSizeKw <= 0) {
            return 0.0;
        }

        $generatedUnits = $this->calculateUnitsGeneratedPerMonth($systemSizeKw);
        $assumedUnits = $this->clamp(max($generatedUnits, 120.0), 60.0, 1200.0);
        $rawTariff = $monthlyBill / $assumedUnits;
        $tariff = $this->clamp($rawTariff, 3.0, 12.0);

        $savings = min($monthlyBill, $generatedUnits * $tariff);
        return max(0.0, round($savings));
    }

    public function calculatePaybackPeriod(float $finalCost, float $monthlySavings): float {
        if ($finalCost <= 0 || $monthlySavings <= 0) {
            return 0.0;
        }
        $annual = $monthlySavings * 12.0;
        if ($annual <= 0) {
            return 0.0;
        }
        return $this->roundTo($finalCost / $annual, 1);
    }

    public function calculateLifetimeSavings(float $monthlySavings, int $years = 25): float {
        if ($monthlySavings <= 0 || $years <= 0) {
            return 0.0;
        }
        $yrs = $this->clamp($years, 1, 100);
        return max(0.0, round($monthlySavings * 12.0 * $yrs));
    }

    public function calculateCO2Saved(float $systemSizeKw, int $years): float {
        if ($systemSizeKw <= 0 || $years <= 0) {
            return 0.0;
        }
        $kw = $this->clamp($systemSizeKw, 0.0, 10000.0);
        $yrs = $this->clamp($years, 1, 100);
        return $this->roundTo($kw * 1.5 * $yrs, 2);
    }

    public function calculateUnitsGeneratedPerMonth(float $systemSizeKw): float {
        if ($systemSizeKw <= 0) {
            return 0.0;
        }
        return max(0.0, $this->roundTo($systemSizeKw * 120.0, 0));
    }

    private function clamp(float $val, float $min, float $max): float {
        return min($max, max($min, $val));
    }

    private function roundTo(float $val, int $decimals): float {
        return round($val, $decimals);
    }
}
