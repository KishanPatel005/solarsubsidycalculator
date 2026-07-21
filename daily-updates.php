<?php
$pageTitle = "Daily Solar Updates & Industry Circulars 2026 | Solar Subsidy";
$pageDescription = "Stay informed with daily rooftop solar policy circulars, MNRE ALMM updates, DISCOM net metering timelines, and bank loan rate changes.";
require_once __DIR__ . '/templates/layout/header.php';

use Repository\RepositoryFactory;

$newsRepo = RepositoryFactory::create('news');
$updates = $newsRepo->getAll(false);
?>
<div class="space-y-8 pb-16">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium">Daily Solar Updates</li>
        </ol>
    </nav>

    <!-- Header Section -->
    <div class="space-y-3">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
            <span>📰 Daily Solar News & Circulars</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Solar Industry Policy & DISCOM Updates
        </h1>
        <p class="text-sm text-slate-500 sm:text-base max-w-3xl leading-relaxed">
            Real-time tracking of MNRE policy circulars, PM Surya Ghar vendor empanelments, and regional DISCOM net-metering speed updates.
        </p>
    </div>

    <!-- Updates List Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <?php if (!empty($updates)): foreach ($updates as $u):
            $uUrl = url('daily-update/' . $u['slug']);
            $dateStr = date('d M Y', strtotime($u['published_at'] ?? $u['created_at']));
        ?>
            <article class="rounded-2xl border bg-white overflow-hidden shadow-sm flex flex-col justify-between hover:border-purple-200 hover:shadow-md transition-all">
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between text-xs text-slate-400">
                        <span class="rounded bg-purple-50 border border-purple-100 text-purple-700 font-semibold px-2 py-0.5 uppercase tracking-wider text-[10px]">
                            <?= htmlspecialchars($u['category'] ?? 'Industry News') ?>
                        </span>
                        <span><?= $dateStr ?></span>
                    </div>

                    <h2 class="text-base font-bold text-slate-800 hover:text-purple-700 transition-colors leading-snug">
                        <a href="<?= $uUrl ?>"><?= htmlspecialchars($u['title']) ?></a>
                    </h2>

                    <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        <?= htmlspecialchars($u['snippet']) ?>
                    </p>
                </div>

                <div class="p-5 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <span>⚡ Daily Update</span>
                    <a href="<?= $uUrl ?>" class="text-sm font-bold text-purple-700 hover:underline">
                        Read full story →
                    </a>
                </div>
            </article>
        <?php endforeach; else: ?>
            <div class="sm:col-span-3 text-center py-12 text-slate-500">
                No daily updates published yet. Check back soon!
            </div>
        <?php endif; ?>
    </div>
</div>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
