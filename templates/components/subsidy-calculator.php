<?php
// Subsidy Calculator UI Component
require_once __DIR__ . '/../../bootstrap.php';
use Data\StateData;
$states = StateData::getAllStatesAndUTs();
usort($states, function($a, $b) { return strcmp($a['name'], $b['name']); });

$defaultState = $defaultStateSlug ?? 'gujarat';
$calcId = 'subsidy-calc-' . uniqid();
?>
<div id="<?= $calcId ?>-container" class="space-y-6">
    <div class="rounded-xl border bg-white p-5 shadow-sm">
        <form id="<?= $calcId ?>-form" class="grid gap-4 sm:grid-cols-2">
            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">State / UT</label>
                <select name="stateSlug" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                    <?php foreach ($states as $s): ?>
                        <option value="<?= htmlspecialchars($s['slug']) ?>" <?= $s['slug'] === $defaultState ? 'selected' : '' ?>>
                            <?= htmlspecialchars($s['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Monthly Bill (₹)</label>
                <input type="number" name="monthlyBillINR" required value="3000" min="500" max="50000" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Rooftop Area (sq ft)</label>
                <input type="number" name="rooftopAreaSqft" required value="200" min="50" max="5000" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Sanctioned Load (kW)</label>
                <input type="number" name="sanctionedLoadKw" required value="3" min="1" max="20" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
            </div>

            <div class="sm:col-span-2">
                <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
                    <span class="btn-text">Calculate</span>
                    <svg class="h-4 w-4 animate-spin hidden btn-spinner" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                </button>
                <p class="mt-2 text-xs text-slate-500">
                    Calculations use official PM Surya Ghar central subsidy rules and public state policy references.
                </p>
            </div>
        </form>
    </div>

    <!-- Skeleton Loader (Initially Hidden) -->
    <div id="<?= $calcId ?>-skeleton" class="space-y-5 hidden">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <?php for ($i=0; $i<4; $i++): ?>
                <div class="rounded-xl border bg-white p-4 animate-pulse">
                    <div class="h-3 w-16 bg-slate-200 rounded"></div>
                    <div class="mt-3 h-7 w-28 bg-slate-200 rounded"></div>
                    <div class="mt-2 h-3 w-20 bg-slate-200 rounded"></div>
                </div>
            <?php endfor; ?>
        </div>
        <div class="rounded-xl border bg-white p-5 space-y-4 animate-pulse">
            <div class="h-4 w-40 bg-slate-200 rounded"></div>
            <div class="grid gap-3 sm:grid-cols-2">
                <?php for ($i=0; $i<8; $i++): ?>
                    <div class="h-4 bg-slate-200 rounded"></div>
                <?php endfor; ?>
            </div>
        </div>
    </div>

    <!-- Results Section (Initially Hidden) -->
    <div id="<?= $calcId ?>-results" class="space-y-5 hidden">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-orange-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Subsidy</p>
                <p class="mt-1 text-2xl font-bold text-orange-600" id="res-total-subsidy">₹0</p>
                <p class="mt-0.5 text-xs text-slate-400">Central + state</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Final Cost</p>
                <p class="mt-1 text-2xl font-bold text-slate-800" id="res-final-cost">₹0</p>
                <p class="mt-0.5 text-xs text-slate-400">After subsidy</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Savings</p>
                <p class="mt-1 text-2xl font-bold text-slate-800" id="res-monthly-savings">₹0</p>
                <p class="mt-0.5 text-xs text-slate-400">Estimated</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payback Period</p>
                <p class="mt-1 text-2xl font-bold text-slate-800" id="res-payback">0 yrs</p>
                <p class="mt-0.5 text-xs text-slate-400" id="res-roi">ROI ~ 0%</p>
            </div>
        </div>

        <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <div>
                <h3 class="text-base font-semibold text-slate-900">Detailed breakdown</h3>
                <p class="text-sm text-slate-500">A quick view of subsidy, savings, and environmental impact.</p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                <div class="flex justify-between border-b pb-1.5">
                    <span>System size recommended</span>
                    <span class="font-semibold text-slate-800" id="detail-size">0 kW</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>Central Govt Subsidy</span>
                    <span class="font-semibold text-slate-800" id="detail-central">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>State Additional Subsidy</span>
                    <span class="font-semibold text-slate-800" id="detail-state">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>System cost (before subsidy)</span>
                    <span class="font-semibold text-slate-800" id="detail-cost">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>Your cost (after subsidy)</span>
                    <span class="font-semibold text-slate-800" id="detail-final">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>Monthly electricity savings</span>
                    <span class="font-semibold text-slate-800" id="detail-monthly-savings">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>Annual savings</span>
                    <span class="font-semibold text-slate-800" id="detail-annual-savings">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5">
                    <span>25 year lifetime savings</span>
                    <span class="font-semibold text-slate-800" id="detail-lifetime">₹0</span>
                </div>
                <div class="flex justify-between border-b pb-1.5 sm:col-span-2">
                    <span>CO₂ saved in 25 years</span>
                    <span class="font-semibold text-slate-800" id="detail-co2">0 tonnes</span>
                </div>
            </div>

            <div class="rounded-lg border bg-slate-50 p-4">
                <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span class="font-semibold text-slate-800" id="progress-text">You save 0% of system cost in first 0 years</span>
                    <span class="text-xs text-slate-500" id="progress-cost">System cost: ₹0</span>
                </div>
                <div class="mt-3 w-full bg-slate-200 rounded-full h-2">
                    <div id="progress-bar" class="bg-solar-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
            </div>
        </div>

        <!-- Inline prefilled consultation form -->
        <div id="<?= $calcId ?>-lead-embed"></div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('<?= $calcId ?>-form');
    const skeleton = document.getElementById('<?= $calcId ?>-skeleton');
    const results = document.getElementById('<?= $calcId ?>-results');
    const leadEmbed = document.getElementById('<?= $calcId ?>-lead-embed');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Button state
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = form.querySelector('.btn-text');
        const spinner = form.querySelector('.btn-spinner');

        submitBtn.disabled = true;
        btnText.textContent = 'Calculating...';
        spinner.classList.remove('hidden');
        results.classList.add('hidden');
        skeleton.classList.remove('hidden');

        // Form parameters
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        // Force exactly 1200ms loading skeleton (UX instruction)
        const delayPromise = new Promise(r => setTimeout(r, 1200));

        try {
            const apiPromise = fetch('<?= url("api/calculate.php?type=subsidy") ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(r => r.json());

            const [res] = await Promise.all([apiPromise, delayPromise]);

            if (res.systemSizeKw) {
                // Populate results
                document.getElementById('res-total-subsidy').textContent = formatCurrency(res.totalSubsidyINR);
                document.getElementById('res-final-cost').textContent = formatCurrency(res.finalCostINR);
                document.getElementById('res-monthly-savings').textContent = formatCurrency(res.monthlySavingsINR);
                document.getElementById('res-payback').textContent = res.paybackPeriodYears ? `${res.paybackPeriodYears} yrs` : '—';
                
                // Calculate ROI & Progress Bar
                const annual = res.monthlySavingsINR * 12;
                const roi = res.finalCostINR > 0 ? ((annual / res.finalCostINR) * 100).toFixed(1) : 0;
                document.getElementById('res-roi').textContent = `ROI ~ ${roi}%`;
                
                const breakeven = res.paybackPeriodYears ? Math.min(25, Math.ceil(res.paybackPeriodYears)) : 25;
                const progressPct = res.systemCostINR > 0 ? Math.min(100, Math.round(((annual * breakeven) / res.systemCostINR) * 100)) : 0;
                
                document.getElementById('progress-text').textContent = `You save ${progressPct}% of system cost in first ${breakeven} years`;
                document.getElementById('progress-cost').textContent = `System cost: ${formatCurrency(res.systemCostINR)}`;
                document.getElementById('progress-bar').style.width = `${progressPct}%`;

                // Detailed breakdown
                document.getElementById('detail-size').textContent = `${res.systemSizeKw} kW`;
                document.getElementById('detail-central').textContent = formatCurrency(res.centralSubsidyINR);
                document.getElementById('detail-state').textContent = formatCurrency(res.stateSubsidyINR);
                document.getElementById('detail-cost').textContent = formatCurrency(res.systemCostINR);
                document.getElementById('detail-final').textContent = formatCurrency(res.finalCostINR);
                document.getElementById('detail-monthly-savings').textContent = formatCurrency(res.monthlySavingsINR);
                document.getElementById('detail-annual-savings').textContent = formatCurrency(annual);
                document.getElementById('detail-lifetime').textContent = formatCurrency(res.lifetimeSavingsINR);
                document.getElementById('detail-co2').textContent = `${res.co2SavedTonnes} tonnes`;

                // Load inline prefilled lead form
                const leadFormResponse = await fetch(`<?= url("templates/components/lead-form") ?>?calculatorType=subsidy&subsidyAmount=${res.totalSubsidyINR}&finalCost=${res.finalCostINR}&monthlySavings=${res.monthlySavingsINR}&state=${data.stateSlug}&monthlyBill=${data.monthlyBillINR}`);
                leadEmbed.innerHTML = await leadFormResponse.text();

                // Interactivity for embedded script inside lead form
                const scripts = leadEmbed.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                    eval(scripts[i].innerText);
                }

                skeleton.classList.add('hidden');
                results.classList.remove('hidden');
                
                // Smooth scroll to results
                results.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // If callback is declared
                if (typeof window.onFinalCostComputed === 'function') {
                    window.onFinalCostComputed(res.finalCostINR);
                }
            } else {
                alert('Calculation failed. Please verify inputs.');
                skeleton.classList.add('hidden');
            }
        } catch (err) {
            alert('Server error occurred. Please try again.');
            skeleton.classList.add('hidden');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Calculate';
            spinner.classList.add('hidden');
        }
    });

    function formatCurrency(v) {
        return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
});
</script>
