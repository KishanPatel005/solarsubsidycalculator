<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;
use Controllers\CmsController;
use Repository\RepositoryFactory;

AuthManager::requireAuth();
CmsController::handleRequest();

$activeTab = 'process';
$pageTitle = 'Subsidy Process Manager';
$pageSubtitle = 'Define step-by-step application procedures displayed on the homepage';

$procRepo = RepositoryFactory::create('process');
$steps = $procRepo->getAll(false);

ob_start();
?>
<div class="space-y-6">
    <!-- Top Action Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">Solar Subsidy Application Steps</h2>
        <button type="button" onclick="openProcModal()" class="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center gap-1.5">
            <span>+</span>
            <span>Add Process Step</span>
        </button>
    </div>

    <!-- Process Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <?php if (!empty($steps)): ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="px-4 py-3 w-16 text-center">Step #</th>
                            <th class="px-4 py-3">Title & Description</th>
                            <th class="px-4 py-3">Icon</th>
                            <th class="px-4 py-3">Status</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                        <?php foreach ($steps as $p): ?>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-4 py-3 font-bold text-slate-900 text-center text-sm">
                                    Step <?= (int)($p['step_number'] ?? 1) ?>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="font-bold text-slate-900 block"><?= htmlspecialchars($p['title']) ?></span>
                                    <p class="text-slate-500 font-normal text-[11px] line-clamp-1 mt-0.5"><?= htmlspecialchars($p['short_description']) ?></p>
                                </td>
                                <td class="px-4 py-3 font-mono text-slate-600 text-[11px]">
                                    <?= htmlspecialchars($p['icon_name'] ?? 'check') ?>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded px-2 py-0.5 text-[10px] font-semibold <?= !empty($p['is_active']) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>">
                                        <?= !empty($p['is_active']) ? 'Active' : 'Hidden' ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right space-x-1">
                                    <button type="button" onclick='editProc(<?= json_encode($p) ?>)' class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-semibold">Edit</button>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Delete this process step?')">
                                        <input type="hidden" name="action" value="delete_process">
                                        <input type="hidden" name="id" value="<?= htmlspecialchars($p['id']) ?>">
                                        <button type="submit" class="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[11px] font-semibold">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <div class="p-12 text-center text-slate-500 space-y-3">
                <span class="text-4xl block">🔄</span>
                <p class="text-sm font-semibold">No process steps created yet.</p>
                <button type="button" onclick="openProcModal()" class="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">Add First Step</button>
            </div>
        <?php endif; ?>
    </div>

    <!-- Process Modal -->
    <div id="procModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 id="procModalTitle" class="font-bold text-slate-900 text-base">Add Process Step</h3>
                <button type="button" onclick="closeProcModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form id="procForm" method="POST" action="" class="p-6 space-y-4">
                <input type="hidden" name="action" value="save_process">
                <input type="hidden" name="id" id="proc_id" value="">

                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Step Number *</label>
                        <input type="number" name="step_number" id="proc_step_number" value="1" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Icon Badge</label>
                        <input type="text" name="icon_name" id="proc_icon_name" value="check" placeholder="user-check, building-store, zap, etc" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Step Title *</label>
                    <input type="text" name="title" id="proc_title" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Short Summary *</label>
                    <textarea name="short_description" id="proc_short_description" rows="2" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Detailed Procedure Guidance</label>
                    <textarea name="detailed_content" id="proc_detailed_content" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"></textarea>
                </div>

                <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="is_active" id="proc_is_active" value="1" checked class="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4">
                    <label for="proc_is_active" class="text-xs font-semibold text-slate-700">Display Active on Process Timeline</label>
                </div>

                <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button type="button" onclick="closeProcModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
                    <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow">Save Step</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openProcModal() {
        document.getElementById('procModal').classList.remove('hidden');
        document.getElementById('procModalTitle').innerText = 'Add Process Step';
        document.getElementById('procForm').reset();
        document.getElementById('proc_id').value = '';
    }

    function closeProcModal() {
        document.getElementById('procModal').classList.add('hidden');
    }

    function editProc(p) {
        openProcModal();
        document.getElementById('procModalTitle').innerText = 'Edit Process Step';
        document.getElementById('proc_id').value = p.id || '';
        document.getElementById('proc_step_number').value = p.step_number || 1;
        document.getElementById('proc_title').value = p.title || '';
        document.getElementById('proc_short_description').value = p.short_description || '';
        document.getElementById('proc_detailed_content').value = p.detailed_content || '';
        document.getElementById('proc_icon_name').value = p.icon_name || 'check';
        document.getElementById('proc_is_active').checked = !!p.is_active;
    }
</script>
<?php
$adminContent = ob_get_clean();
require_once __DIR__ . '/layout.php';
?>
