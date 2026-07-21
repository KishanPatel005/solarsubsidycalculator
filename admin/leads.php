<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;
use Controllers\AdminController;
use Controllers\CmsController;
use Config\Config;

AuthManager::requireAuth();
CmsController::handleRequest();

$activeTab = 'leads';
$pageTitle = 'Leads Database';
$pageSubtitle = 'View and export customer solar consultation requests';

$controller = new AdminController();
$leads = $controller->getLeads(Config::ADMIN_PIN);
$stats = $controller->getStatsSummary($leads);

ob_start();
?>
<div class="space-y-6">
    <!-- Top Action Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-bold text-slate-800">Captured Leads Directory</h2>
        <button id="export-csv-btn" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 self-start sm:self-auto" <?= empty($leads) ? 'disabled' : '' ?>>
            <span>📥</span>
            <span>Export CSV Report</span>
        </button>
    </div>

    <!-- Metrics Slabs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Leads</div>
            <div class="mt-1 text-2xl font-extrabold text-slate-900"><?= $stats['totalLeads'] ?></div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Today's Submissions</div>
            <div class="mt-1 text-2xl font-extrabold text-slate-900"><?= $stats['todaysLeads'] ?></div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">This Week</div>
            <div class="mt-1 text-2xl font-extrabold text-slate-900"><?= $stats['thisWeeksLeads'] ?></div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Top State</div>
            <div class="mt-1 text-2xl font-extrabold text-slate-900 uppercase"><?= htmlspecialchars($stats['mostCommonState']) ?></div>
        </div>
    </div>

    <!-- Leads Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <?php if (!empty($leads)): ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="px-4 py-3">#</th>
                            <th class="px-4 py-3">Date</th>
                            <th class="px-4 py-3">Customer Name</th>
                            <th class="px-4 py-3">Phone</th>
                            <th class="px-4 py-3">City / State</th>
                            <th class="px-4 py-3">Monthly Bill</th>
                            <th class="px-4 py-3">Calc Type</th>
                            <th class="px-4 py-3">Est. Subsidy</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                        <?php foreach ($leads as $idx => $l):
                            $rowNum = $idx + 1;
                            $timeStr = !empty($l['timestamp']) ? date('d M Y, h:i A', strtotime($l['timestamp'])) : (!empty($l['created_at']) ? date('d M Y, h:i A', strtotime($l['created_at'])) : '—');
                            $waHref = !empty($l['phone']) ? 'https://wa.me/91' . preg_replace('/\D/', '', $l['phone']) : null;
                        ?>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-4 py-3 text-slate-400 font-bold"><?= $rowNum ?></td>
                                <td class="px-4 py-3 whitespace-nowrap text-slate-500 font-mono text-[11px]"><?= $timeStr ?></td>
                                <td class="px-4 py-3 font-bold text-slate-900"><?= htmlspecialchars($l['name'] ?? '—') ?></td>
                                <td class="px-4 py-3"><?= htmlspecialchars($l['phone'] ?? '—') ?></td>
                                <td class="px-4 py-3">
                                    <span><?= htmlspecialchars($l['city'] ?? '—') ?></span>
                                    <span class="text-slate-400 text-[10px] block uppercase"><?= htmlspecialchars($l['state'] ?? '—') ?></span>
                                </td>
                                <td class="px-4 py-3 font-semibold"><?= formatINR($l['bill'] ?? 0) ?></td>
                                <td class="px-4 py-3 uppercase text-[10px] font-semibold text-slate-500"><?= htmlspecialchars($l['calculatorType'] ?? 'subsidy') ?></td>
                                <td class="px-4 py-3 font-bold text-orange-600"><?= formatINR($l['subsidyAmount'] ?? 0) ?></td>
                                <td class="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                                    <?php if ($waHref): ?>
                                        <a href="<?= $waHref ?>" target="_blank" rel="noreferrer" class="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-semibold">WhatsApp</a>
                                    <?php endif; ?>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Delete this lead entry?')">
                                        <input type="hidden" name="action" value="delete_lead">
                                        <input type="hidden" name="id" value="<?= htmlspecialchars($l['id'] ?? '') ?>">
                                        <button type="submit" class="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[11px] font-semibold">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <script>
                const leadsData = <?= json_encode($leads) ?>;
            </script>
        <?php else: ?>
            <div class="p-12 text-center text-slate-500 space-y-3">
                <span class="text-4xl block">📥</span>
                <p class="text-sm font-semibold">No leads registered yet.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-csv-btn');
    if (!exportBtn || typeof leadsData === 'undefined') return;

    exportBtn.addEventListener('click', () => {
        const headers = ["#", "Date & Time", "Name", "Phone", "City", "State", "Monthly Bill", "Calculator Used", "Call Time", "Subsidy Amount"];
        const rows = leadsData.map((l, idx) => [
            idx + 1,
            l.timestamp || l.created_at || '',
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
        link.setAttribute('download', `Solar-Subsidy-Leads-${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
</script>
<?php
$adminContent = ob_get_clean();
require_once __DIR__ . '/layout.php';
?>
