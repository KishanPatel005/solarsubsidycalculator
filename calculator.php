<?php
$pageTitle = "Solar Subsidy Calculator India 2026 | PM Surya Ghar";
$pageDescription = "Calculate your rooftop solar panel subsidy, loan EMI, investment payback ROI, and environmental offsets dynamically using our free tabbed calculator.";
require_once __DIR__ . '/templates/layout/header.php';
?>
<div class="space-y-8">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium">Calculator</li>
        </ol>
    </nav>

    <!-- Header Section -->
    <div class="space-y-3">
        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Solar Subsidy Calculator India 2026
        </h1>
        <p class="text-sm text-slate-500 sm:text-base">
            Calculate your subsidy, EMI, and savings instantly
        </p>
        <div class="flex flex-wrap gap-2 text-xs">
            <span class="rounded-full bg-orange-100 text-orange-800 font-semibold px-3 py-1">Based on Govt Data</span>
            <span class="rounded-full bg-slate-100 text-slate-800 font-semibold px-3 py-1">Free Tool</span>
            <span class="rounded-full bg-slate-100 text-slate-800 font-semibold px-3 py-1">Updated 2026</span>
        </div>
    </div>

    <!-- Tabs Container -->
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
                <?php require __DIR__ . '/templates/components/subsidy-calculator.php'; ?>
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

    <!-- Bottom FAQs -->
    <div class="space-y-4 pt-6 border-t">
        <h2 class="text-xl font-bold text-slate-900">FAQ</h2>
        <p class="text-sm text-slate-500">Common questions about rooftop solar subsidy, savings, and loans in India.</p>

        <div class="space-y-2" id="faq-accordion">
            <?php
            $faqItems = [
                [
                    'q' => 'How is the central solar subsidy calculated in India (PM Surya Ghar)?',
                    'a' => 'Central subsidy is based on system size: up to 2 kW uses a per-kW rate, the 3rd kW adds a lower amount, and the total is capped for 3 kW and above as per official scheme guidelines.'
                ],
                [
                    'q' => 'Does every state provide an additional subsidy on top of central subsidy?',
                    'a' => 'Not always. Central subsidy applies through the national portal. Some states may offer extra benefits (capital subsidy/GBI/rebates) depending on local policy and DISCOM rules.'
                ],
                [
                    'q' => 'What documents are typically required for rooftop solar subsidy?',
                    'a' => 'Usually electricity consumer details, ID/address proof, bank details for DBT, and rooftop ownership/authorization (as per your DISCOM).'
                ],
                [
                    'q' => 'How accurate are the savings and payback estimates?',
                    'a' => 'They are estimates based on typical Indian generation averages and a reasonable tariff range. Your actual savings depend on consumption pattern, tariff slab, shading, orientation, and net-metering rules.'
                ]
            ];
            foreach ($faqItems as $idx => $faq):
            ?>
                <div class="border rounded-lg bg-white overflow-hidden shadow-sm">
                    <button class="faq-btn w-full px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between focus:outline-none">
                        <span><?= htmlspecialchars($faq['q']) ?></span>
                        <svg class="h-4 w-4 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="faq-answer px-5 py-4 border-t text-sm text-slate-600 hidden leading-relaxed">
                        <?= htmlspecialchars($faq['a']) ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // 1) Tab Switch Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Toggle active classes on buttons
            tabBtns.forEach(b => {
                b.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
                b.classList.add('text-slate-600', 'hover:text-slate-950');
            });
            btn.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
            btn.classList.remove('text-slate-600', 'hover:text-slate-950');

            // Toggle visibility of content panels
            panels.forEach(p => p.classList.add('hidden'));
            document.getElementById(`tab-content-${targetTab}`).classList.remove('hidden');
            
            // Sync location hash
            window.location.hash = targetTab;
        });
    });

    // Hash sync on load
    const syncFromHash = () => {
        const hash = window.location.hash.replace('#', '');
        const match = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
        if (match) {
            match.click();
        }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    // 2) FAQ Accordion Logic
    const faqButtons = document.querySelectorAll('.faq-btn');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const svg = btn.querySelector('svg');
            const isHidden = answer.classList.contains('hidden');

            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
            document.querySelectorAll('.faq-btn svg').forEach(s => s.classList.remove('rotate-180'));

            // Toggle target
            if (isHidden) {
                answer.classList.remove('hidden');
                svg.classList.add('rotate-180');
            }
        });
    });
});
</script>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
