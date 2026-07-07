<?php
// POST /api/calculate?type=[subsidy|emi|savings|loan]
header('Content-Type: application/json');
require_once __DIR__ . '/../bootstrap.php';

use Core\CalculatorFactory;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

$type = $_GET['type'] ?? '';

$raw = file_get_contents('php://input');
$params = json_decode($raw, true);

if (!is_array($params)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

try {
    if ($type === 'loan') {
        // Special composite calculation for Bank Solar Loan comparisons
        $systemSize = (float)($params['systemSize'] ?? 3);
        $stateSlug = (string)($params['stateSlug'] ?? 'gujarat');
        $downPaymentPct = (float)($params['downPaymentPct'] ?? 20);

        // Instantiates subsidy & emi calculators
        $subsidyCalc = CalculatorFactory::create('subsidy');
        $emiCalc = CalculatorFactory::create('emi');

        // Calculates system costs & subsidies
        $subsidyResult = $subsidyCalc->calculate([
            'rooftopAreaSqft' => 0, // not needed for size cost
            'sanctionedLoadKw' => 0,
            'monthlyBillINR' => 0,
            'stateSlug' => $stateSlug
        ]);

        $systemCost = $subsidyCalc->calculateSystemCost($systemSize);
        $central = $subsidyCalc->calculateCentralSubsidy($systemSize);
        $state = $subsidyCalc->calculateStateSubsidy($systemSize, $stateSlug);
        $final = $subsidyCalc->calculateFinalCost($systemCost, $central + $state);

        $downPayment = (float)round(($final * $downPaymentPct) / 100.0);
        $loanAmount = (float)max(0.0, $final - $downPayment);

        // Bank compare lists
        $topBanks = \Data\BankRates::getBankSolarLoanOffers();
        $comparisons = [];

        foreach (array_slice($topBanks, 0, 3) as $b) {
            // Extracts first decimal rate from text string e.g. "RLLR-linked (varies) ... ~7% ..."
            preg_match('/(\d+(\.\d+)?)/', $b['interestRate'], $matches);
            $rate = isset($matches[1]) ? (float)$matches[1] : 9.5;
            
            $emiResult = $emiCalc->calculate([
                'principal' => $loanAmount,
                'annualRate' => $rate,
                'tenureMonths' => 60
            ]);

            $comparisons[] = [
                'name' => $b['name'],
                'annualRate' => $rate,
                'tenureMonths' => 60,
                'emi' => $emiResult['emi'],
                'totalPayment' => $emiResult['totalPayment']
            ];
        }

        echo json_encode([
            'systemCost' => $systemCost,
            'central' => $central,
            'state' => $state,
            'final' => $final,
            'downPayment' => $downPayment,
            'loanAmount' => $loanAmount,
            'comparisons' => $comparisons
        ]);
        exit();
    }

    $calculator = CalculatorFactory::create($type);
    $result = $calculator->calculate($params);

    echo json_encode($result);
    exit();
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit();
}
