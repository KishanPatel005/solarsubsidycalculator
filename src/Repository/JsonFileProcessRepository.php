<?php

namespace Repository;

use Config\Config;

class JsonFileProcessRepository implements IProcessRepository {
    private string $filePath;

    public function __construct() {
        $this->filePath = Config::JSON_PROCESS_PATH;
        $this->ensureFileExists();
    }

    private function ensureFileExists(): void {
        if (!file_exists($this->filePath)) {
            $defaultSteps = [
                [
                    'id' => 'proc_1',
                    'step_number' => 1,
                    'title' => 'Portal Registration & Technical Feasibility',
                    'short_description' => 'Register on the National Portal for Rooftop Solar (pmsuryaghar.gov.in) with your electricity account consumer number and submit a feasibility request.',
                    'detailed_content' => 'Enter your DISCOM name and consumer account number. Your local DISCOM officer will inspect grid capacity and issue technical feasibility approval.',
                    'icon_name' => 'user-check',
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'proc_2',
                    'step_number' => 2,
                    'title' => 'Empanelled Vendor Selection',
                    'short_description' => 'Choose a registered MNRE empanelled vendor in your district to conduct rooftop site assessment and execute solar installation agreement.',
                    'detailed_content' => 'Compare quotes from multiple MNRE empanelled vendors. Ensure ALMM-listed solar PV modules and BIS-certified string inverters are selected.',
                    'icon_name' => 'building-store',
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'proc_3',
                    'step_number' => 3,
                    'title' => 'Rooftop Plant Installation',
                    'short_description' => 'The vendor completes module mounting, electrical wiring, earthing pits, and surge protection device setup according to MNRE technical specs.',
                    'detailed_content' => 'Installation takes 2-5 days depending on system capacity. Structural earthing and lightning arresters are tested prior to submitting the net meter application.',
                    'icon_name' => 'sun-medium',
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'proc_4',
                    'step_number' => 4,
                    'title' => 'Net Meter Testing & Commissioning',
                    'short_description' => 'DISCOM engineers inspect plant safety, replace existing energy meter with bidirectional net-meter, and issue official Commissioning Certificate.',
                    'detailed_content' => 'Bidirectional meter measures imported vs exported solar power units. Once commissioned, your system starts generating solar power and earning grid credits.',
                    'icon_name' => 'zap',
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'proc_5',
                    'step_number' => 5,
                    'title' => 'Direct Subsidy Transfer (DBT)',
                    'short_description' => 'Upload commissioning certificate and bank cancelled cheque on the portal. Subsidy up to ₹78,000 is directly credited to your bank account within 30 days.',
                    'detailed_content' => 'Central government CFA subsidy funds are directly disbursed to the consumer Aadhaar-linked bank account without middleman intervention.',
                    'icon_name' => 'banknotes',
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ];
            file_put_contents($this->filePath, json_encode($defaultSteps, JSON_PRETTY_PRINT));
        }
    }

    private function readAll(): array {
        if (!file_exists($this->filePath)) return [];
        $content = file_get_contents($this->filePath);
        return json_decode($content, true) ?: [];
    }

    private function writeAll(array $items): bool {
        return file_put_contents($this->filePath, json_encode(array_values($items), JSON_PRETTY_PRINT)) !== false;
    }

    public function getAll(bool $activeOnly = true): array {
        $items = $this->readAll();
        if ($activeOnly) {
            $items = array_filter($items, fn($p) => !isset($p['is_active']) || (int)$p['is_active'] === 1);
        }
        usort($items, fn($a, $b) => ($a['step_number'] ?? 0) <=> ($b['step_number'] ?? 0));
        return array_values($items);
    }

    public function getById(string $id): ?array {
        $items = $this->readAll();
        foreach ($items as $item) {
            if ($item['id'] === $id) {
                return $item;
            }
        }
        return null;
    }

    public function save(array $processData): bool {
        $items = $this->readAll();
        if (empty($processData['id'])) {
            $processData['id'] = 'proc_' . uniqid();
        }
        if (empty($processData['created_at'])) {
            $processData['created_at'] = date('Y-m-d H:i:s');
        }
        if (!isset($processData['is_active'])) {
            $processData['is_active'] = 1;
        }

        $found = false;
        foreach ($items as $idx => $item) {
            if ($item['id'] === $processData['id']) {
                $items[$idx] = array_merge($item, $processData);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $items[] = $processData;
        }

        return $this->writeAll($items);
    }

    public function delete(string $id): bool {
        $items = $this->readAll();
        $filtered = array_filter($items, fn($p) => $p['id'] !== $id);
        return $this->writeAll($filtered);
    }
}
