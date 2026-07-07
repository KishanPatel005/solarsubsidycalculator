<?php

namespace Core;

use Calculators\SubsidyCalculator;
use Calculators\EmiCalculator;
use Calculators\SavingsCalculator;
use Calculators\KusumCalculator;

class CalculatorFactory {
    /**
     * Instantiates a calculator implementation based on its name.
     *
     * @param string $type
     * @return ICalculator
     * @throws \InvalidArgumentException
     */
    public static function create(string $type): ICalculator {
        switch (strtolower($type)) {
            case 'subsidy':
                return new SubsidyCalculator();
            case 'emi':
                return new EmiCalculator();
            case 'savings':
                return new SavingsCalculator();
            case 'kusum':
                return new KusumCalculator();
            default:
                throw new \InvalidArgumentException("Unknown calculator type: " . $type);
        }
    }
}
