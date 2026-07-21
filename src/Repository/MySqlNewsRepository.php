<?php

namespace Repository;

use Core\Database;
use PDO;

class MySqlNewsRepository implements INewsRepository {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(bool $featuredOnly = false, int $limit = 0): array {
        if (!$this->db) return [];
        $sql = "SELECT * FROM `daily_updates` " . ($featuredOnly ? "WHERE `is_featured` = 1 " : "") . "ORDER BY `published_at` DESC";
        if ($limit > 0) {
            $sql .= " LIMIT " . (int)$limit;
        }
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll() ?: [];
    }

    public function getBySlug(string $slug): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `daily_updates` WHERE `slug` = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function getById(string $id): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `daily_updates` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function save(array $newsData): bool {
        if (!$this->db) return false;

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

        $existing = $this->getById($newsData['id']);
        if ($existing) {
            $stmt = $this->db->prepare("UPDATE `daily_updates` SET 
                `title` = ?, `slug` = ?, `category` = ?, `snippet` = ?, 
                `content` = ?, `image_url` = ?, `is_featured` = ?, `published_at` = ? 
                WHERE `id` = ?");
            return $stmt->execute([
                $newsData['title'],
                $newsData['slug'],
                $newsData['category'] ?? 'Industry News',
                $newsData['snippet'],
                $newsData['content'],
                $newsData['image_url'] ?? null,
                isset($newsData['is_featured']) ? (int)$newsData['is_featured'] : 0,
                $newsData['published_at'],
                $newsData['id']
            ]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO `daily_updates` 
                (`id`, `title`, `slug`, `category`, `snippet`, `content`, `image_url`, `is_featured`, `published_at`, `created_at`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $newsData['id'],
                $newsData['title'],
                $newsData['slug'],
                $newsData['category'] ?? 'Industry News',
                $newsData['snippet'],
                $newsData['content'],
                $newsData['image_url'] ?? null,
                isset($newsData['is_featured']) ? (int)$newsData['is_featured'] : 0,
                $newsData['published_at'],
                $newsData['created_at']
            ]);
        }
    }

    public function delete(string $id): bool {
        if (!$this->db) return false;
        $stmt = $this->db->prepare("DELETE FROM `daily_updates` WHERE `id` = ?");
        return $stmt->execute([$id]);
    }
}
