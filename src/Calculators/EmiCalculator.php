<?php

namespace Calculators;

use Core\ICalculator;

class EmiCalculator implements ICalculator {
    public function calculate(array $params): array {
        $principal = (float)($params['principal'] ?? 0);
        $annualRate = (float)($params['annualRate'] ?? 0);
        $tenureMonths = (int)($params['tenureMonths'] ?? 0);

        $emi = $this->calculateEMI($principal, $annualRate, $tenureMonths);
        $totalPayment = $this->calculateTotalPayment($emi, $tenureMonths);
        $totalInterest = $this->calculateTotalInterest($totalPayment, $principal);
        $schedule = $this->generateAmortizationSchedule($principal, $annualRate, $tenureMonths);

        return [
            'emi' => $emi,
            'totalPayment' => $totalPayment,
            'totalInterest' => $totalInterest,
            'schedule' => $schedule
        ];
    }

    public function calculateEMI(float $principal, float $annualRate, int $tenureMonths): float {
        if ($principal <= 0 || $tenureMonths <= 0 || $annualRate < 0) {
            return 0.0;
        }

        $r = $annualRate / 12.0 / 100.0;

        if ($r == 0.0) {
            return round($principal / $tenureMonths);
        }

        $pow = pow(1.0 + $r, $tenureMonths);
        $emi = $principal * $r * ($pow / ($pow - 1.0));
        return (float)round($emi);
    }

    public function calculateTotalPayment(float $emi, int $tenureMonths): float {
        if ($emi <= 0 || $tenureMonths <= 0) {
            return 0.0;
        }
        return (float)round($emi * $tenureMonths);
    }

    public function calculateTotalInterest(float $totalPayment, float $principal): float {
        return (float)max(0.0, round($totalPayment - $principal));
    }

    public function generateAmortizationSchedule(float $principal, float $annualRate, int $tenureMonths): array {
        if ($principal <= 0 || $tenureMonths <= 0 || $annualRate < 0) {
            return [];
        }

        $r = $annualRate / 12.0 / 100.0;
        $emi = $this->calculateEMI($principal, $annualRate, $tenureMonths);
        if ($emi <= 0) {
            return [];
        }

        $balance = $principal;
        $schedule = [];

        for ($month = 1; $month <= $tenureMonths; $month++) {
            $interest = ($r == 0.0) ? 0.0 : $balance * $r;
            $principalComponent = max(0.0, $emi - $interest);

            // On the last month, adjust to close the loan exactly
            $actualPrincipal = ($month === $tenureMonths) ? $balance : min($balance, $principalComponent);
            $balance = max(0.0, $balance - $actualPrincipal);

            $schedule[] = [
                'month' => $month,
                'emi' => (int)round($emi),
                'principal' => (int)round($actualPrincipal),
                'interest' => (int)round($interest),
                'balance' => (int)round($balance)
            ];
        }

        return $schedule;
    }
}
