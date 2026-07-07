<?php
// Verification Script
require_once __DIR__ . '/bootstrap.php';

use Core\CalculatorFactory;

echo "=========================================\n";
echo "Solar Subsidy Calculator - Test Suite 2026\n";
echo "=========================================\n\n";

$passed = true;

// 1. Subsidy Calculator Test
try {
    $calc = CalculatorFactory::create('subsidy');
    $res = $calc->calculate([
        'rooftopAreaSqft' => 100,
        'sanctionedLoadKw' => 3,
        'monthlyBillINR' => 3000,
        'stateSlug' => 'delhi'
    ]);

    assertValue($res['systemSizeKw'], 3.0, 'System Size Recommended (3 kW Limit)');
    assertValue($res['centralSubsidyINR'], 78000.0, 'Central Govt Subsidy');
    assertValue($res['stateSubsidyINR'], 6000.0, 'Delhi State Subsidy (₹2k/kW)');
    assertValue($res['totalSubsidyINR'], 84000.0, 'Total Subsidy');
    assertValue($res['systemCostINR'], 195000.0, 'Base System Cost (₹65k/kW)');
    assertValue($res['finalCostINR'], 111000.0, 'Final Cost (After Subsidy)');
} catch (\Throwable $e) {
    echo "❌ Subsidy Calculator Failed: " . $e->getMessage() . "\n";
    $passed = false;
}

// 2. EMI Calculator Test
try {
    $calc = CalculatorFactory::create('emi');
    $res = $calc->calculate([
        'principal' => 111000,
        'annualRate' => 7.5,
        'tenureMonths' => 60
    ]);

    assertValue($res['emi'], 2224.0, 'Monthly EMI for ₹1.11L @ 7.5% for 5Y');
    assertValue($res['totalPayment'], 133440.0, 'Total Payment');
    assertValue($res['totalInterest'], 22440.0, 'Total Interest');
} catch (\Throwable $e) {
    echo "❌ EMI Calculator Failed: " . $e->getMessage() . "\n";
    $passed = false;
}

// 3. Savings Calculator Test
try {
    $calc = CalculatorFactory::create('savings');
    $res = $calc->calculate([
        'monthlyBill' => 3000,
        'systemSize' => 3.0,
        'hoursPerDay' => 5.5,
        'finalCost' => 111000
    ]);

    assertValue($res['unitsPerYear'], 5940.0, 'Annual Solar Generation (3kW, 5.5 PSH)');
    assertValue($res['roi'], 32.4, 'ROI Percentage');
    assertValue($res['breakevenYear'], 4, 'Breakeven Payback Year');
} catch (\Throwable $e) {
    echo "❌ Savings Calculator Failed: " . $e->getMessage() . "\n";
    $passed = false;
}

// 4. KUSUM Calculator Test
try {
    $calc = CalculatorFactory::create('kusum');
    $res = $calc->calculate([
        'pumpHp' => 5,
        'monthlyCost' => 5000,
        'stateSubsidyPct' => 30
    ]);

    assertValue($res['benchmarkCost'], 272000.0, 'PM KUSUM 5HP Pump Cost');
    assertValue($res['centralSubsidy'], 163200.0, 'Central Subsidy (60%)');
    assertValue($res['stateSubsidy'], 81600.0, 'State Subsidy (30%)');
    assertValue($res['farmerShare'], 27200.0, 'Farmer Net Contribution (10%)');
    assertValue($res['paybackYears'], 0.5, 'Payback Years');
} catch (\Throwable $e) {
    echo "❌ PM-KUSUM Calculator Failed: " . $e->getMessage() . "\n";
    $passed = false;
}

echo "\n-----------------------------------------\n";
if ($passed) {
    echo "✅ ALL UNIT TESTS PASSED SUCCESSFULLY!\n";
} else {
    echo "❌ SOME UNIT TESTS FAILED. CHECK EXPORT LOGS.\n";
}
echo "-----------------------------------------\n";

function assertValue($actual, $expected, $label) {
    global $passed;
    if (abs($actual - $expected) < 0.01 || $actual === $expected) {
        echo "✅ [Pass] $label: $actual (Expected: $expected)\n";
    } else {
        echo "❌ [Fail] $label: $actual (Expected: $expected)\n";
        $passed = false;
    }
}
