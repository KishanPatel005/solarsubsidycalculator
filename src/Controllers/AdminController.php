<?php

namespace Controllers;

use Config\Config;
use Repository\LeadRepositoryFactory;

class AdminController {
    /**
     * Authenticates the admin PIN.
     *
     * @param string $pin
     * @return bool
     */
    public function authorize(string $pin): bool {
        return $pin === Config::ADMIN_PIN;
    }

    /**
     * Returns leads if authorized.
     *
     * @param string $pin
     * @return array
     */
    public function getLeads(string $pin): array {
        if (!$this->authorize($pin)) {
            return [];
        }
        $repo = LeadRepositoryFactory::create();
        return $repo->getAll();
    }

    /**
     * Compiles admin dashboard summary statistics.
     *
     * @param array $leads
     * @return array
     */
    public function getStatsSummary(array $leads): array {
        $total = count($leads);
        $todayCount = 0;
        $weekCount = 0;
        
        $todayStart = strtotime('today midnight');
        $weekStart = strtotime('monday this week midnight');

        $stateCounts = [];

        foreach ($leads as $l) {
            $timestamp = isset($l['timestamp']) ? strtotime($l['timestamp']) : 0;
            if ($timestamp >= $todayStart) {
                $todayCount++;
            }
            if ($timestamp >= $weekStart) {
                $weekCount++;
            }

            $state = trim($l['state'] ?? '');
            if (!empty($state)) {
                $stateCounts[$state] = ($stateCounts[$state] ?? 0) + 1;
            }
        }

        $mostCommonState = '—';
        $maxCount = 0;
        foreach ($stateCounts as $state => $count) {
            if ($count > $maxCount) {
                $maxCount = $count;
                $mostCommonState = ucfirst($state);
            }
        }

        return [
            'totalLeads' => $total,
            'todaysLeads' => $todayCount,
            'thisWeeksLeads' => $weekCount,
            'mostCommonState' => $mostCommonState
        ];
    }
}
