<?php

namespace Calculators;

use Core\ICalculator;

class KusumCalculator implements ICalculator {
    private $benchmarkCostByHp = [
        2 => 130000,
        3 => 172000,
        5 => 272000,
        7.5 => 384000,
        10 => 500000
    ];

    public function calculate(array $params): array {
        $pumpHp = (float)($params['pumpHp'] ?? 5);
        $monthlyCost = (float)($params['monthlyCost'] ?? 0);
        $stateSubsidyPct = (float)($params['stateSubsidyPct'] ?? 30);

        // Find the closest HP in benchmark or default
        $hpKey = 5;
        $diff = 9999.0;
        foreach ($this->benchmarkCostByHp as $hp => $cost) {
            $d = abs($hp - $pumpHp);
            if ($d < $diff) {
                $diff = $d;
                $hpKey = $hp;
            }
        }

        $benchmarkCost = $this->benchmarkCostByHp[$hpKey];
        $centralPct = 60.0;
        $statePct = min(90.0, max(0.0, $stateSubsidyPct));

        $centralSubsidy = (float)round(($benchmarkCost * $centralPct) / 100.0);
        $stateSubsidy = (float)round(($benchmarkCost * $statePct) / 100.0);
        $farmerShare = (float)max(0.0, $benchmarkCost - $centralSubsidy - $stateSubsidy);

        $paybackYears = 0.0;
        if ($monthlyCost > 0) {
            $paybackMonths = $farmerShare / $monthlyCost;
            $paybackYears = round($paybackMonths / 12.0, 1);
        }

        $tenYearSavings = max(0.0, round(($monthlyCost * 120.0) - $farmerShare));
        $recommendedKw = $pumpHp * 0.746;

        return [
            'recommendedHp' => $pumpHp,
            'recommendedKw' => round($recommendedKw, 2),
            'benchmarkCost' => (float)$benchmarkCost,
            'centralSubsidy' => $centralSubsidy,
            'stateSubsidy' => $stateSubsidy,
            'farmerShare' => $farmerShare,
            'monthlySavings' => $monthlyCost,
            'paybackYears' => $paybackYears,
            'tenYearSavings' => $tenYearSavings
        ];
    }
}
