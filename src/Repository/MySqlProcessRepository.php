<?php

namespace Repository;

use Core\Database;
use PDO;

class MySqlProcessRepository implements IProcessRepository {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(bool $activeOnly = true): array {
        if (!$this->db) return [];
        $sql = "SELECT * FROM `solar_process` " . ($activeOnly ? "WHERE `is_active` = 1 " : "") . "ORDER BY `step_number` ASC, `created_at` ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll() ?: [];
    }

    public function getById(string $id): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `solar_process` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function save(array $processData): bool {
        if (!$this->db) return false;

        if (empty($processData['id'])) {
            $processData['id'] = 'proc_' . uniqid();
        }
        if (empty($processData['created_at'])) {
            $processData['created_at'] = date('Y-m-d H:i:s');
        }

        $existing = $this->getById($processData['id']);
        if ($existing) {
            $stmt = $this->db->prepare("UPDATE `solar_process` SET `step_number` = ?, `title` = ?, `short_description` = ?, `detailed_content` = ?, `icon_name` = ?, `is_active` = ? WHERE `id` = ?");
            return $stmt->execute([
                (int)($processData['step_number'] ?? 1),
                $processData['title'],
                $processData['short_description'],
                $processData['detailed_content'] ?? null,
                $processData['icon_name'] ?? 'check',
                isset($processData['is_active']) ? (int)$processData['is_active'] : 1,
                $processData['id']
            ]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO `solar_process` (`id`, `step_number`, `title`, `short_description`, `detailed_content`, `icon_name`, `is_active`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $processData['id'],
                (int)($processData['step_number'] ?? 1),
                $processData['title'],
                $processData['short_description'],
                $processData['detailed_content'] ?? null,
                $processData['icon_name'] ?? 'check',
                isset($processData['is_active']) ? (int)$processData['is_active'] : 1,
                $processData['created_at']
            ]);
        }
    }

    public function delete(string $id): bool {
        if (!$this->db) return false;
        $stmt = $this->db->prepare("DELETE FROM `solar_process` WHERE `id` = ?");
        return $stmt->execute([$id]);
    }
}
