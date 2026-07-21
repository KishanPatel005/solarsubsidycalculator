<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;

AuthManager::initSession();

if (AuthManager::isAuthenticated()) {
    header('Location: ' . url('admin/index.php'));
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginType = $_POST['login_type'] ?? 'user';

    if ($loginType === 'pin') {
        $pin = trim($_POST['pin'] ?? '');
        if (AuthManager::loginWithPin($pin)) {
            header('Location: ' . url('admin/index.php'));
            exit();
        } else {
            $error = 'Invalid PIN passcode.';
        }
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');
        if (AuthManager::loginWithUsername($username, $password)) {
            header('Location: ' . url('admin/index.php'));
            exit();
        } else {
            $error = 'Invalid username or password.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Solar Subsidy CMS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md space-y-6">
        <!-- Logo Header -->
        <div class="text-center space-y-2">
            <div class="inline-flex items-center gap-2 text-2xl font-bold text-white">
                <span class="rounded-lg bg-orange-500 p-2 text-white">☀️</span>
                <span>Solar Subsidy Admin</span>
            </div>
            <p class="text-slate-400 text-sm">Control Panel & CMS Management</p>
        </div>

        <!-- Login Card -->
        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <?php if (!empty($error)): ?>
                <div class="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-center gap-2">
                    <span>⚠️</span>
                    <span><?= htmlspecialchars($error) ?></span>
                </div>
            <?php endif; ?>

            <!-- Tab Buttons -->
            <div class="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl text-sm font-semibold">
                <button type="button" id="tab-user" onclick="switchLoginTab('user')" class="py-2 rounded-lg text-white bg-slate-700 transition-colors">
                    Username / Pass
                </button>
                <button type="button" id="tab-pin" onclick="switchLoginTab('pin')" class="py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                    PIN Passcode
                </button>
            </div>

            <!-- Username Form -->
            <form id="form-user" method="POST" action="" class="space-y-4">
                <input type="hidden" name="login_type" value="user">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Username</label>
                    <input type="text" name="username" required value="admin" placeholder="admin" class="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                    <input type="password" name="password" required placeholder="••••••••" class="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none text-sm">
                </div>
                <button type="submit" class="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all">
                    Sign In to Dashboard →
                </button>
            </form>

            <!-- PIN Form -->
            <form id="form-pin" method="POST" action="" class="space-y-4 hidden">
                <input type="hidden" name="login_type" value="pin">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Enter PIN Passcode</label>
                    <input type="password" name="pin" maxlength="10" placeholder="e.g. 5498" class="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-center text-xl tracking-widest text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none">
                </div>
                <button type="submit" class="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all">
                    Unlock Admin Panel →
                </button>
            </form>

            <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-700">
                Default Credentials: <code class="text-slate-300">admin</code> / <code class="text-slate-300">admin123</code> (PIN: <code class="text-slate-300">5498</code>)
            </div>
        </div>

        <div class="text-center">
            <a href="<?= url('/') ?>" class="text-xs text-slate-500 hover:text-slate-300 transition-colors">← Return to Main Website</a>
        </div>
    </div>

    <script>
        function switchLoginTab(type) {
            const formUser = document.getElementById('form-user');
            const formPin = document.getElementById('form-pin');
            const tabUser = document.getElementById('tab-user');
            const tabPin = document.getElementById('tab-pin');

            if (type === 'pin') {
                formUser.classList.add('hidden');
                formPin.classList.remove('hidden');
                tabPin.className = 'py-2 rounded-lg text-white bg-slate-700 transition-colors';
                tabUser.className = 'py-2 rounded-lg text-slate-400 hover:text-white transition-colors';
            } else {
                formPin.classList.add('hidden');
                formUser.classList.remove('hidden');
                tabUser.className = 'py-2 rounded-lg text-white bg-slate-700 transition-colors';
                tabPin.className = 'py-2 rounded-lg text-slate-400 hover:text-white transition-colors';
            }
        }
    </script>
</body>
</html>
