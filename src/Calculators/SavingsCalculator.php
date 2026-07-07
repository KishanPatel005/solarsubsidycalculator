<?php

namespace Calculators;

use Core\ICalculator;

class SavingsCalculator implements ICalculator {
    public function calculate(array $params): array {
        $monthlyBill = (float)($params['monthlyBill'] ?? 0);
        $systemSize = (float)($params['systemSize'] ?? 0);
        $hoursPerDay = (float)($params['hoursPerDay'] ?? 5.5);
        $finalCost = (float)($params['finalCost'] ?? 0); // final cost or estimate

        $annualSavings = $this->calculateAnnualSavings($monthlyBill, $systemSize);
        $monthlySavings = (float)round($annualSavings / 12.0);
        $tenYearSavings = $annualSavings * 10.0;
        $twentyFiveYearSavings = $annualSavings * 25.0;
        $unitsPerYear = $this->calculateUnitsGenerated($systemSize, $hoursPerDay);

        // If final cost is not supplied, default to estimation: ₹65,000 per kW
        $cost = ($finalCost > 0) ? $finalCost : ($systemSize * 65000.0);
        $breakevenYear = $this->calculateBreakevenYear($cost, $annualSavings);
        $roi = $this->calculateROI($cost, $annualSavings);

        return [
            'monthlySavings' => $monthlySavings,
            'annualSavings' => $annualSavings,
            'tenYearSavings' => $tenYearSavings,
            'twentyFiveYearSavings' => $twentyFiveYearSavings,
            'unitsPerYear' => $unitsPerYear,
            'breakevenYear' => $breakevenYear,
            'roi' => $roi
        ];
    }

    public function calculateAnnualSavings(float $monthlyBill, float $systemSize): float {
        if ($monthlyBill <= 0 || $systemSize <= 0) {
            return 0.0;
        }

        $monthlyUnits = $systemSize * 120.0;
        $assumedUnits = min(1200.0, max(60.0, max($monthlyUnits, 120.0)));
        $tariff = min(12.0, max(3.0, $monthlyBill / $assumedUnits));

        $monthlySavings = min($monthlyBill, $monthlyUnits * $tariff);
        return (float)max(0.0, round($monthlySavings * 12.0));
    }

    public function calculateROI(float $systemCost, float $annualSavings): float {
        if ($systemCost <= 0 || $annualSavings <= 0) {
            return 0.0;
        }
        return round(($annualSavings / $systemCost) * 100.0, 1);
    }

    public function calculateUnitsGenerated(float $systemSize, float $hoursPerDay = 5.5): float {
        if ($systemSize <= 0) {
            return 0.0;
        }
        $hrs = min(10.0, max(0.0, $hoursPerDay));
        $annualUnits = $systemSize * $hrs * 30.0 * 12.0;
        return (float)max(0.0, round($annualUnits));
    }

    public function calculateBreakevenYear(float $finalCost, float $annualSavings): int {
        if ($finalCost <= 0 || $annualSavings <= 0) {
            return 0;
        }
        return (int)max(1, ceil($finalCost / $annualSavings));
    }
}
