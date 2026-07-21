<?php
require_once __DIR__ . '/../bootstrap.php';

use Core\MdxParser;

use Repository\RepositoryFactory;

$slug = $_GET['slug'] ?? '';
$blogRepo = RepositoryFactory::create('blog');
$dynamicBlog = $blogRepo->getBySlug($slug);

$meta = [];
$html = '';

if ($dynamicBlog) {
    $meta = [
        'title' => $dynamicBlog['title'],
        'description' => $dynamicBlog['description'] ?? '',
        'category' => $dynamicBlog['category'] ?? 'General',
        'readingTime' => $dynamicBlog['reading_time'] ?? '5 min',
        'author' => $dynamicBlog['author'] ?? 'Solar Expert',
        'date' => $dynamicBlog['created_at'] ?? date('Y-m-d'),
        'heroImage' => $dynamicBlog['cover_image'] ?? ''
    ];
    $html = $dynamicBlog['content'];
} else {
    // Fallback to static MDX parser
    $blogsDir = __DIR__ . '/../content/blogs/';
    $filepath = $blogsDir . $slug . '.mdx';

    $parsed = MdxParser::parse($filepath);

    if (!$parsed) {
        // 404 Not Found
        http_response_code(404);
        $pageTitle = "Page Not Found | Solar Subsidy Blog";
        require_once __DIR__ . '/../templates/layout/header.php';
        ?>
        <div class="py-12 text-center space-y-4">
            <h1 class="text-3xl font-bold text-slate-800">Article Not Found</h1>
            <p class="text-slate-500">The blog post you are looking for does not exist or has been removed.</p>
            <a href="<?= url('blog') ?>" class="inline-block rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700">Go to Blog Index</a>
        </div>
        <?php
        require_once __DIR__ . '/../templates/layout/footer.php';
        exit();
    }

    $meta = $parsed['meta'];
    $html = $parsed['html'];
}

// Extract dynamic Table of Contents from H2 tags
$toc = [];
if (preg_match_all('/<h2 id="(.*?)".*?>(.*?)<\/h2>/s', $html, $tocMatches, PREG_SET_ORDER)) {
    foreach ($tocMatches as $m) {
        $toc[] = [
            'slug' => $m[1],
            'title' => strip_tags($m[2])
        ];
    }
}

// Related articles list via Repository
$related = $blogRepo->getRelated($slug, 3);

$pageTitle = htmlspecialchars($meta['title'] ?? 'Solar Subsidy Blog Post');
$pageDescription = htmlspecialchars($meta['description'] ?? '');

require_once __DIR__ . '/../templates/layout/header.php';
?>
<div class="space-y-8 pb-16">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li><a href="<?= url('blog') ?>" class="hover:text-slate-800">Blog</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium line-clamp-1"><?= htmlspecialchars($meta['title'] ?? '') ?></li>
        </ol>
    </nav>

    <!-- Post Header -->
    <div class="space-y-4">
        <div class="flex items-center gap-3 text-xs">
            <span class="rounded bg-orange-50 border border-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 uppercase tracking-wider">
                <?= htmlspecialchars($meta['category'] ?? 'Guides') ?>
            </span>
            <span class="text-slate-400">⏱️ <?= htmlspecialchars($meta['readingTime'] ?? '5 min') ?> read</span>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl leading-tight">
            <?= htmlspecialchars($meta['title'] ?? '') ?>
        </h1>

        <div class="flex items-center gap-2 text-xs text-slate-400">
            <span>By <span class="font-medium text-slate-600"><?= htmlspecialchars($meta['author'] ?? 'Team') ?></span></span>
            <span>•</span>
            <span>Published on <?= date('d M Y', strtotime($meta['date'] ?? 'today')) ?></span>
        </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid gap-8 lg:grid-cols-[1fr_300px]">
        <!-- Article Main Content -->
        <article class="space-y-6">
            <?php if (!empty($meta['heroImage'])): ?>
                <div class="rounded-xl border overflow-hidden shadow-sm aspect-[16/9] w-full bg-slate-100 relative">
                    <!-- Standard image fallback, prefixing url helper if absolute public paths are mapped -->
                    <img src="<?= strpos($meta['heroImage'], '/') === 0 ? url($meta['heroImage']) : $meta['heroImage'] ?>" 
                         alt="<?= htmlspecialchars($meta['title'] ?? '') ?>" 
                         class="object-cover w-full h-full"
                         onerror="this.src='<?= url("logo.png") ?>'; this.className='object-contain w-full h-full p-10';" />
                </div>
            <?php endif; ?>

            <!-- HTML Content from MDX parser -->
            <div class="prose max-w-none text-slate-700">
                <?= $html ?>
            </div>

            <!-- Embed prefilled calculator trigger box -->
            <div class="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-solar-50 p-6 shadow-sm my-8">
                <h3 class="text-lg font-bold text-slate-900">Check Your Eligibility in 2026</h3>
                <p class="mt-1 text-sm text-slate-500">Calculate exact system recomendations, down payments, and central/state subsidy splits.</p>
                <div class="mt-4">
                    <a href="<?= url('calculator') ?>" class="rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700 transition-colors inline-block">
                        Open Solar Calculator
                    </a>
                </div>
            </div>

            <hr class="border-slate-200" />

            <!-- Consultation form embed -->
            <div class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900">Need personal consultation assistance?</h2>
                <p class="text-sm text-slate-500">Get connected with authorized local rooftop installers and verify documents checklist.</p>
                <?php
                $calculatorType = 'subsidy';
                $state = $meta['state'] ?? 'gujarat';
                $monthlyBill = 3000;
                require __DIR__ . '/../templates/components/lead-form.php';
                ?>
            </div>
        </article>

        <!-- Sidebar Panel (Table of Contents & Related) -->
        <aside class="space-y-6 h-fit lg:sticky lg:top-20">
            <!-- Table of contents -->
            <?php if (!empty($toc)): ?>
                <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">On this page</h3>
                    <nav class="space-y-2">
                        <?php foreach ($toc as $item): ?>
                            <a href="#<?= htmlspecialchars($item['slug']) ?>" class="block text-xs font-medium text-slate-500 hover:text-solar-700 hover:underline leading-relaxed transition-colors">
                                <?= htmlspecialchars($item['title']) ?>
                            </a>
                        <?php endforeach; ?>
                    </nav>
                </div>
            <?php endif; ?>

            <!-- Related guides -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
                <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Related guides</h3>
                <div class="space-y-3">
                    <?php foreach ($related as $r): ?>
                        <div>
                            <a href="<?= url('blog/' . $r['slug']) ?>" class="text-xs font-semibold text-slate-800 hover:text-solar-700 hover:underline leading-snug line-clamp-2">
                                <?= htmlspecialchars($r['title'] ?? '') ?>
                            </a>
                            <span class="block mt-1 text-[10px] text-slate-400"><?= date('d M Y', strtotime($r['date'] ?? 'today')) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </aside>
    </div>
</div>
<?php require_once __DIR__ . '/../templates/layout/footer.php'; ?>
