-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2026 at 05:42 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solarsubsidy`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `reading_time` varchar(50) NOT NULL DEFAULT '5 min',
  `author` varchar(100) NOT NULL DEFAULT 'Solar Expert',
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `category`, `description`, `content`, `cover_image`, `reading_time`, `author`, `is_published`, `created_at`, `updated_at`) VALUES
('blog_6a5fb3a542c74', 'PM Surya Ghar Rooftop Solar Subsidy Scheme Guide 2026', 'pm-surya-ghar-rooftop-solar-subsidy-scheme-guide-2026', 'Subsidy Guide', 'Comprehensive breakdown of government subsidy rates, net metering eligibility, and application procedure under PM Surya Ghar Yojana.', '<p>&lt;h2&gt;Comprehensive Subsidy Breakdown&lt;/h2&gt;&lt;p&gt;Under PM Surya Ghar 2026, central financial assistance is available up to INR 78,000 for 3kW rooftop solar installations.&lt;/p&gt;</p>', 'logo.png', '6 min', 'Solar Tech Specialist', 1, '2026-07-21 20:00:05', '2026-07-21 20:00:05'),
('blog_6a60ffc10cdb1', '2026 PM Surya Ghar Benefits', '2026-pm-surya-ghar-benefits', 'Subsidy Guide', 'An overview of the subsidy savings you can get on rooftop solar.', '<p>This is the main article content demonstrating rooftop savings under the new SURYA program.</p>', 'logo.png', '4 min', 'Solar Expert', 1, '2026-07-22 19:37:05', '2026-07-22 19:37:05');

-- --------------------------------------------------------

--
-- Table structure for table `daily_updates`
--

CREATE TABLE `daily_updates` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Industry News',
  `snippet` text NOT NULL,
  `content` longtext NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_updates`
--

INSERT INTO `daily_updates` (`id`, `title`, `slug`, `category`, `snippet`, `content`, `image_url`, `is_featured`, `published_at`, `created_at`) VALUES
('news_1', 'MNRE Expedites PM Surya Ghar Subsidy Transfers', 'mnre-expedites-pm-surya-ghar-subsidy', 'Policy Circular', 'Ministry of New & Renewable Energy mandates 30-day DBT processing for all commissioned rooftop installations.', '<p>MNRE has issued a fresh directive to state DISCOMs instructing fast-track processing of net metering applications under PM Surya Ghar Yojana.</p>', '', 1, '2026-07-21 19:35:44', '2026-07-21 19:35:44'),
('news_2', 'ALMM Mandate Enforced for All Govt Rooftop Projects', 'almm-mandate-enforced-rooftop-projects', 'Regulatory Update', 'Only DCR compliant panels registered under Approved List of Models and Manufacturers eligible for subsidy.', '<p>The Ministry confirmed that non-ALMM imported solar modules will not qualify for central financial assistance.</p>', '', 0, '2026-07-21 19:35:44', '2026-07-21 19:35:44'),
('news_6a5fb55001746', 'MNRE Announces Accelerated 30-Day Subsidy Clearance Circular', 'mnre-announces-accelerated-30-day-subsidy-clearance-circular', 'Policy Update', 'MNRE issues new guidelines to release PM Surya Ghar solar subsidy within 30 days of installation approval.', '<h2>Subsidy Timeline Shortened</h2><p>In a major boost to rooftop solar adoption, the Ministry of New and Renewable Energy (MNRE) has instructed DISCOMs and implementing agencies to ensure that subsidies are processed and credited to the applicant\'s bank account within 30 days of the commissioning certificate being uploaded.</p>', 'logo.png', 1, '2026-07-21 20:07:11', '2026-07-21 20:07:12'),
('news_6a61024f42f2b', 'National Portal Integration Upgrades', 'national-portal-integration-upgrades', 'Tech Announcement', 'The government website updates APIs for faster DISCOM verification.', '<p>The Ministry announced technical maintenance on the PM Surya Ghar national portal to deploy improved database sync with regional DISCOM agencies, shortening feasibility validation turnaround.</p>', 'logo.png', 1, '2026-07-22 20:00:00', '2026-07-22 19:47:59');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` varchar(64) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `category` varchar(100) NOT NULL DEFAULT 'General',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `display_order`, `is_active`, `category`, `created_at`) VALUES
('faq_1', 'How much subsidy will I get for rooftop solar in 2026?', 'Central subsidy is available up to ₹78,000 (cap for 3 kW and above). Some states may have additional benefits depending on policy and DISCOM.', 1, 1, 'General', '2026-07-21 19:35:44'),
('faq_2', 'Is the calculator accurate for my state?', 'The calculator uses official central subsidy rates and includes state add-ons when verified/available. Always confirm final eligibility with your DISCOM and the official portal.', 2, 1, 'General', '2026-07-21 19:35:44'),
('faq_3', 'Where can I apply for PM Surya Ghar subsidy?', 'Apply on the official national portal at pmsuryaghar.gov.in and follow feasibility, installation and commissioning steps.', 3, 1, 'Application', '2026-07-21 19:35:44'),
('faq_4', 'Do I need net metering?', 'Net metering (or an approved alternative) and DISCOM commissioning are typically required before subsidy is released.', 4, 1, 'Technical', '2026-07-21 19:35:44'),
('faq_5', 'How long does the process take?', 'Timelines vary by DISCOM and vendor. Subsidy is released after installation, inspection and commissioning approval on the portal.', 5, 1, 'Timeline', '2026-07-21 19:35:44'),
('faq_6a5fb434075c3', 'What is the maximum subsidy amount under PM Surya Ghar 2026?', 'Under the PM Surya Ghar Yojana, residential consumers can receive up to Rs. 78,000 for system capacities of 3 kW and above.', 1, 1, 'Subsidy Rates', '2026-07-21 20:02:28'),
('faq_6a610017919af', 'Can I apply for solar subsidy if I live in a rented apartment?', 'Usually, rooftop solar requires ownership of the roof or written NOC authorization from the house owner.', 10, 1, 'Eligibility', '2026-07-22 19:38:31');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `bill` decimal(10,2) DEFAULT NULL,
  `call_time` varchar(50) DEFAULT NULL,
  `calculator_type` varchar(50) DEFAULT NULL,
  `subsidy_amount` decimal(12,2) DEFAULT NULL,
  `final_cost` decimal(12,2) DEFAULT NULL,
  `monthly_savings` decimal(12,2) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `solar_process`
--

CREATE TABLE `solar_process` (
  `id` varchar(64) NOT NULL,
  `step_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `short_description` text NOT NULL,
  `detailed_content` text DEFAULT NULL,
  `icon_name` varchar(50) NOT NULL DEFAULT 'check',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `solar_process`
--

INSERT INTO `solar_process` (`id`, `step_number`, `title`, `short_description`, `detailed_content`, `icon_name`, `is_active`, `created_at`) VALUES
('proc_1', 1, 'Registration on National Portal', 'Register at pmsuryaghar.gov.in with consumer account number.', 'Select your state DISCOM and enter consumer account number.', 'check', 1, '2026-07-21 19:35:44'),
('proc_2', 2, 'Feasibility Approval', 'DISCOM inspects grid feasibility and approves application.', 'DISCOM checks local transformer capacity.', 'check', 1, '2026-07-21 19:35:44'),
('proc_3', 3, 'Installation by Empaneled Vendor', 'Choose registered vendor to install DCR rooftop solar panels.', 'Panels must be DCR compliant for subsidy eligibility.', 'check', 1, '2026-07-21 19:35:44'),
('proc_4', 4, 'Net Metering & Commissioning', 'DISCOM installs bi-directional net meter and issues certificate.', 'Bi-directional meter tracks exported solar electricity.', 'check', 1, '2026-07-21 19:35:44'),
('proc_5', 5, 'Direct Subsidy Transfer (DBT)', 'Submit bank details on portal to receive subsidy in bank account.', 'Subsidy credited directly via DBT within 30 days.', 'check', 1, '2026-07-21 19:35:44'),
('proc_6a5fb4bf2d5f1', 6, 'Subsidy Verification & Direct Benefit Transfer', 'MNRE verification takes 30 days after DISCOM certificate upload', '', 'check', 1, '2026-07-21 20:04:47'),
('proc_6a61008291064', 6, 'Vendor Procurement', 'Select a registered vendor from the approved portal list.', 'Only empanelled vendors qualify for the subsidy release.', 'building-house', 1, '2026-07-22 19:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(64) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'admin',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `created_at`) VALUES
('usr_admin_default', 'admin', '$2y$10$psuhR/wGbWjerPLkkVxq6.k.9y1nfx6DTX6JkHUp9P8m/TGtqtrxi', 'admin@solarsubsidy.in', 'admin', '2026-07-21 19:35:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `daily_updates`
--
ALTER TABLE `daily_updates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `solar_process`
--
ALTER TABLE `solar_process`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
