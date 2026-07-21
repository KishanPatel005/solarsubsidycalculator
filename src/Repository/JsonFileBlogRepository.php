<?php

namespace Repository;

use Config\Config;

class JsonFileBlogRepository implements IBlogRepository {
    private string $filePath;

    public function __construct() {
        $this->filePath = Config::JSON_BLOGS_PATH;
        $this->ensureFileExists();
    }

    private function ensureFileExists(): void {
        if (!file_exists($this->filePath)) {
            file_put_contents($this->filePath, json_encode([], JSON_PRETTY_PRINT));
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

    public function getAll(bool $publishedOnly = true): array {
        $items = $this->readAll();
        if ($publishedOnly) {
            $items = array_filter($items, fn($b) => !isset($b['is_published']) || (bool)$b['is_published'] === true);
        }
        usort($items, fn($a, $b) => strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''));
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

    public function save(array $blogData): bool {
        $items = $this->readAll();
        $now = date('Y-m-d H:i:s');
        if (empty($blogData['id'])) {
            $blogData['id'] = 'blog_' . uniqid();
        }
        if (empty($blogData['created_at'])) {
            $blogData['created_at'] = $now;
        }
        $blogData['updated_at'] = $now;
        if (!isset($blogData['is_published'])) {
            $blogData['is_published'] = 1;
        }

        $found = false;
        foreach ($items as $idx => $item) {
            if ($item['id'] === $blogData['id']) {
                $items[$idx] = array_merge($item, $blogData);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $items[] = $blogData;
        }

        return $this->writeAll($items);
    }

    public function delete(string $id): bool {
        $items = $this->readAll();
        $filtered = array_filter($items, fn($b) => $b['id'] !== $id);
        return $this->writeAll($filtered);
    }

    public function getRelated(string $currentSlug, int $limit = 3): array {
        $published = $this->getAll(true);
        $filtered = array_filter($published, fn($b) => $b['slug'] !== $currentSlug);
        return array_slice(array_values($filtered), 0, $limit);
    }
}
