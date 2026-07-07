<?php
$pageTitle = "Solar Subsidy Updates & Rooftop Solar Guides | Blog";
$pageDescription = "Read the latest PM Surya Ghar circular updates, document check sheets, cost guides, and solar loan guides compiled by experts.";
require_once __DIR__ . '/../templates/layout/header.php';

use Core\MdxParser;

// Scan directory for blogs
$blogsDir = __DIR__ . '/../content/blogs/';
$posts = [];

if (is_dir($blogsDir)) {
    $files = scandir($blogsDir);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'mdx') {
            $slug = pathinfo($file, PATHINFO_FILENAME);
            $parsed = MdxParser::parse($blogsDir . $file);
            if ($parsed && isset($parsed['meta'])) {
                $meta = $parsed['meta'];
                $meta['slug'] = $slug;
                // Default date fallback
                if (!isset($meta['date'])) {
                    $meta['date'] = '1970-01-01';
                }
                $posts[] = $meta;
            }
        }
    }
}

// Sort posts by date descending
usort($posts, function($a, $b) {
    return strcmp($b['date'], $a['date']);
});
?>
<div class="space-y-8 pb-12">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium">Blog</li>
        </ol>
    </nav>

    <!-- Header Section -->
    <div class="space-y-3">
        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Solar Subsidy Updates & Rooftop Solar Guides
        </h1>
        <p class="text-sm text-slate-500 sm:text-base max-w-3xl leading-relaxed">
            Stay up to date with official PM Surya Ghar circular guidelines, solar financing guides, eligibility rules, and vendor checklists.
        </p>
    </div>

    <!-- Blogs List Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <?php if (!empty($posts)): foreach ($posts as $post):
            $postUrl = url('blog/' . $post['slug']);
            $dateStr = date('d M Y', strtotime($post['date']));
        ?>
            <article class="rounded-xl border bg-white overflow-hidden shadow-sm flex flex-col justify-between hover:border-orange-200 hover:shadow-md transition-all">
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between text-xs text-slate-400">
                        <span class="rounded bg-orange-50 border border-orange-100 text-orange-700 font-semibold px-2 py-0.5 uppercase tracking-wider">
                            <?= htmlspecialchars($post['category'] ?? 'Updates') ?>
                        </span>
                        <span><?= $dateStr ?></span>
                    </div>
                    
                    <h2 class="text-base font-bold text-slate-800 hover:text-solar-700 transition-colors leading-snug">
                        <a href="<?= $postUrl ?>"><?= htmlspecialchars($post['title'] ?? '') ?></a>
                    </h2>
                    
                    <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        <?= htmlspecialchars($post['description'] ?? '') ?>
                    </p>
                </div>

                <div class="p-5 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <span>⏱️ <?= htmlspecialchars($post['readingTime'] ?? '5 min') ?> read</span>
                    <a href="<?= $postUrl ?>" class="text-sm font-bold text-solar-700 hover:underline hover:text-solar-800">
                        Read post →
                    </a>
                </div>
            </article>
        <?php endforeach; else: ?>
            <div class="sm:col-span-3 text-center py-12 text-slate-500">
                No blog posts published yet. Check back soon!
            </div>
        <?php endif; ?>
    </div>
</div>
<?php require_once __DIR__ . '/../templates/layout/footer.php'; ?>
