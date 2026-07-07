<?php
require_once __DIR__ . '/../bootstrap.php';

$lang = $_GET['lang'] ?? 'en';
$redirect = $_GET['redirect'] ?? '';

// Sanitize redirect URL
if (empty($redirect) || strpos($redirect, 'http') === 0 && strpos($redirect, \Config\Config::SITE_URL) !== 0) {
    $redirect = url('/');
}

// Set session
if ($lang === 'hi') {
    $_SESSION['lang'] = 'hi';
} else {
    $_SESSION['lang'] = 'en';
}

header("Location: " . $redirect);
exit();
