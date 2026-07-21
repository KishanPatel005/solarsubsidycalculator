<?php
require_once __DIR__ . '/bootstrap.php';

use Repository\RepositoryFactory;

$slug = $_GET['slug'] ?? '';
$newsRepo = RepositoryFactory::create('news');
$update = $newsRepo->getBySlug($slug);

if (!$update) {
    http_response_code(404);
    $pageTitle = "Update Not Found | Daily Solar Updates";
    require_once __DIR__ . '/templates/layout/header.php';
    ?>
    <div class="py-12 text-center space-y-4">
        <h1 class="text-3xl font-bold text-slate-800">Industry Update Not Found</h1>
        <p class="text-slate-500">The requested solar news circular does not exist or has been archived.</p>
        <a href="<?= url('daily-updates.php') ?>" class="inline-block rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">Back to All Updates</a>
    </div>
    <?php
    require_once __DIR__ . '/templates/layout/footer.php';
    exit();
}

$pageTitle = htmlspecialchars($update['title']);
$pageDescription = htmlspecialchars($update['snippet']);

require_once __DIR__ . '/templates/layout/header.php';
?>
<div class="space-y-8 pb-16 max-w-4xl mx-auto">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li><a href="<?= url('daily-updates.php') ?>" class="hover:text-slate-800">Daily Updates</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium line-clamp-1"><?= htmlspecialchars($update['title']) ?></li>
        </ol>
    </nav>

    <!-- Post Header -->
    <div class="space-y-4">
        <div class="flex items-center gap-3 text-xs">
            <span class="rounded bg-purple-50 border border-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 uppercase tracking-wider">
                <?= htmlspecialchars($update['category'] ?? 'Industry Update') ?>
            </span>
            <span class="text-slate-400">Published on <?= date('d M Y, h:i A', strtotime($update['published_at'])) ?></span>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl leading-tight">
            <?= htmlspecialchars($update['title']) ?>
        </h1>
    </div>

    <!-- Article Content -->
    <article class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="text-sm font-semibold text-purple-900 bg-purple-50 p-4 rounded-xl border border-purple-100 leading-relaxed">
            📌 <strong>Summary:</strong> <?= htmlspecialchars($update['snippet']) ?>
        </div>

        <div class="prose max-w-none text-slate-700 space-y-4 leading-relaxed text-sm">
            <?= $update['content'] ?>
        </div>
    </article>

    <!-- Consultation Callout -->
    <div class="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-slate-900">Want to Stay Updated on Your State's Subsidy Rules?</h3>
        <p class="text-sm text-slate-500">Calculate your subsidy breakdown and get verified guidance for your installation.</p>
        <div>
            <a href="<?= url('calculator') ?>" class="rounded-md bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-solar-700 transition-colors inline-block">
                Open Solar Calculator →
            </a>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
