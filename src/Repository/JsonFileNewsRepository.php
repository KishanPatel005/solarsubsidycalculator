<?php

namespace Repository;

use Config\Config;

class JsonFileNewsRepository implements INewsRepository {
    private string $filePath;

    public function __construct() {
        $this->filePath = Config::JSON_NEWS_PATH;
        $this->ensureFileExists();
    }

    private function ensureFileExists(): void {
        if (!file_exists($this->filePath)) {
            $defaultNews = [
                [
                    'id' => 'news_1',
                    'title' => 'MNRE Issues Mandatory ALMM Compliance Notice for PM Surya Ghar Rooftop Projects',
                    'slug' => 'mnre-almm-compliance-pm-surya-ghar-2026',
                    'category' => 'Policy Circular',
                    'snippet' => 'Ministry of New & Renewable Energy mandates domestic solar cell and module sourcing under ALMM List I to qualify for direct consumer subsidy disbursement.',
                    'content' => '<p>The Ministry of New and Renewable Energy (MNRE) has issued fresh guidelines reiterating that all residential rooftop solar systems installed under the PM Surya Ghar: Muft Bijli Yojana must exclusively use solar PV modules listed under the Approved List of Models and Manufacturers (ALMM).</p><p>Installers and consumers are advised to verify vendor ALMM certificates before signing procurement contracts to prevent delays in Direct Benefit Transfer (DBT) processing.</p>',
                    'image_url' => 'logo.png',
                    'is_featured' => 1,
                    'published_at' => date('Y-m-d H:i:s'),
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 'news_2',
                    'title' => 'National Portal Fast-Tracks Net-Meter Approvals to 15 Days Across Major DISCOMs',
                    'slug' => 'fast-track-net-meter-approvals-15-days',
                    'category' => 'DISCOM Updates',
                    'snippet' => 'State electricity distribution companies in Gujarat, Maharashtra, Delhi, and UP streamline meter inspection workflows to accelerate commissioning.',
                    'content' => '<p>State DISCOMs across key regions have adopted automated net-metering dispatch protocols. Following installation submission on the National Portal, feasibility inspections and meter replacement will complete within a strict 15-day window.</p>',
                    'image_url' => 'logo.png',
                    'is_featured' => 1,
                    'published_at' => date('Y-m-d H:i:s', strtotime('-1 day')),
                    'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
                ],
                [
                    'id' => 'news_3',
                    'title' => 'Public Sector Banks Roll Out Concessional 7% Interest Rates for Residential Solar Loans',
                    'slug' => 'concessional-solar-loan-rates-public-banks-2026',
                    'category' => 'Solar Finance',
                    'snippet' => 'State Bank of India, Punjab National Bank, and Canara Bank extend collateral-free solar rooftop financing options with collateral-free limits up to ₹6 Lakhs.',
                    'content' => '<p>In line with government priority sector lending directives, leading public sector banks have introduced streamlined digital loan approvals for residential solar rooftop installations up to 10 kW capacity with minimal documentation.</p>',
                    'image_url' => 'logo.png',
                    'is_featured' => 0,
                    'published_at' => date('Y-m-d H:i:s', strtotime('-2 days')),
                    'created_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
                ]
            ];
            file_put_contents($this->filePath, json_encode($defaultNews, JSON_PRETTY_PRINT));
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

    public function getAll(bool $featuredOnly = false, int $limit = 0): array {
        $items = $this->readAll();
        if ($featuredOnly) {
            $items = array_filter($items, fn($n) => !empty($n['is_featured']));
        }
        usort($items, fn($a, $b) => strcmp($b['published_at'] ?? '', $a['published_at'] ?? ''));
        if ($limit > 0) {
            $items = array_slice($items, 0, $limit);
        }
        return array_values($items);
    }

    public function getBySlug(string $slug): ?array {
        $items = $this->readAll();
        foreach ($items as $item) {
            if ($item['slug'] === $slug) {
                return $item;
            }
        }
        return null;
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

    public function save(array $newsData): bool {
        $items = $this->readAll();
        $now = date('Y-m-d H:i:s');
        if (empty($newsData['id'])) {
            $newsData['id'] = 'news_' . uniqid();
        }
        if (empty($newsData['created_at'])) {
            $newsData['created_at'] = $now;
        }
        if (empty($newsData['published_at'])) {
            $newsData['published_at'] = $now;
        }

        $found = false;
        foreach ($items as $idx => $item) {
            if ($item['id'] === $newsData['id']) {
                $items[$idx] = array_merge($item, $newsData);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $items[] = $newsData;
        }

        return $this->writeAll($items);
    }

    public function delete(string $id): bool {
        $items = $this->readAll();
        $filtered = array_filter($items, fn($n) => $n['id'] !== $id);
        return $this->writeAll($filtered);
    }
}
