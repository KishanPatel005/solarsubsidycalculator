<?php

namespace Repository;

use Core\Database;
use PDO;

class MySqlFaqRepository implements IFaqRepository {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(bool $activeOnly = true): array {
        if (!$this->db) return [];
        $sql = "SELECT * FROM `faqs` " . ($activeOnly ? "WHERE `is_active` = 1 " : "") . "ORDER BY `display_order` ASC, `created_at` DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll() ?: [];
    }

    public function getById(string $id): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `faqs` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function save(array $faqData): bool {
        if (!$this->db) return false;

        if (empty($faqData['id'])) {
            $faqData['id'] = 'faq_' . uniqid();
        }
        if (empty($faqData['created_at'])) {
            $faqData['created_at'] = date('Y-m-d H:i:s');
        }

        $existing = $this->getById($faqData['id']);
        if ($existing) {
            $stmt = $this->db->prepare("UPDATE `faqs` SET `question` = ?, `answer` = ?, `display_order` = ?, `is_active` = ?, `category` = ? WHERE `id` = ?");
            return $stmt->execute([
                $faqData['question'],
                $faqData['answer'],
                (int)($faqData['display_order'] ?? 0),
                isset($faqData['is_active']) ? (int)$faqData['is_active'] : 1,
                $faqData['category'] ?? 'General',
                $faqData['id']
            ]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO `faqs` (`id`, `question`, `answer`, `display_order`, `is_active`, `category`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $faqData['id'],
                $faqData['question'],
                $faqData['answer'],
                (int)($faqData['display_order'] ?? 0),
                isset($faqData['is_active']) ? (int)$faqData['is_active'] : 1,
                $faqData['category'] ?? 'General',
                $faqData['created_at']
            ]);
        }
    }

    public function delete(string $id): bool {
        if (!$this->db) return false;
        $stmt = $this->db->prepare("DELETE FROM `faqs` WHERE `id` = ?");
        return $stmt->execute([$id]);
    }
}
