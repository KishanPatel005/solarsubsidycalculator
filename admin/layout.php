<?php
require_once __DIR__ . '/../bootstrap.php';

use Config\Config;
use Core\AuthManager;

AuthManager::requireAuth();
$currentUser = AuthManager::getCurrentUser();
$activeTab = $activeTab ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Admin CMS Dashboard') ?> | Solar Subsidy Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
    <!-- CKEditor 5 CDN -->
    <script src="<?= Config::CKEDITOR_CDN ?>"></script>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
            <!-- Header Brand -->
            <div class="p-5 border-b border-slate-800 flex items-center justify-between">
                <a href="<?= url('admin/index.php') ?>" class="flex items-center gap-2 text-lg font-bold text-white">
                    <span class="rounded bg-orange-500 p-1.5 text-white text-sm">☀️</span>
                    <span>Solar CMS Admin</span>
                </a>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10">
                    <?= strtoupper(Config::DB_DRIVER) ?>
                </span>
            </div>

            <!-- Nav Links -->
            <nav class="p-4 space-y-1 text-sm font-medium">
                <a href="<?= url('admin/index.php') ?>" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all <?= $activeTab === 'dashboard' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold' : 'hover:bg-slate-800 hover:text-white' ?>">
                    <span>📊</span>
                    <span>Dashboard</span>
                </a>
                <a href="<?= url('admin/blogs.php') ?>" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all <?= $activeTab === 'blogs' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold' : 'hover:bg-slate-800 hover:text-white' ?>">
                    <span>📝</span>
                    <span>Blogs (CKEditor)</span>
                </a>
                <a href="<?= url('admin/faqs.php') ?>" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all <?= $activeTab === 'faqs' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold' : 'hover:bg-slate-800 hover:text-white' ?>">
                    <span>❓</span>
                    <span>Homepage FAQs</span>
                </a>
                <a href="<?= url('admin/process.php') ?>" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all <?= $activeTab === 'process' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold' : 'hover:bg-slate-800 hover:text-white' ?>">
                    <span>🔄</span>
                    <span>Subsidy Process</span>
                </a>
                <a href="<?= url('admin/updates.php') ?>" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all <?= $activeTab === 'updates' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold' : 'hover:bg-slate-800 hover:text-white' ?>">
                    <span>📰</span>
                    <span>Daily Solar Updates</span>
                </a>
                <a href="<?= url('admin/leads.php') ?>" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all <?= $activeTab === 'leads' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold' : 'hover:bg-slate-800 hover:text-white' ?>">
                    <span>📥</span>
                    <span>Leads Database</span>
                </a>
            </nav>
        </div>

        <!-- User Profile Footer -->
        <div class="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 overflow-hidden">
                <div class="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-orange-400 border border-slate-700">
                    <?= strtoupper(substr($currentUser['username'] ?? 'A', 0, 1)) ?>
                </div>
                <div class="truncate">
                    <p class="font-semibold text-slate-200 truncate"><?= htmlspecialchars($currentUser['username'] ?? 'Admin') ?></p>
                    <p class="text-slate-500 text-[10px] truncate"><?= htmlspecialchars($currentUser['role'] ?? 'Administrator') ?></p>
                </div>
            </div>
            <a href="<?= url('admin/logout.php') ?>" title="Logout" class="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                🚪
            </a>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 flex flex-col min-h-screen">
        <!-- Top Navigation Bar -->
        <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div>
                <h1 class="text-xl font-bold text-slate-900 tracking-tight"><?= htmlspecialchars($pageTitle ?? 'Dashboard') ?></h1>
                <p class="text-xs text-slate-500 mt-0.5"><?= htmlspecialchars($pageSubtitle ?? 'Manage platform content and customer interactions') ?></p>
            </div>
            <div class="flex items-center gap-3">
                <a href="<?= url('/') ?>" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <span>🌐</span>
                    <span>View Main Site</span>
                </a>
            </div>
        </header>

        <!-- Dynamic Content Body -->
        <div class="p-6 flex-1">
            <?= $adminContent ?? '' ?>
        </div>
    </main>
</body>
</html>
