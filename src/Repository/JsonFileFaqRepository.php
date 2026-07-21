<?php

namespace Repository;

use Config\Config;

class JsonFileFaqRepository implements IFaqRepository {
    private string $filePath;

    public function __construct() {
        $this->filePath = Config::JSON_FAQS_PATH;
        $this->ensureFileExists();
    }

    private function ensureFileExists(): void {
        if (!file_exists($this->filePath)) {
            $defaultFaqs = [
                [
                    'id' => 'faq_1',
                    'question' => 'How much subsidy will I get for a 3 kW solar rooftop system?',
                    'answer' => 'Under PM Surya Ghar Muft Bijli Yojana, a 3 kW system receives a maximum Central Financial Assistance (CFA) subsidy of ₹78,000 (₹30,000 per kW for first 2 kW + ₹18,000 for the 3rd kW). Additional state subsidies may apply in regions like Delhi or UP.',
                    'display_order' => 1,
                    'is_active' => 1,
                    'category' => 'Subsidy',
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'faq_2',
                    'question' => 'Who is eligible to apply for the Central Solar Subsidy?',
                    'answer' => 'Residential homeowners with a valid DISCOM electricity connection and suitable un-shaded rooftop space are eligible. Commercial and industrial properties are not eligible for direct consumer subsidies.',
                    'display_order' => 2,
                    'is_active' => 1,
                    'category' => 'Eligibility',
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'faq_3',
                    'question' => 'How long does it take for the subsidy amount to be credited?',
                    'answer' => 'Once net-metering is installed and the commissioning certificate is issued by your local DISCOM, the subsidy amount is directly transferred (DBT) to your bank account within 30 days.',
                    'display_order' => 3,
                    'is_active' => 1,
                    'category' => 'Process',
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'faq_4',
                    'question' => 'Is net metering mandatory for receiving the solar subsidy?',
                    'answer' => 'Yes, net metering is mandatory for grid-connected rooftop solar systems to measure your energy export and enable subsidy disburser verification.',
                    'display_order' => 4,
                    'is_active' => 1,
                    'category' => 'Technical',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ];
            file_put_contents($this->filePath, json_encode($defaultFaqs, JSON_PRETTY_PRINT));
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
            $items = array_filter($items, fn($f) => !isset($f['is_active']) || (int)$f['is_active'] === 1);
        }
        usort($items, fn($a, $b) => ($a['display_order'] ?? 0) <=> ($b['display_order'] ?? 0));
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

    public function save(array $faqData): bool {
        $items = $this->readAll();
        if (empty($faqData['id'])) {
            $faqData['id'] = 'faq_' . uniqid();
        }
        if (empty($faqData['created_at'])) {
            $faqData['created_at'] = date('Y-m-d H:i:s');
        }
        if (!isset($faqData['is_active'])) {
            $faqData['is_active'] = 1;
        }

        $found = false;
        foreach ($items as $idx => $item) {
            if ($item['id'] === $faqData['id']) {
                $items[$idx] = array_merge($item, $faqData);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $items[] = $faqData;
        }

        return $this->writeAll($items);
    }

    public function delete(string $id): bool {
        $items = $this->readAll();
        $filtered = array_filter($items, fn($f) => $f['id'] !== $id);
        return $this->writeAll($filtered);
    }
}
