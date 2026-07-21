<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;
use Controllers\CmsController;
use Repository\RepositoryFactory;

AuthManager::requireAuth();
CmsController::handleRequest();

$activeTab = 'updates';
$pageTitle = 'Daily Solar Updates Manager';
$pageSubtitle = 'Publish industry announcements, policy updates, and solar news';

$newsRepo = RepositoryFactory::create('news');
$updates = $newsRepo->getAll(false);

ob_start();
?>
<div class="space-y-6">
    <!-- Top Action Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">Industry Updates Directory</h2>
        <button type="button" onclick="openNewsModal()" class="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-purple-700 transition-all flex items-center gap-1.5">
            <span>+</span>
            <span>Add Daily Update</span>
        </button>
    </div>

    <!-- Updates Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <?php if (!empty($updates)): ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="px-4 py-3">Headline</th>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3">Slug</th>
                            <th class="px-4 py-3">Featured</th>
                            <th class="px-4 py-3">Published Date</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                        <?php foreach ($updates as $u): ?>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-4 py-3 font-bold text-slate-900 max-w-xs truncate">
                                    <?= htmlspecialchars($u['title']) ?>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded bg-purple-50 border border-purple-100 text-purple-700 font-semibold px-2 py-0.5 text-[10px]">
                                        <?= htmlspecialchars($u['category'] ?? 'Industry News') ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-slate-500 font-mono text-[11px]">
                                    <?= htmlspecialchars($u['slug']) ?>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded px-2 py-0.5 text-[10px] font-semibold <?= !empty($u['is_featured']) ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500' ?>">
                                        <?= !empty($u['is_featured']) ? '⭐ Featured' : 'Standard' ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-slate-500 text-[11px]">
                                    <?= date('d M Y', strtotime($u['published_at'])) ?>
                                </td>
                                <td class="px-4 py-3 text-right space-x-1">
                                    <a href="<?= url('daily-update/' . $u['slug']) ?>" target="_blank" class="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px]">View</a>
                                    <button type="button" onclick='editNews(<?= json_encode($u) ?>)' class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-semibold">Edit</button>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Delete this update?')">
                                        <input type="hidden" name="action" value="delete_update">
                                        <input type="hidden" name="id" value="<?= htmlspecialchars($u['id']) ?>">
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
                <span class="text-4xl block">📰</span>
                <p class="text-sm font-semibold">No daily solar updates added yet.</p>
                <button type="button" onclick="openNewsModal()" class="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow">Add First Update</button>
            </div>
        <?php endif; ?>
    </div>

    <!-- News Modal -->
    <div id="newsModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 id="newsModalTitle" class="font-bold text-slate-900 text-base">Add Solar Industry Update</h3>
                <button type="button" onclick="closeNewsModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form id="newsForm" method="POST" action="" class="p-6 overflow-y-auto space-y-4 flex-1">
                <input type="hidden" name="action" value="save_update">
                <input type="hidden" name="id" id="news_id" value="">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Headline Title *</label>
                        <input type="text" name="title" id="news_title" required onkeyup="autoNewsSlug()" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Slug (URL)</label>
                        <input type="text" name="slug" id="news_slug" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono focus:border-purple-500 focus:outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                        <input type="text" name="category" id="news_category" value="Industry News" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Published Date</label>
                        <input type="datetime-local" name="published_at" id="news_published_at" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Thumbnail / Image URL</label>
                    <input type="text" name="image_url" id="news_image_url" placeholder="logo.png or image link" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Short Snippet / Brief *</label>
                    <textarea name="snippet" id="news_snippet" rows="2" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Detailed Content (HTML) *</label>
                    <textarea name="content" id="news_content" rows="6" required class="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-purple-500 focus:outline-none"></textarea>
                </div>

                <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="is_featured" id="news_is_featured" value="1" class="rounded text-purple-600 focus:ring-purple-500 h-4 w-4">
                    <label for="news_is_featured" class="text-xs font-semibold text-slate-700">Mark as ⭐ Featured Update on Homepage</label>
                </div>

                <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button type="button" onclick="closeNewsModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
                    <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow">Save Update</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openNewsModal() {
        document.getElementById('newsModal').classList.remove('hidden');
        document.getElementById('newsModalTitle').innerText = 'Add Solar Industry Update';
        document.getElementById('newsForm').reset();
        document.getElementById('news_id').value = '';
    }

    function closeNewsModal() {
        document.getElementById('newsModal').classList.add('hidden');
    }

    function editNews(u) {
        openNewsModal();
        document.getElementById('newsModalTitle').innerText = 'Edit Solar Industry Update';
        document.getElementById('news_id').value = u.id || '';
        document.getElementById('news_title').value = u.title || '';
        document.getElementById('news_slug').value = u.slug || '';
        document.getElementById('news_category').value = u.category || 'Industry News';
        document.getElementById('news_snippet').value = u.snippet || '';
        document.getElementById('news_content').value = u.content || '';
        document.getElementById('news_image_url').value = u.image_url || '';
        document.getElementById('news_is_featured').checked = !!u.is_featured;
    }

    function autoNewsSlug() {
        const title = document.getElementById('news_title').value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        document.getElementById('news_slug').value = slug;
    }
</script>
<?php
$adminContent = ob_get_clean();
require_once __DIR__ . '/layout.php';
?>
