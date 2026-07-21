<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;

AuthManager::logout();
header('Location: ' . url('admin/login.php'));
exit();
