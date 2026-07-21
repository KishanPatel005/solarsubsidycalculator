-- Solar Subsidy Calculator Platform Schema
-- Target Database: solarsubsidy

CREATE DATABASE IF NOT EXISTS `solarsubsidy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `solarsubsidy`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'admin',
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Admin (admin / admin123)
INSERT IGNORE INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `created_at`) 
VALUES ('usr_admin_default', 'admin', '$2y$10$wE6vY/z5B1/KkC39yN6Xh.jE.7T5Kq.O5YwM1z3P5N6Xh.jE.7T5K', 'admin@solarsubsidy.in', 'admin', NOW());

-- Blogs Table
CREATE TABLE IF NOT EXISTS `blogs` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FAQs Table
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `category` VARCHAR(100) NOT NULL DEFAULT 'General',
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Solar Subsidy Process Table
CREATE TABLE IF NOT EXISTS `solar_process` (
  `id` VARCHAR(64) PRIMARY KEY,
  `step_number` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `short_description` TEXT NOT NULL,
  `detailed_content` TEXT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'check',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Daily Solar Updates Table
CREATE TABLE IF NOT EXISTS `daily_updates` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leads Table
CREATE TABLE IF NOT EXISTS `leads` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
