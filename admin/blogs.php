<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;
use Controllers\CmsController;
use Repository\RepositoryFactory;

AuthManager::requireAuth();
CmsController::handleRequest();

$activeTab = 'blogs';
$pageTitle = 'Blog Posts Manager';
$pageSubtitle = 'Create and edit dynamic blog posts with CKEditor 5';

$blogRepo = RepositoryFactory::create('blog');
$blogs = $blogRepo->getAll(false);

$editingId = $_GET['edit'] ?? '';
$editingBlog = $editingId ? $blogRepo->getById($editingId) : null;

ob_start();
?>
<div class="space-y-6">
    <!-- Top Action Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">Dynamic Blogs Directory</h2>
        <button type="button" onclick="openBlogModal()" class="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-1.5">
            <span>+</span>
            <span>Create New Post (CKEditor)</span>
        </button>
    </div>

    <!-- Blogs Table Card -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <?php if (!empty($blogs)): ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="px-4 py-3">Title</th>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3">Slug</th>
                            <th class="px-4 py-3">Status</th>
                            <th class="px-4 py-3">Created</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                        <?php foreach ($blogs as $b): ?>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-4 py-3 font-bold text-slate-900 max-w-xs truncate">
                                    <?= htmlspecialchars($b['title']) ?>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded bg-orange-50 border border-orange-100 text-orange-700 font-semibold px-2 py-0.5 text-[10px]">
                                        <?= htmlspecialchars($b['category']) ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-slate-500 font-mono text-[11px]">
                                    <?= htmlspecialchars($b['slug']) ?>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded px-2 py-0.5 text-[10px] font-semibold <?= !empty($b['is_published']) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' ?>">
                                        <?= !empty($b['is_published']) ? 'Published' : 'Draft' ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-slate-500 text-[11px]">
                                    <?= date('d M Y', strtotime($b['created_at'])) ?>
                                </td>
                                <td class="px-4 py-3 text-right space-x-1">
                                    <a href="<?= url('blog/' . $b['slug']) ?>" target="_blank" class="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px]">View</a>
                                    <button type="button" onclick='editBlog(<?= json_encode($b) ?>)' class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-semibold">Edit</button>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Delete this blog post?')">
                                        <input type="hidden" name="action" value="delete_blog">
                                        <input type="hidden" name="id" value="<?= htmlspecialchars($b['id']) ?>">
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
                <span class="text-4xl block">📝</span>
                <p class="text-sm font-semibold">No dynamic blog posts created yet.</p>
                <button type="button" onclick="openBlogModal()" class="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow">
                    Create First Blog Post
                </button>
            </div>
        <?php endif; ?>
    </div>

    <!-- Blog Editor Modal -->
    <div id="blogModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <!-- Modal Header -->
            <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 id="modalTitle" class="font-bold text-slate-900 text-base">Create Blog Post</h3>
                <button type="button" onclick="closeBlogModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <!-- Modal Form Body -->
            <form id="blogForm" method="POST" action="" class="p-6 overflow-y-auto space-y-4 flex-1">
                <input type="hidden" name="action" value="save_blog">
                <input type="hidden" name="id" id="blog_id" value="">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                        <input type="text" name="title" id="blog_title" required onkeyup="autoSlug()" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Slug (URL)</label>
                        <input type="text" name="slug" id="blog_slug" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono focus:border-orange-500 focus:outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                        <input type="text" name="category" id="blog_category" placeholder="e.g. Schemes, PM Surya Ghar" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Reading Time</label>
                        <input type="text" name="reading_time" id="blog_reading_time" value="5 min" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                        <input type="text" name="author" id="blog_author" value="Solar Expert" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
                    <input type="text" name="cover_image" id="blog_cover_image" placeholder="logo.png or https://..." class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Short Description / Excerpt</label>
                    <textarea name="description" id="blog_description" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Main Body Content (CKEditor 5) *</label>
                    <div class="border border-slate-300 rounded-xl overflow-hidden">
                        <textarea name="content" id="editor" rows="10" class="w-full p-3 text-xs"></textarea>
                    </div>
                </div>

                <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="is_published" id="blog_is_published" value="1" checked class="rounded text-orange-500 focus:ring-orange-500 h-4 w-4">
                    <label for="blog_is_published" class="text-xs font-semibold text-slate-700">Publish Immediately on Website</label>
                </div>

                <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button type="button" onclick="closeBlogModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
                    <button type="submit" class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow">Save Blog Post</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    let editorInstance = null;

    ClassicEditor
        .create(document.querySelector('#editor'), {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo']
        })
        .then(editor => {
            editorInstance = editor;
        })
        .catch(error => {
            console.error('CKEditor Init Error:', error);
        });

    function openBlogModal() {
        document.getElementById('blogModal').classList.remove('hidden');
        document.getElementById('modalTitle').innerText = 'Create Blog Post';
        document.getElementById('blogForm').reset();
        document.getElementById('blog_id').value = '';
        if (editorInstance) editorInstance.setData('');
    }

    function closeBlogModal() {
        document.getElementById('blogModal').classList.add('hidden');
    }

    function editBlog(b) {
        openBlogModal();
        document.getElementById('modalTitle').innerText = 'Edit Blog Post';
        document.getElementById('blog_id').value = b.id || '';
        document.getElementById('blog_title').value = b.title || '';
        document.getElementById('blog_slug').value = b.slug || '';
        document.getElementById('blog_category').value = b.category || 'General';
        document.getElementById('blog_reading_time').value = b.reading_time || '5 min';
        document.getElementById('blog_author').value = b.author || 'Solar Expert';
        document.getElementById('blog_cover_image').value = b.cover_image || '';
        document.getElementById('blog_description').value = b.description || '';
        document.getElementById('blog_is_published').checked = !!b.is_published;

        if (editorInstance) {
            editorInstance.setData(b.content || '');
        }
    }

    function autoSlug() {
        const title = document.getElementById('blog_title').value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        document.getElementById('blog_slug').value = slug;
    }
</script>
<?php
$adminContent = ob_get_clean();
require_once __DIR__ . '/layout.php';
?>
