<?php

namespace Repository;

use Config\Config;
use PDO;

class MySqlLeadRepository implements ILeadRepository {
    private $pdo;

    public function __construct() {
        $host = Config::DB_HOST;
        $port = Config::DB_PORT;
        $db   = Config::DB_NAME;
        $user = Config::DB_USER;
        $pass = Config::DB_PASS;
        $charset = 'utf8mb4';

        // Connect without DB first to ensure it exists
        $dsnNoDb = "mysql:host=$host;port=$port;charset=$charset";
        try {
            $tempPdo = new PDO($dsnNoDb, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;");
            $tempPdo = null;

            // Connect to specific DB
            $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
            $this->pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);

            // Self-healing table structure
            $this->pdo->exec("CREATE TABLE IF NOT EXISTS `leads` (
                `id` VARCHAR(50) PRIMARY KEY,
                `timestamp` VARCHAR(50) NOT NULL,
                `name` VARCHAR(100) NOT NULL,
                `phone` VARCHAR(20) NOT NULL,
                `city` VARCHAR(100) NOT NULL,
                `state` VARCHAR(100) NULL,
                `bill` FLOAT NOT NULL,
                `calculator_type` VARCHAR(50) NOT NULL,
                `call_time` VARCHAR(50) NOT NULL,
                `subsidy_amount` FLOAT NULL,
                `final_cost` FLOAT NULL,
                `monthly_savings` FLOAT NULL,
                `ip_address` VARCHAR(50) NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        } catch (\PDOException $e) {
            // Keep pdo null; operations will check
            $this->pdo = null;
        }
    }

    public function save(array $leadData): bool {
        if (!$this->pdo) {
            return false;
        }
        try {
            $stmt = $this->pdo->prepare("INSERT INTO `leads` (
                `id`, `timestamp`, `name`, `phone`, `city`, `state`, `bill`, 
                `calculator_type`, `call_time`, `subsidy_amount`, `final_cost`, 
                `monthly_savings`, `ip_address`
            ) VALUES (
                :id, :timestamp, :name, :phone, :city, :state, :bill, 
                :calculator_type, :call_time, :subsidy_amount, :final_cost, 
                :monthly_savings, :ip_address
            )");

            return $stmt->execute([
                'id' => $leadData['id'] ?? '',
                'timestamp' => $leadData['timestamp'] ?? '',
                'name' => $leadData['name'] ?? '',
                'phone' => $leadData['phone'] ?? '',
                'city' => $leadData['city'] ?? '',
                'state' => $leadData['state'] ?? null,
                'bill' => (float)($leadData['bill'] ?? 0),
                'calculator_type' => $leadData['calculatorType'] ?? ($leadData['calculator_type'] ?? ''),
                'call_time' => $leadData['callTime'] ?? ($leadData['call_time'] ?? ''),
                'subsidy_amount' => isset($leadData['subsidyAmount']) ? (float)$leadData['subsidyAmount'] : (isset($leadData['subsidy_amount']) ? (float)$leadData['subsidy_amount'] : null),
                'final_cost' => isset($leadData['finalCost']) ? (float)$leadData['finalCost'] : (isset($leadData['final_cost']) ? (float)$leadData['final_cost'] : null),
                'monthly_savings' => isset($leadData['monthlySavings']) ? (float)$leadData['monthlySavings'] : (isset($leadData['monthly_savings']) ? (float)$leadData['monthly_savings'] : null),
                'ip_address' => $leadData['ipAddress'] ?? ($leadData['ip_address'] ?? null)
            ]);
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function getAll(): array {
        if (!$this->pdo) {
            return [];
        }
        try {
            $stmt = $this->pdo->query("SELECT * FROM `leads` ORDER BY `timestamp` DESC");
            $rows = $stmt->fetchAll();
            $leads = [];
            foreach ($rows as $row) {
                // Map database columns to front-end JSON keys
                $leads[] = [
                    'id' => $row['id'],
                    'timestamp' => $row['timestamp'],
                    'name' => $row['name'],
                    'phone' => $row['phone'],
                    'city' => $row['city'],
                    'state' => $row['state'],
                    'bill' => (float)$row['bill'],
                    'calculatorType' => $row['calculator_type'],
                    'callTime' => $row['call_time'],
                    'subsidyAmount' => ($row['subsidy_amount'] !== null) ? (float)$row['subsidy_amount'] : null,
                    'finalCost' => ($row['final_cost'] !== null) ? (float)$row['final_cost'] : null,
                    'monthlySavings' => ($row['monthly_savings'] !== null) ? (float)$row['monthly_savings'] : null,
                    'ipAddress' => $row['ip_address']
                ];
            }
            return $leads;
        } catch (\PDOException $e) {
            return [];
        }
    }
}
