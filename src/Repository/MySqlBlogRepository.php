<?php

namespace Repository;

use Core\Database;
use PDO;

class MySqlBlogRepository implements IBlogRepository {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(bool $publishedOnly = true): array {
        if (!$this->db) return [];
        $sql = "SELECT * FROM `blogs` " . ($publishedOnly ? "WHERE `is_published` = 1 " : "") . "ORDER BY `created_at` DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll() ?: [];
    }

    public function getBySlug(string $slug): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `blogs` WHERE `slug` = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function getById(string $id): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `blogs` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function save(array $blogData): bool {
        if (!$this->db) return false;

        $now = date('Y-m-d H:i:s');
        if (empty($blogData['id'])) {
            $blogData['id'] = 'blog_' . uniqid();
        }
        if (empty($blogData['created_at'])) {
            $blogData['created_at'] = $now;
        }
        $blogData['updated_at'] = $now;

        $existing = $this->getById($blogData['id']);
        if ($existing) {
            $stmt = $this->db->prepare("UPDATE `blogs` SET 
                `title` = ?, `slug` = ?, `category` = ?, `description` = ?, 
                `content` = ?, `cover_image` = ?, `reading_time` = ?, 
                `author` = ?, `is_published` = ?, `updated_at` = ? 
                WHERE `id` = ?");
            return $stmt->execute([
                $blogData['title'],
                $blogData['slug'],
                $blogData['category'] ?? 'General',
                $blogData['description'] ?? '',
                $blogData['content'],
                $blogData['cover_image'] ?? null,
                $blogData['reading_time'] ?? '5 min',
                $blogData['author'] ?? 'Solar Expert',
                isset($blogData['is_published']) ? (int)$blogData['is_published'] : 1,
                $blogData['updated_at'],
                $blogData['id']
            ]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO `blogs` 
                (`id`, `title`, `slug`, `category`, `description`, `content`, `cover_image`, `reading_time`, `author`, `is_published`, `created_at`, `updated_at`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $blogData['id'],
                $blogData['title'],
                $blogData['slug'],
                $blogData['category'] ?? 'General',
                $blogData['description'] ?? '',
                $blogData['content'],
                $blogData['cover_image'] ?? null,
                $blogData['reading_time'] ?? '5 min',
                $blogData['author'] ?? 'Solar Expert',
                isset($blogData['is_published']) ? (int)$blogData['is_published'] : 1,
                $blogData['created_at'],
                $blogData['updated_at']
            ]);
        }
    }

    public function delete(string $id): bool {
        if (!$this->db) return false;
        $stmt = $this->db->prepare("DELETE FROM `blogs` WHERE `id` = ?");
        return $stmt->execute([$id]);
    }

    public function getRelated(string $currentSlug, int $limit = 3): array {
        if (!$this->db) return [];
        $stmt = $this->db->prepare("SELECT * FROM `blogs` WHERE `slug` != ? AND `is_published` = 1 ORDER BY `created_at` DESC LIMIT ?");
        $stmt->bindValue(1, $currentSlug, PDO::PARAM_STR);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll() ?: [];
    }
}
