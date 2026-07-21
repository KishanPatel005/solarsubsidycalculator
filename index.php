<?php
$pageTitle = "Solar Subsidy Calculator India 2026 | PM Surya Ghar";
$pageDescription = "Calculate your rooftop solar panel subsidy, loan EMI, investment payback ROI, and environmental offsets dynamically using our free tabbed calculator.";
require_once __DIR__ . '/templates/layout/header.php';

use Data\StateData;
use Data\SubsidyRates;

$topStateSlugs = [
    "gujarat",
    "haryana",
    "maharashtra",
    "delhi",
    "kerala",
    "punjab",
    "telangana",
    "karnataka",
    "rajasthan",
    "uttar-pradesh",
    "tamil-nadu",
    "bihar",
];

$allStates = StateData::getAllStatesAndUTs();
$topStates = [];
foreach ($topStateSlugs as $slug) {
    foreach ($allStates as $s) {
        if ($s['slug'] === $slug) {
            $topStates[] = $s;
            break;
        }
    }
}
?>
<div class="space-y-12 pb-16">
    <!-- 1) Interactive Calculator Widget -->
    <section class="space-y-4 pt-4 sm:pt-6" id="calculator">
        <div class="space-y-2">
            <h2 class="text-2xl font-bold tracking-tight text-slate-800">Calculate Your Subsidy Now</h2>
            <p class="text-sm text-slate-500">
                Use the tabs to estimate subsidy, EMI, loan options, and long-term savings.
            </p>
        </div>

        <div class="rounded-xl border bg-white p-3 sm:p-4 shadow-sm">
            <!-- Tabs Header -->
            <div class="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-100 rounded-lg p-1" id="calculator-tabs-header">
                <button data-tab="subsidy" class="tab-btn rounded-md py-2.5 text-sm font-semibold transition-colors focus:outline-none bg-white text-slate-900 shadow-sm">Subsidy</button>
                <button data-tab="emi" class="tab-btn rounded-md py-2.5 text-sm font-semibold transition-colors focus:outline-none text-slate-600 hover:text-slate-950">EMI</button>
                <button data-tab="loan" class="tab-btn rounded-md py-2.5 text-sm font-semibold transition-colors focus:outline-none text-slate-600 hover:text-slate-950">Loan</button>
                <button data-tab="savings" class="tab-btn rounded-md py-2.5 text-sm font-semibold transition-colors focus:outline-none text-slate-600 hover:text-slate-950">Savings</button>
            </div>

            <!-- Tabs Content -->
            <div class="mt-6" id="calculator-tabs-content">
                <div id="tab-content-subsidy" class="tab-panel">
                    <?php 
                    $defaultStateSlug = 'gujarat';
                    require __DIR__ . '/templates/components/subsidy-calculator.php'; 
                    ?>
                </div>
                <div id="tab-content-emi" class="tab-panel hidden">
                    <?php require __DIR__ . '/templates/components/emi-calculator.php'; ?>
                </div>
                <div id="tab-content-loan" class="tab-panel hidden">
                    <?php require __DIR__ . '/templates/components/loan-calculator.php'; ?>
                </div>
                <div id="tab-content-savings" class="tab-panel hidden">
                    <?php require __DIR__ . '/templates/components/savings-calculator.php'; ?>
                </div>
            </div>
        </div>
    </section>

    <hr class="border-slate-200" />

    <!-- 2) Hero details -->
    <section class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
            <span class="rounded bg-orange-600 text-white font-semibold text-xs px-2.5 py-1">Updated 2026</span>
            <span class="rounded bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1 inline-flex items-center gap-1">
                ✔️ Based on govt data
            </span>
        </div>

        <div class="space-y-3">
            <h1 class="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                Solar Subsidy Calculator India 2026
            </h1>
            <h2 class="text-lg font-semibold text-slate-700 sm:text-xl">
                Calculate Your PM Surya Ghar Subsidy Instantly
            </h2>
            <p class="max-w-2xl text-sm text-slate-500 sm:text-base leading-relaxed">
                Free calculator for all 36 states. Based on official government data.
            </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" class="rounded-md bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-solar-700 transition-colors inline-flex items-center justify-center gap-2">
                Calculate My Subsidy →
            </a>
            <a href="#states" class="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2">
                Check My State 🔍
            </a>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400">Govt target</div>
                <div class="mt-1 text-base font-semibold text-slate-800">1 Crore+ Homes Targeted</div>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400">Central subsidy</div>
                <div class="mt-1 text-base font-semibold text-slate-800">Up to <?= formatINR(78000) ?></div>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <div class="text-xs text-slate-400">Coverage</div>
                <div class="mt-1 text-base font-semibold text-slate-800">500+ Districts Covered</div>
            </div>
        </div>
    </section>

    <!-- 3) Solar Subsidy Process Timeline -->
    <section class="space-y-6" id="process">
        <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                <span>🔄 Step-by-Step Guide</span>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-800">Solar Subsidy Application Process</h2>
            <p class="text-sm text-slate-500">
                Follow this official 5-step workflow to get your rooftop solar installed and subsidy credited.
            </p>
        </div>

        <?php
        use Repository\RepositoryFactory;
        $procRepo = RepositoryFactory::create('process');
        $dynamicSteps = $procRepo->getAll(true);
        ?>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <?php if (!empty($dynamicSteps)): foreach ($dynamicSteps as $p): ?>
                <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3 hover:border-orange-200 transition-all flex flex-col justify-between">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="rounded-full bg-orange-50 text-solar-700 font-extrabold text-xs px-2.5 py-1 border border-orange-100">
                                Step <?= (int)($p['step_number'] ?? 1) ?>
                            </span>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900 leading-snug">
                            <?= htmlspecialchars($p['title']) ?>
                        </h3>
                        <p class="text-xs text-slate-500 leading-relaxed">
                            <?= htmlspecialchars($p['short_description']) ?>
                        </p>
                    </div>
                    <?php if (!empty($p['detailed_content'])): ?>
                        <p class="text-[11px] text-slate-400 border-t border-slate-100 pt-2 italic">
                            <?= htmlspecialchars($p['detailed_content']) ?>
                        </p>
                    <?php endif; ?>
                </div>
            <?php endforeach; else: ?>
                <div class="col-span-5 text-center text-xs text-slate-500 py-4">No process steps published yet.</div>
            <?php endif; ?>
        </div>
    </section>

    <!-- 4) Daily Solar Updates & Industry News -->
    <section class="space-y-6" id="updates">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="space-y-1">
                <div class="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                    <span>📰 Daily Solar Updates</span>
                </div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-800">Latest Industry Circulars & Policies</h2>
            </div>
            <a href="<?= url('daily-updates.php') ?>" class="text-xs font-bold text-solar-700 hover:underline inline-flex items-center gap-1">
                View All News & Circulars →
            </a>
        </div>

        <?php
        $newsRepo = RepositoryFactory::create('news');
        $dynamicNews = $newsRepo->getAll(false, 3);
        ?>

        <div class="grid gap-6 sm:grid-cols-3">
            <?php if (!empty($dynamicNews)): foreach ($dynamicNews as $n):
                $newsUrl = url('daily-update/' . $n['slug']);
                $pubDate = date('d M Y', strtotime($n['published_at']));
            ?>
                <article class="rounded-2xl border bg-white p-5 shadow-sm flex flex-col justify-between space-y-3 hover:border-purple-200 transition-all">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between text-xs text-slate-400">
                            <span class="rounded bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 text-[10px] uppercase">
                                <?= htmlspecialchars($n['category']) ?>
                            </span>
                            <span><?= $pubDate ?></span>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900 hover:text-purple-600 leading-snug">
                            <a href="<?= $newsUrl ?>"><?= htmlspecialchars($n['title']) ?></a>
                        </h3>
                        <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            <?= htmlspecialchars($n['snippet']) ?>
                        </p>
                    </div>
                    <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <a href="<?= $newsUrl ?>" class="text-xs font-bold text-purple-600 hover:underline">
                            Read Update →
                        </a>
                    </div>
                </article>
            <?php endforeach; else: ?>
                <div class="sm:col-span-3 text-center text-xs text-slate-500 py-4">No daily updates published yet.</div>
            <?php endif; ?>
        </div>
    </section>

    <!-- 5) Why solar -->
    <section class="space-y-6">
        <div class="space-y-2">
            <h2 class="text-2xl font-bold tracking-tight text-slate-800">Why Install Solar in 2026?</h2>
            <p class="text-sm text-slate-500">A practical upgrade: savings, stability, and cleaner energy.</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border bg-white p-5 shadow-sm flex items-start gap-3">
                <div class="rounded-full bg-orange-50 p-2 text-orange-700 font-bold">✔️</div>
                <div>
                    <div class="text-sm font-semibold text-slate-800">Save via subsidy</div>
                    <p class="mt-1 text-sm text-slate-500 leading-relaxed">Save up to <?= formatINR(78000) ?> via central subsidy.</p>
                </div>
            </div>
            <div class="rounded-xl border bg-white p-5 shadow-sm flex items-start gap-3">
                <div class="rounded-full bg-orange-50 p-2 text-orange-700 font-bold">⚡</div>
                <div>
                    <div class="text-sm font-semibold text-slate-800">Lower bills</div>
                    <p class="mt-1 text-sm text-slate-500 leading-relaxed">Reduce electricity bill by up to 90% (usage-dependent).</p>
                </div>
            </div>
            <div class="rounded-xl border bg-white p-5 shadow-sm flex items-start gap-3">
                <div class="rounded-full bg-orange-50 p-2 text-orange-700 font-bold">🌱</div>
                <div>
                    <div class="text-sm font-semibold text-slate-800">Long panel life</div>
                    <p class="mt-1 text-sm text-slate-500 leading-relaxed">25-year panel life for long-term savings.</p>
                </div>
            </div>
            <div class="rounded-xl border bg-white p-5 shadow-sm flex items-start gap-3">
                <div class="rounded-full bg-orange-50 p-2 text-orange-700 font-bold">➡️</div>
                <div>
                    <div class="text-sm font-semibold text-slate-800">Export extra power</div>
                    <p class="mt-1 text-sm text-slate-500 leading-relaxed">Sell excess power back to grid via net metering.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 6) State guide -->
    <section class="space-y-6" id="states">
        <div class="space-y-2">
            <h2 class="text-2xl font-bold tracking-tight text-slate-800">Solar Subsidy by State</h2>
            <p class="text-sm text-slate-500">Open your state guide for eligibility, documents, and the official portal link.</p>
        </div>

        <div class="scroll-mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <?php foreach ($topStates as $s):
                $stateBonus = SubsidyRates::calculateStateSubsidy(10.0, $s['slug']);
            ?>
                <div class="rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <div class="text-sm font-semibold text-slate-800"><?= htmlspecialchars($s['name']) ?></div>
                            <div class="mt-1 text-xs text-slate-400">Central max <?= formatINR(78000) ?></div>
                        </div>
                        <?php if ($stateBonus > 0): ?>
                            <span class="rounded bg-emerald-600 text-white font-semibold text-xs px-2.5 py-0.5"><?= formatINR($stateBonus) ?> bonus</span>
                        <?php else: ?>
                            <span class="rounded bg-slate-100 text-slate-500 font-medium text-xs px-2.5 py-0.5">Central only</span>
                        <?php endif; ?>
                    </div>

                    <div class="mt-4">
                        <a href="<?= url('solar-subsidy-' . $s['slug']) ?>" class="w-full text-center rounded-md border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-block">
                            Open guide
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="flex justify-center">
            <a href="<?= url('solar-subsidy') ?>" class="rounded-md bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-solar-700 transition-colors inline-flex items-center gap-2">
                View All States →
            </a>
        </div>
    </section>

    <!-- 7) FAQ (Loaded Dynamically from Backend Repository) -->
    <section class="space-y-4" id="faqs">
        <h2 class="text-2xl font-bold tracking-tight text-slate-800">Frequently Asked Questions</h2>
        <div class="space-y-2" id="faq-accordion">
            <?php
            $faqRepo = RepositoryFactory::create('faq');
            $dynamicFaqs = $faqRepo->getAll(true);
            if (!empty($dynamicFaqs)):
                foreach ($dynamicFaqs as $idx => $faq):
            ?>
                <div class="border rounded-lg bg-white overflow-hidden shadow-sm">
                    <button class="faq-btn w-full px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between focus:outline-none">
                        <span><?= htmlspecialchars($faq['question']) ?></span>
                        <svg class="h-4 w-4 transform transition-transform text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="faq-answer px-5 py-4 border-t text-sm text-slate-600 hidden leading-relaxed bg-slate-50/50">
                        <?= htmlspecialchars($faq['answer']) ?>
                    </div>
                </div>
            <?php 
                endforeach;
            else:
            ?>
                <div class="p-6 text-center text-xs text-slate-500 border rounded-lg bg-white">No FAQs published yet.</div>
            <?php endif; ?>
        </div>
    </section>

    <!-- 8) Final CTA -->
    <section class="space-y-4">
        <div class="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6 sm:p-8 shadow-sm">
            <div class="space-y-2">
                <h2 class="text-2xl font-bold tracking-tight text-slate-800">Ready to Save on Electricity?</h2>
                <p class="text-sm text-slate-500">
                    Get a free consultation and step-by-step help for your state's application process.
                </p>
            </div>
            <?php
            $calculatorType = "subsidy";
            $state = "gujarat";
            $monthlyBill = 3000;
            require __DIR__ . '/templates/components/lead-form.php';
            ?>
        </div>
    </section>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // 1) Tab Switch Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => {
                b.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
                b.classList.add('text-slate-600', 'hover:text-slate-950');
            });
            btn.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
            btn.classList.remove('text-slate-600', 'hover:text-slate-950');

            panels.forEach(p => p.classList.add('hidden'));
            document.getElementById(`tab-content-${targetTab}`).classList.remove('hidden');
        });
    });

    // 2) FAQ Accordion Logic
    const faqButtons = document.querySelectorAll('.faq-btn');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const svg = btn.querySelector('svg');
            const isHidden = answer.classList.contains('hidden');

            document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
            document.querySelectorAll('.faq-btn svg').forEach(s => s.classList.remove('rotate-180'));

            if (isHidden) {
                answer.classList.remove('hidden');
                svg.classList.add('rotate-180');
            }
        });
    });
});
</script>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
