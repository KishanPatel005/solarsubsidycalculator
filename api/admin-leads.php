<?php
// GET /api/admin-leads
header('Content-Type: application/json');
require_once __DIR__ . '/../bootstrap.php';

use Controllers\AdminController;

$controller = new AdminController();

// For simple integration, retrieve leads using the configured Admin PIN
$leads = $controller->getLeads(\Config\Config::ADMIN_PIN);

echo json_encode($leads);
exit();
