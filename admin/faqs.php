<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;
use Controllers\CmsController;
use Repository\RepositoryFactory;

AuthManager::requireAuth();
CmsController::handleRequest();

$activeTab = 'faqs';
$pageTitle = 'Homepage FAQs Manager';
$pageSubtitle = 'Manage dynamic questions and answers displayed on the homepage';

$faqRepo = RepositoryFactory::create('faq');
$faqs = $faqRepo->getAll(false);

ob_start();
?>
<div class="space-y-6">
    <!-- Top Action Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">Frequently Asked Questions</h2>
        <button type="button" onclick="openFaqModal()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5">
            <span>+</span>
            <span>Add New FAQ</span>
        </button>
    </div>

    <!-- FAQs Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <?php if (!empty($faqs)): ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="px-4 py-3 w-16 text-center">Order</th>
                            <th class="px-4 py-3">Question</th>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3">Status</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                        <?php foreach ($faqs as $f): ?>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-4 py-3 font-bold text-slate-700 text-center">
                                    <?= (int)($f['display_order'] ?? 0) ?>
                                </td>
                                <td class="px-4 py-3 font-bold text-slate-900">
                                    <?= htmlspecialchars($f['question']) ?>
                                    <p class="text-slate-500 font-normal text-[11px] line-clamp-1 mt-0.5"><?= htmlspecialchars($f['answer']) ?></p>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 text-[10px]">
                                        <?= htmlspecialchars($f['category'] ?? 'General') ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded px-2 py-0.5 text-[10px] font-semibold <?= !empty($f['is_active']) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>">
                                        <?= !empty($f['is_active']) ? 'Active' : 'Hidden' ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right space-x-1">
                                    <button type="button" onclick='editFaq(<?= json_encode($f) ?>)' class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-semibold">Edit</button>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Delete this FAQ?')">
                                        <input type="hidden" name="action" value="delete_faq">
                                        <input type="hidden" name="id" value="<?= htmlspecialchars($f['id']) ?>">
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
                <span class="text-4xl block">❓</span>
                <p class="text-sm font-semibold">No FAQs added yet.</p>
                <button type="button" onclick="openFaqModal()" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow">Add First FAQ</button>
            </div>
        <?php endif; ?>
    </div>

    <!-- FAQ Modal -->
    <div id="faqModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 id="faqModalTitle" class="font-bold text-slate-900 text-base">Add FAQ</h3>
                <button type="button" onclick="closeFaqModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form id="faqForm" method="POST" action="" class="p-6 space-y-4">
                <input type="hidden" name="action" value="save_faq">
                <input type="hidden" name="id" id="faq_id" value="">

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Question *</label>
                    <input type="text" name="question" id="faq_question" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Answer *</label>
                    <textarea name="answer" id="faq_answer" rows="4" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                        <input type="number" name="display_order" id="faq_display_order" value="1" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                        <input type="text" name="category" id="faq_category" value="General" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none">
                    </div>
                </div>

                <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="is_active" id="faq_is_active" value="1" checked class="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4">
                    <label for="faq_is_active" class="text-xs font-semibold text-slate-700">Display Active on Homepage</label>
                </div>

                <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button type="button" onclick="closeFaqModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
                    <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow">Save FAQ</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openFaqModal() {
        document.getElementById('faqModal').classList.remove('hidden');
        document.getElementById('faqModalTitle').innerText = 'Add FAQ';
        document.getElementById('faqForm').reset();
        document.getElementById('faq_id').value = '';
    }

    function closeFaqModal() {
        document.getElementById('faqModal').classList.add('hidden');
    }

    function editFaq(f) {
        openFaqModal();
        document.getElementById('faqModalTitle').innerText = 'Edit FAQ';
        document.getElementById('faq_id').value = f.id || '';
        document.getElementById('faq_question').value = f.question || '';
        document.getElementById('faq_answer').value = f.answer || '';
        document.getElementById('faq_display_order').value = f.display_order || 0;
        document.getElementById('faq_category').value = f.category || 'General';
        document.getElementById('faq_is_active').checked = !!f.is_active;
    }
</script>
<?php
$adminContent = ob_get_clean();
require_once __DIR__ . '/layout.php';
?>
