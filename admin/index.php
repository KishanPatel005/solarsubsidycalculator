<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\AuthManager;
use Repository\RepositoryFactory;

AuthManager::requireAuth();

$activeTab = 'dashboard';
$pageTitle = 'CMS Overview Dashboard';
$pageSubtitle = 'Quick metrics and content statistics overview';

$leadRepo = RepositoryFactory::create('lead');
$blogRepo = RepositoryFactory::create('blog');
$faqRepo = RepositoryFactory::create('faq');
$procRepo = RepositoryFactory::create('process');
$newsRepo = RepositoryFactory::create('news');

$leads = $leadRepo->getAll();
$blogs = $blogRepo->getAll(false);
$faqs = $faqRepo->getAll(false);
$process = $procRepo->getAll(false);
$news = $newsRepo->getAll(false);

ob_start();
?>
<div class="space-y-6">
    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Leads Stat -->
        <a href="<?= url('admin/leads.php') ?>" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads</span>
                <span class="p-2 rounded-xl bg-blue-50 text-blue-600 text-lg">📥</span>
            </div>
            <div class="mt-4">
                <span class="text-3xl font-extrabold text-slate-900"><?= count($leads) ?></span>
                <span class="text-xs text-slate-500 block mt-1">Captured Customer Submissions</span>
            </div>
        </a>

        <!-- Blogs Stat -->
        <a href="<?= url('admin/blogs.php') ?>" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blogs</span>
                <span class="p-2 rounded-xl bg-orange-50 text-orange-600 text-lg">📝</span>
            </div>
            <div class="mt-4">
                <span class="text-3xl font-extrabold text-slate-900"><?= count($blogs) ?></span>
                <span class="text-xs text-slate-500 block mt-1">CKEditor Dynamic Posts</span>
            </div>
        </a>

        <!-- FAQs Stat -->
        <a href="<?= url('admin/faqs.php') ?>" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">FAQs</span>
                <span class="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-lg">❓</span>
            </div>
            <div class="mt-4">
                <span class="text-3xl font-extrabold text-slate-900"><?= count($faqs) ?></span>
                <span class="text-xs text-slate-500 block mt-1">Homepage Accordion Items</span>
            </div>
        </a>

        <!-- Process Stat -->
        <a href="<?= url('admin/process.php') ?>" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Process Steps</span>
                <span class="p-2 rounded-xl bg-indigo-50 text-indigo-600 text-lg">🔄</span>
            </div>
            <div class="mt-4">
                <span class="text-3xl font-extrabold text-slate-900"><?= count($process) ?></span>
                <span class="text-xs text-slate-500 block mt-1">Subsidy Application Timeline</span>
            </div>
        </a>

        <!-- Updates Stat -->
        <a href="<?= url('admin/updates.php') ?>" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Updates</span>
                <span class="p-2 rounded-xl bg-purple-50 text-purple-600 text-lg">📰</span>
            </div>
            <div class="mt-4">
                <span class="text-3xl font-extrabold text-slate-900"><?= count($news) ?></span>
                <span class="text-xs text-slate-500 block mt-1">Solar Industry News</span>
            </div>
        </a>
    </div>

    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Leads Card -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-900 text-base">Latest Customer Enquiries</h3>
                <a href="<?= url('admin/leads.php') ?>" class="text-xs font-semibold text-orange-600 hover:underline">View All →</a>
            </div>
            <?php if (!empty($leads)): ?>
                <div class="divide-y divide-slate-100 text-xs">
                    <?php foreach (array_slice($leads, 0, 5) as $l): ?>
                        <div class="py-2.5 flex items-center justify-between">
                            <div>
                                <span class="font-bold text-slate-800 block"><?= htmlspecialchars($l['name']) ?></span>
                                <span class="text-slate-500"><?= htmlspecialchars($l['phone']) ?> • <?= htmlspecialchars($l['city']) ?></span>
                            </div>
                            <span class="rounded bg-slate-100 font-mono text-[10px] px-2 py-1 text-slate-600">
                                <?= date('d M H:i', strtotime($l['created_at'])) ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="text-xs text-slate-500 py-6 text-center">No customer leads captured yet.</p>
            <?php endif; ?>
        </div>

        <!-- Recent Blogs Card -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-900 text-base">Recent Dynamic Blogs</h3>
                <a href="<?= url('admin/blogs.php') ?>" class="text-xs font-semibold text-orange-600 hover:underline">Create Post +</a>
            </div>
            <?php if (!empty($blogs)): ?>
                <div class="divide-y divide-slate-100 text-xs">
                    <?php foreach (array_slice($blogs, 0, 5) as $b): ?>
                        <div class="py-2.5 flex items-center justify-between">
                            <div class="pr-4 truncate">
                                <a href="<?= url('blog/' . $b['slug']) ?>" target="_blank" class="font-bold text-slate-800 hover:text-orange-600 truncate block">
                                    <?= htmlspecialchars($b['title']) ?>
                                </a>
                                <span class="text-slate-500"><?= htmlspecialchars($b['category']) ?></span>
                            </div>
                            <span class="rounded px-2 py-0.5 text-[10px] font-semibold <?= !empty($b['is_published']) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' ?>">
                                <?= !empty($b['is_published']) ? 'Published' : 'Draft' ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="text-xs text-slate-500 py-6 text-center">No dynamic blog posts created yet. Click above to add one!</p>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php
$adminContent = ob_get_clean();
require_once __DIR__ . '/layout.php';
?>
