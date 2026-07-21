<?php

namespace Core;

use Config\Config;
use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): ?PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf(
                    "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
                    Config::DB_HOST,
                    Config::DB_PORT,
                    Config::DB_NAME
                );

                self::$instance = new PDO($dsn, Config::DB_USER, Config::DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);

                self::ensureTablesExist(self::$instance);
            } catch (PDOException $e) {
                try {
                    $rootDsn = sprintf("mysql:host=%s;port=%s;charset=utf8mb4", Config::DB_HOST, Config::DB_PORT);
                    $rootPdo = new PDO($rootDsn, Config::DB_USER, Config::DB_PASS);
                    $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `" . Config::DB_NAME . "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

                    self::$instance = new PDO($dsn, Config::DB_USER, Config::DB_PASS, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]);

                    self::ensureTablesExist(self::$instance);
                } catch (PDOException $ex) {
                    error_log("Database Connection Error: " . $ex->getMessage());
                    return null;
                }
            }
        }

        return self::$instance;
    }

    private static function ensureTablesExist(PDO $pdo): void {
        // Users Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
            `id` VARCHAR(64) PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `email` VARCHAR(100) NULL,
            `role` VARCHAR(20) NOT NULL DEFAULT 'admin',
            `created_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Seed default admin user if missing
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = ?");
        $stmt->execute([Config::DEFAULT_ADMIN_USER]);
        if ((int)$stmt->fetchColumn() === 0) {
            $passHash = password_hash(Config::DEFAULT_ADMIN_PASS, PASSWORD_BCRYPT);
            $stmtInsert = $pdo->prepare("INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `created_at`) VALUES (?, ?, ?, ?, ?, ?)");
            $stmtInsert->execute(['usr_admin_default', Config::DEFAULT_ADMIN_USER, $passHash, 'admin@solarsubsidy.in', 'admin', date('Y-m-d H:i:s')]);
        }

        // Blogs Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `blogs` (
            `id` VARCHAR(64) PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `slug` VARCHAR(255) NOT NULL UNIQUE,
            `category` VARCHAR(100) NOT NULL,
            `description` TEXT NULL,
            `content` LONGTEXT NOT NULL,
            `cover_image` VARCHAR(255) NULL,
            `reading_time` VARCHAR(50) NOT NULL DEFAULT '5 min',
            `author` VARCHAR(100) NOT NULL DEFAULT 'Solar Expert',
            `is_published` TINYINT(1) NOT NULL DEFAULT 1,
            `created_at` DATETIME NOT NULL,
            `updated_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // FAQs Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `faqs` (
            `id` VARCHAR(64) PRIMARY KEY,
            `question` TEXT NOT NULL,
            `answer` TEXT NOT NULL,
            `display_order` INT NOT NULL DEFAULT 0,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `category` VARCHAR(100) NOT NULL DEFAULT 'General',
            `created_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Solar Subsidy Process Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `solar_process` (
            `id` VARCHAR(64) PRIMARY KEY,
            `step_number` INT NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `short_description` TEXT NOT NULL,
            `detailed_content` TEXT NULL,
            `icon_name` VARCHAR(50) NOT NULL DEFAULT 'check',
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `created_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Daily Solar Updates Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `daily_updates` (
            `id` VARCHAR(64) PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `slug` VARCHAR(255) NOT NULL UNIQUE,
            `category` VARCHAR(100) NOT NULL DEFAULT 'Industry News',
            `snippet` TEXT NOT NULL,
            `content` LONGTEXT NOT NULL,
            `image_url` VARCHAR(255) NULL,
            `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
            `published_at` DATETIME NOT NULL,
            `created_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Leads Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `leads` (
            `id` VARCHAR(64) PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `phone` VARCHAR(20) NOT NULL,
            `city` VARCHAR(100) NOT NULL,
            `state` VARCHAR(100) NULL,
            `bill` DECIMAL(10,2) NULL,
            `call_time` VARCHAR(50) NULL,
            `calculator_type` VARCHAR(50) NULL,
            `subsidy_amount` DECIMAL(12,2) NULL,
            `final_cost` DECIMAL(12,2) NULL,
            `monthly_savings` DECIMAL(12,2) NULL,
            `ip_address` VARCHAR(50) NULL,
            `created_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }
}
