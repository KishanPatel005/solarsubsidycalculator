<?php
$pageTitle = "State-Wise Solar Subsidy Guides India 2026 | PM Surya Ghar";
$pageDescription = "Check rooftop solar subsidy guidelines, application procedures, eligibility terms, and DISCOM portals for all 36 Indian states and union territories.";
require_once __DIR__ . '/templates/layout/header.php';

use Data\StateData;
$states = StateData::getAllStatesAndUTs();
usort($states, function($a, $b) { return strcmp($a['name'], $b['name']); });
?>
<div class="space-y-8 pb-12">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium">State Guide</li>
        </ol>
    </nav>

    <!-- Header Section -->
    <div class="space-y-3">
        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            State-Wise Solar Subsidy Guides India 2026
        </h1>
        <p class="text-sm text-slate-500 sm:text-base max-w-3xl leading-relaxed">
            Select your state or union territory below to view detailed PM Surya Ghar solar subsidy calculations,
            electricity utility policies, required documents, and direct application links.
        </p>
    </div>

    <!-- Search input -->
    <div class="rounded-xl border bg-white p-4 shadow-sm">
        <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                🔍
            </span>
            <input type="text" id="state-search" placeholder="Search state or UT..." class="w-full rounded-md border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none transition-colors">
        </div>
    </div>

    <!-- States Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="states-grid">
        <?php foreach ($states as $s): ?>
            <div class="state-card rounded-xl border bg-white p-5 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between" data-name="<?= strtolower(htmlspecialchars($s['name'])) ?>">
                <div>
                    <div class="flex items-start justify-between gap-3">
                        <h2 class="text-base font-bold text-slate-800"><?= htmlspecialchars($s['name']) ?></h2>
                        <span class="rounded bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider"><?= htmlspecialchars($s['region']) ?></span>
                    </div>
                    <p class="mt-1 text-xs text-slate-400">Capital: <?= htmlspecialchars($s['capital']) ?></p>
                </div>
                <div class="mt-4 flex items-center justify-between border-t pt-3 border-slate-50">
                    <span class="text-xs text-slate-400">PM Surya Ghar Yojana</span>
                    <a class="text-sm font-bold text-solar-700 hover:underline hover:text-solar-800" href="<?= url('solar-subsidy-' . $s['slug']) ?>">
                        View guide →
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- No results container -->
    <div id="no-results" class="py-12 text-center text-slate-500 hidden">
        No states found matching your search.
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('state-search');
    const cards = document.querySelectorAll('.state-card');
    const noResults = document.getElementById('no-results');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.getAttribute('data-name');
            if (name.includes(query)) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    });
});
</script>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
