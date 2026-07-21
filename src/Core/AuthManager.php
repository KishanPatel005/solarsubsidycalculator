<?php

namespace Core;

use Config\Config;
use Repository\RepositoryFactory;

class AuthManager {
    public static function initSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function isAuthenticated(): bool {
        self::initSession();
        if (!empty($_SESSION['admin_user'])) {
            return true;
        }
        if (!empty($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true) {
            return true;
        }
        return false;
    }

    public static function loginWithUsername(string $username, string $password): bool {
        self::initSession();
        $userRepo = RepositoryFactory::create('user');
        $user = $userRepo->getByUsername($username);

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['admin_user'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'] ?? '',
                'role' => $user['role'] ?? 'admin'
            ];
            $_SESSION['admin_authenticated'] = true;
            return true;
        }

        if ($username === Config::DEFAULT_ADMIN_USER && $password === Config::DEFAULT_ADMIN_PASS) {
            $_SESSION['admin_user'] = [
                'id' => 'usr_default',
                'username' => Config::DEFAULT_ADMIN_USER,
                'email' => 'admin@solarsubsidy.in',
                'role' => 'admin'
            ];
            $_SESSION['admin_authenticated'] = true;
            return true;
        }

        return false;
    }

    public static function loginWithPin(string $pin): bool {
        self::initSession();
        if ($pin === Config::ADMIN_PIN) {
            $_SESSION['admin_user'] = [
                'id' => 'usr_pin',
                'username' => 'PIN Admin',
                'email' => 'pin@solarsubsidy.in',
                'role' => 'admin'
            ];
            $_SESSION['admin_authenticated'] = true;
            return true;
        }
        return false;
    }

    public static function logout(): void {
        self::initSession();
        unset($_SESSION['admin_user']);
        unset($_SESSION['admin_authenticated']);
        session_destroy();
    }

    public static function requireAuth(): void {
        if (!self::isAuthenticated()) {
            $loginUrl = url('admin/login.php');
            header("Location: {$loginUrl}");
            exit();
        }
    }

    public static function getCurrentUser(): ?array {
        self::initSession();
        return $_SESSION['admin_user'] ?? null;
    }
}
