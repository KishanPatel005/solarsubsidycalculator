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

        // FAQs Table & Initial Seeding
        $pdo->exec("CREATE TABLE IF NOT EXISTS `faqs` (
            `id` VARCHAR(64) PRIMARY KEY,
            `question` TEXT NOT NULL,
            `answer` TEXT NOT NULL,
            `display_order` INT NOT NULL DEFAULT 0,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `category` VARCHAR(100) NOT NULL DEFAULT 'General',
            `created_at` DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $faqCount = (int)$pdo->query("SELECT COUNT(*) FROM `faqs`")->fetchColumn();
        if ($faqCount === 0) {
            $initialFaqs = [
                ['faq_1', 'How much subsidy will I get for rooftop solar in 2026?', 'Central subsidy is available up to ₹78,000 (cap for 3 kW and above). Some states may have additional benefits depending on policy and DISCOM.', 1, 'General'],
                ['faq_2', 'Is the calculator accurate for my state?', 'The calculator uses official central subsidy rates and includes state add-ons when verified/available. Always confirm final eligibility with your DISCOM and the official portal.', 2, 'General'],
                ['faq_3', 'Where can I apply for PM Surya Ghar subsidy?', 'Apply on the official national portal at pmsuryaghar.gov.in and follow feasibility, installation and commissioning steps.', 3, 'Application'],
                ['faq_4', 'Do I need net metering?', 'Net metering (or an approved alternative) and DISCOM commissioning are typically required before subsidy is released.', 4, 'Technical'],
                ['faq_5', 'How long does the process take?', 'Timelines vary by DISCOM and vendor. Subsidy is released after installation, inspection and commissioning approval on the portal.', 5, 'Timeline']
            ];
            $stmtFaq = $pdo->prepare("INSERT INTO `faqs` (`id`, `question`, `answer`, `display_order`, `is_active`, `category`, `created_at`) VALUES (?, ?, ?, ?, 1, ?, ?)");
            $now = date('Y-m-d H:i:s');
            foreach ($initialFaqs as $f) {
                $stmtFaq->execute([$f[0], $f[1], $f[2], $f[3], $f[4], $now]);
            }
        }

        // Solar Subsidy Process Table & Initial Seeding
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

        $procCount = (int)$pdo->query("SELECT COUNT(*) FROM `solar_process`")->fetchColumn();
        if ($procCount === 0) {
            $initialProcess = [
                ['proc_1', 1, 'Registration on National Portal', 'Register at pmsuryaghar.gov.in with consumer account number.', 'Select your state DISCOM and enter consumer account number.'],
                ['proc_2', 2, 'Feasibility Approval', 'DISCOM inspects grid feasibility and approves application.', 'DISCOM checks local transformer capacity.'],
                ['proc_3', 3, 'Installation by Empaneled Vendor', 'Choose registered vendor to install DCR rooftop solar panels.', 'Panels must be DCR compliant for subsidy eligibility.'],
                ['proc_4', 4, 'Net Metering & Commissioning', 'DISCOM installs bi-directional net meter and issues certificate.', 'Bi-directional meter tracks exported solar electricity.'],
                ['proc_5', 5, 'Direct Subsidy Transfer (DBT)', 'Submit bank details on portal to receive subsidy in bank account.', 'Subsidy credited directly via DBT within 30 days.']
            ];
            $stmtProc = $pdo->prepare("INSERT INTO `solar_process` (`id`, `step_number`, `title`, `short_description`, `detailed_content`, `icon_name`, `is_active`, `created_at`) VALUES (?, ?, ?, ?, ?, 'check', 1, ?)");
            $now = date('Y-m-d H:i:s');
            foreach ($initialProcess as $p) {
                $stmtProc->execute([$p[0], $p[1], $p[2], $p[3], $p[4], $now]);
            }
        }

        // Daily Solar Updates Table & Initial Seeding
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

        $newsCount = (int)$pdo->query("SELECT COUNT(*) FROM `daily_updates`")->fetchColumn();
        if ($newsCount === 0) {
            $initialNews = [
                ['news_1', 'MNRE Expedites PM Surya Ghar Subsidy Transfers', 'mnre-expedites-pm-surya-ghar-subsidy', 'Policy Circular', 'Ministry of New & Renewable Energy mandates 30-day DBT processing for all commissioned rooftop installations.', '<p>MNRE has issued a fresh directive to state DISCOMs instructing fast-track processing of net metering applications under PM Surya Ghar Yojana.</p>', 1],
                ['news_2', 'ALMM Mandate Enforced for All Govt Rooftop Projects', 'almm-mandate-enforced-rooftop-projects', 'Regulatory Update', 'Only DCR compliant panels registered under Approved List of Models and Manufacturers eligible for subsidy.', '<p>The Ministry confirmed that non-ALMM imported solar modules will not qualify for central financial assistance.</p>', 0]
            ];
            $stmtNews = $pdo->prepare("INSERT INTO `daily_updates` (`id`, `title`, `slug`, `category`, `snippet`, `content`, `image_url`, `is_featured`, `published_at`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, '', ?, ?, ?)");
            $now = date('Y-m-d H:i:s');
            foreach ($initialNews as $n) {
                $stmtNews->execute([$n[0], $n[1], $n[2], $n[3], $n[4], $n[5], $n[6], $now, $now]);
            }
        }

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
