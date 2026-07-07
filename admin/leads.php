<?php
require_once __DIR__ . '/../bootstrap.php';

use Controllers\AdminController;
use Config\Config;

$controller = new AdminController();
$error = null;

// Handle PIN form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pin'])) {
    $enteredPin = $_POST['pin'];
    if ($controller->authorize($enteredPin)) {
        $_SESSION['admin_authorized'] = true;
    } else {
        $error = "Incorrect PIN. Try again.";
    }
}

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['admin_authorized']);
    header("Location: " . url('admin/leads'));
    exit();
}

$unlocked = isset($_SESSION['admin_authorized']) && $_SESSION['admin_authorized'] === true;

$pageTitle = "Admin Dashboard | Solar Subsidy Calculator";
require_once __DIR__ . '/../templates/layout/header.php';
?>
<div class="space-y-6 pb-12">
    <?php if (!$unlocked): ?>
        <!-- PIN Login Panel -->
        <div class="flex min-h-[50vh] items-center justify-center px-4">
            <div class="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
                <form method="POST" class="space-y-6">
                    <div class="flex flex-col items-center text-center">
                        <img src="<?= url('logo.png') ?>" alt="Solar Subsidy Calculator" class="h-10 w-auto" />
                        <h1 class="mt-5 text-xl font-bold text-slate-800">Admin Access</h1>
                        <p class="mt-1 text-sm text-slate-500">Enter PIN to view leads</p>
                    </div>

                    <div class="space-y-3">
                        <input type="password" name="pin" required inputmode="numeric" maxlength="4" placeholder="••••" 
                               class="w-full rounded-md border border-slate-200 px-3 py-2.5 text-center text-lg tracking-widest focus:border-orange-500 focus:outline-none transition-colors">
                        
                        <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-2.5 text-sm font-semibold text-white transition-colors">
                            View Leads
                        </button>
                        
                        <?php if ($error): ?>
                            <p class="text-sm text-red-600 text-center font-medium"><?= htmlspecialchars($error) ?></p>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
        </div>
    <?php else:
        // Load leads & calculate metrics
        $leads = $controller->getLeads(Config::ADMIN_PIN);
        $stats = $controller->getStatsSummary($leads);
    ?>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
                <h1 class="text-2xl font-bold tracking-tight text-slate-800">
                    Solar Subsidy Calculator Leads Dashboard
                </h1>
                <div class="flex flex-wrap items-center gap-2 text-xs">
                    <span class="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">Total Leads: <?= count($leads) ?></span>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <button id="export-csv-btn" class="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5" <?= empty($leads) ? 'disabled' : '' ?>>
                    📥 Export CSV
                </button>
                <a href="?action=logout" class="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5">
                    🚪 Logout
                </a>
            </div>
        </div>

        <!-- Summary Metrics Slabs -->
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400 uppercase font-semibold">Total Leads</div>
                <div class="mt-1 text-xl font-bold text-slate-800"><?= $stats['totalLeads'] ?></div>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400 uppercase font-semibold">Today's Leads</div>
                <div class="mt-1 text-xl font-bold text-slate-800"><?= $stats['todaysLeads'] ?></div>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400 uppercase font-semibold">This Week's Leads</div>
                <div class="mt-1 text-xl font-bold text-slate-800"><?= $stats['thisWeeksLeads'] ?></div>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400 uppercase font-semibold">Most Common State</div>
                <div class="mt-1 text-xl font-bold text-slate-800"><?= htmlspecialchars($stats['mostCommonState']) ?></div>
            </div>
        </div>

        <!-- Leads Table -->
        <div class="rounded-xl border bg-white overflow-hidden shadow-sm">
            <?php if (!empty($leads)): ?>
                <div class="w-full overflow-x-auto">
                    <table class="w-full border-collapse text-sm text-left">
                        <thead class="bg-orange-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b">
                            <tr>
                                <th class="px-4 py-3">#</th>
                                <th class="px-4 py-3">Date & Time</th>
                                <th class="px-4 py-3">Name</th>
                                <th class="px-4 py-3">Phone</th>
                                <th class="px-4 py-3">City</th>
                                <th class="px-4 py-3">State</th>
                                <th class="px-4 py-3">Monthly Bill</th>
                                <th class="px-4 py-3">Calculator</th>
                                <th class="px-4 py-3">Call Time</th>
                                <th class="px-4 py-3">Subsidy</th>
                                <th class="px-4 py-3">Chat</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y text-slate-600">
                            <?php foreach ($leads as $idx => $l):
                                $rowNum = $idx + 1;
                                $timeStr = !empty($l['timestamp']) ? date('d M Y, h:i A', strtotime($l['timestamp'])) : '—';
                                $waHref = !empty($l['phone']) ? 'https://wa.me/91' . preg_replace('/\D/', '', $l['phone']) : null;
                            ?>
                                <tr class="hover:bg-slate-50/50">
                                    <td class="px-4 py-3 font-medium"><?= $rowNum ?></td>
                                    <td class="px-4 py-3 whitespace-nowrap"><?= $timeStr ?></td>
                                    <td class="px-4 py-3 font-semibold text-slate-800"><?= htmlspecialchars($l['name'] ?? '—') ?></td>
                                    <td class="px-4 py-3"><?= htmlspecialchars($l['phone'] ?? '—') ?></td>
                                    <td class="px-4 py-3"><?= htmlspecialchars($l['city'] ?? '—') ?></td>
                                    <td class="px-4 py-3 uppercase text-[11px]"><?= htmlspecialchars($l['state'] ?? '—') ?></td>
                                    <td class="px-4 py-3 font-semibold"><?= formatINR($l['bill'] ?? 0) ?></td>
                                    <td class="px-4 py-3 capitalize"><?= htmlspecialchars($l['calculatorType'] ?? '—') ?></td>
                                    <td class="px-4 py-3 capitalize"><?= htmlspecialchars($l['callTime'] ?? '—') ?></td>
                                    <td class="px-4 py-3 font-bold text-orange-600"><?= formatINR($l['subsidyAmount'] ?? 0) ?></td>
                                    <td class="px-4 py-3">
                                        <?php if ($waHref): ?>
                                            <a href="<?= $waHref ?>" target="_blank" rel="noreferrer" class="rounded border p-1 px-2.5 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors inline-flex items-center gap-1">
                                                💬 WhatsApp
                                            </a>
                                        <?php else: ?>
                                            —
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Safe leads list payload passed directly to Javascript downloader -->
                <script>
                    const leadsData = <?= json_encode($leads) ?>;
                </script>
            <?php else: ?>
                <div class="p-8 text-center space-y-4">
                    <p class="text-sm text-slate-500">
                        No leads registered yet. <br />
                        Promote your web app to start receiving consultation details!
                    </p>
                    <a href="<?= url('/') ?>" class="rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700 transition-colors inline-block">
                        Back to site
                    </a>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-csv-btn');
    if (!exportBtn || typeof leadsData === 'undefined') return;

    exportBtn.addEventListener('click', () => {
        const headers = [
            "#", "Date & Time", "Name", "Phone", "City", "State", "Monthly Bill", "Calculator Used", "Call Time", "Subsidy Amount"
        ];

        const rows = leadsData.map((l, idx) => [
            idx + 1,
            l.timestamp || '',
            l.name || '',
            l.phone || '',
            l.city || '',
            l.state || '',
            l.bill || 0,
            l.calculatorType || '',
            l.callTime || '',
            l.subsidyAmount || 0
        ]);

        const toCsvValue = (val) => {
            const str = val === null || val === undefined ? '' : String(val);
            return `"${str.replace(/"/g, '""')}"`;
        };

        const csvContent = [headers, ...rows].map(r => r.map(toCsvValue).join(',')).join('\n') + '\n';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Solar-Subsidy-Calculator-Leads-${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
</script>
<?php require_once __DIR__ . '/../templates/layout/footer.php'; ?>
