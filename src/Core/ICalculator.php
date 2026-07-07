<?php

namespace Core;

interface ICalculator {
    /**
     * Executes the calculation with the given input parameters and returns the results as an associative array.
     *
     * @param array $params
     * @return array
     */
    public function calculate(array $params): array;
}
