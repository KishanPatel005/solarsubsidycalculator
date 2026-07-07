<?php

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Autoloader for namespaced classes in 'src/' and 'config/'
spl_autoload_register(function ($class) {
    // Config namespace maps to /config directory
    if (strpos($class, 'Config\\') === 0) {
        $base_dir = __DIR__ . '/config/';
        $relative_class = substr($class, 7);
        $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    // Default mapping: src/ relative to root
    $base_dir = __DIR__ . '/src/';
    $file = $base_dir . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Global currency formatting helper
function formatINR($amount): string {
    if ($amount === null || $amount === '') return '—';
    $val = round((float)$amount);
    if ($val < 0) return '—';
    return '₹' . number_format($val, 0, '.', ',');
}

// Root-relative URL helper linking Config::SITE_URL
function url(string $path = ''): string {
    $base = \Config\Config::SITE_URL;
    return rtrim($base, '/') . '/' . ltrim($path, '/');
}

// Current language state helper
function currentLang(): string {
    return $_SESSION['lang'] ?? 'en';
}
