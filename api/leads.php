<?php
// POST /api/leads
header('Content-Type: application/json');
require_once __DIR__ . '/../bootstrap.php';

use Controllers\LeadController;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON input']);
    exit();
}

$controller = new LeadController();
$response = $controller->submitLead($data);

if (!$response['ok']) {
    http_response_code(400);
}

echo json_encode($response);
exit();
