<?php

namespace Repository;

use Config\Config;

class JsonFileUserRepository implements IUserRepository {
    private string $filePath;

    public function __construct() {
        $this->filePath = Config::JSON_USERS_PATH;
        $this->ensureFileExists();
    }

    private function ensureFileExists(): void {
        if (!file_exists($this->filePath)) {
            $defaultUsers = [
                [
                    'id' => 'usr_admin_default',
                    'username' => Config::DEFAULT_ADMIN_USER,
                    'password_hash' => password_hash(Config::DEFAULT_ADMIN_PASS, PASSWORD_BCRYPT),
                    'email' => 'admin@solarsubsidy.in',
                    'role' => 'admin',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ];
            file_put_contents($this->filePath, json_encode($defaultUsers, JSON_PRETTY_PRINT));
        }
    }

    private function readAll(): array {
        if (!file_exists($this->filePath)) return [];
        $content = file_get_contents($this->filePath);
        return json_decode($content, true) ?: [];
    }

    private function writeAll(array $users): bool {
        return file_put_contents($this->filePath, json_encode(array_values($users), JSON_PRETTY_PRINT)) !== false;
    }

    public function getByUsername(string $username): ?array {
        $users = $this->readAll();
        foreach ($users as $user) {
            if (strcasecmp($user['username'], $username) === 0) {
                return $user;
            }
        }
        return null;
    }

    public function getById(string $id): ?array {
        $users = $this->readAll();
        foreach ($users as $user) {
            if ($user['id'] === $id) {
                return $user;
            }
        }
        return null;
    }

    public function save(array $userData): bool {
        $users = $this->readAll();
        if (empty($userData['id'])) {
            $userData['id'] = 'usr_' . uniqid();
        }
        if (empty($userData['created_at'])) {
            $userData['created_at'] = date('Y-m-d H:i:s');
        }

        $found = false;
        foreach ($users as $idx => $user) {
            if ($user['id'] === $userData['id']) {
                $users[$idx] = array_merge($user, $userData);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $users[] = $userData;
        }

        return $this->writeAll($users);
    }

    public function delete(string $id): bool {
        $users = $this->readAll();
        $filtered = array_filter($users, fn($u) => $u['id'] !== $id);
        return $this->writeAll($filtered);
    }

    public function getAll(): array {
        return $this->readAll();
    }
}
