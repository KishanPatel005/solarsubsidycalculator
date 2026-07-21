<?php

namespace Repository;

use Core\Database;
use PDO;

class MySqlUserRepository implements IUserRepository {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getByUsername(string $username): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `users` WHERE `username` = ? LIMIT 1");
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function getById(string $id): ?array {
        if (!$this->db) return null;
        $stmt = $this->db->prepare("SELECT * FROM `users` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function save(array $userData): bool {
        if (!$this->db) return false;

        if (empty($userData['id'])) {
            $userData['id'] = 'usr_' . uniqid();
        }
        if (empty($userData['created_at'])) {
            $userData['created_at'] = date('Y-m-d H:i:s');
        }

        $existing = $this->getById($userData['id']);
        if ($existing) {
            $stmt = $this->db->prepare("UPDATE `users` SET `username` = ?, `password_hash` = ?, `email` = ?, `role` = ? WHERE `id` = ?");
            return $stmt->execute([
                $userData['username'],
                $userData['password_hash'],
                $userData['email'] ?? null,
                $userData['role'] ?? 'admin',
                $userData['id']
            ]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `created_at`) VALUES (?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $userData['id'],
                $userData['username'],
                $userData['password_hash'],
                $userData['email'] ?? null,
                $userData['role'] ?? 'admin',
                $userData['created_at']
            ]);
        }
    }

    public function delete(string $id): bool {
        if (!$this->db) return false;
        $stmt = $this->db->prepare("DELETE FROM `users` WHERE `id` = ?");
        return $stmt->execute([$id]);
    }

    public function getAll(): array {
        if (!$this->db) return [];
        $stmt = $this->db->query("SELECT `id`, `username`, `email`, `role`, `created_at` FROM `users` ORDER BY `created_at` DESC");
        return $stmt->fetchAll() ?: [];
    }
}
