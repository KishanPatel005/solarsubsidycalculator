<?php
// Loan Calculator Component
require_once __DIR__ . '/../../bootstrap.php';
use Data\StateData;
$states = StateData::getAllStatesAndUTs();
usort($states, function($a, $b) { return strcmp($a['name'], $b['name']); });

$calcId = 'loan-calc-' . uniqid();
?>
<div id="<?= $calcId ?>-container" class="space-y-6">
    <div class="grid gap-5 lg:grid-cols-[1fr_420px]">
        <div class="rounded-xl border bg-white p-5 shadow-sm h-fit">
            <form id="<?= $calcId ?>-form" class="grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">System Size (kW)</label>
                    <input type="number" name="systemSize" required value="3" min="1" max="10" step="0.1" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">State / UT</label>
                    <select name="stateSlug" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                        <?php foreach ($states as $s): ?>
                            <option value="<?= htmlspecialchars($s['slug']) ?>" <?= $s['slug'] === 'gujarat' ? 'selected' : '' ?>>
                                <?= htmlspecialchars($s['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Down Payment Percentage</label>
                    <div class="rounded-lg border border-slate-100 p-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-semibold text-slate-800" id="dp-label">20%</span>
                            <span class="text-xs text-slate-400">0% to 50%</span>
                        </div>
                        <input type="range" name="downPaymentPct" min="0" max="50" step="1" value="20" class="mt-3 w-full accent-orange-600 cursor-pointer">
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
                        <span>Calculate Loan Options</span>
                    </button>
                </div>
            </form>
        </div>

        <div class="space-y-4">
            <!-- Cost & Loan Breakdown -->
            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <div class="grid gap-3 text-sm text-slate-600">
                    <div class="flex justify-between border-b pb-1.5">
                        <span>System cost (est.)</span>
                        <span class="font-medium text-slate-800" id="loan-res-cost">₹0</span>
                    </div>
                    <div class="flex justify-between border-b pb-1.5">
                        <span>Central subsidy</span>
                        <span class="font-medium text-slate-800" id="loan-res-central">₹0</span>
                    </div>
                    <div class="flex justify-between border-b pb-1.5">
                        <span>State subsidy</span>
                        <span class="font-medium text-slate-800" id="loan-res-state">₹0</span>
                    </div>
                    <div class="flex justify-between border-b pb-1.5">
                        <span>Final cost</span>
                        <span class="font-medium text-slate-800" id="loan-res-final">₹0</span>
                    </div>
                    <div class="flex justify-between border-b pb-1.5">
                        <span>Down payment</span>
                        <span class="font-medium text-slate-800" id="loan-res-dp">₹0</span>
                    </div>
                    <div class="flex justify-between pt-1.5">
                        <span>Loan amount needed</span>
                        <span class="text-base font-bold text-slate-900" id="loan-res-needed">₹0</span>
                    </div>
                </div>
                <p class="mt-3 text-xs text-slate-400">
                    Bank rates shown are indicative. Always verify the latest loan product details on the bank’s official site.
                </p>
            </div>

            <!-- Bank Comparisons list -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold text-slate-900">Top bank options (60 months)</h3>
                    <span class="rounded bg-slate-100 text-xs px-2 py-1 font-medium text-slate-600">Compare</span>
                </div>

                <div class="space-y-3" id="bank-list-container">
                    <!-- Dynamic bank cards injected here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Lead Form Embed -->
    <div id="<?= $calcId ?>-lead-embed"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('<?= $calcId ?>-form');
    const rangeInput = form.querySelector('input[name="downPaymentPct"]');
    const dpLabel = document.getElementById('dp-label');
    const bankContainer = document.getElementById('bank-list-container');
    const leadEmbed = document.getElementById('<?= $calcId ?>-lead-embed');

    if (!form) return;

    rangeInput.addEventListener('input', (e) => {
        dpLabel.textContent = `${e.target.value}%`;
    });

    async function updateLoanOptions() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        try {
            const response = await fetch('<?= url("api/calculate.php?type=loan") ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const res = await response.json();

            if (res.loanAmount !== undefined) {
                // Update text
                document.getElementById('loan-res-cost').textContent = formatCurrency(res.systemCost);
                document.getElementById('loan-res-central').textContent = formatCurrency(res.central);
                document.getElementById('loan-res-state').textContent = formatCurrency(res.state);
                document.getElementById('loan-res-final').textContent = formatCurrency(res.final);
                document.getElementById('loan-res-dp').textContent = formatCurrency(res.downPayment);
                document.getElementById('loan-res-needed').textContent = formatCurrency(res.loanAmount);

                // Build bank list HTML
                let bankHtml = '';
                
                // Find cheapest option
                let minEmi = Infinity;
                res.comparisons.forEach(c => {
                    if (c.emi < minEmi) minEmi = c.emi;
                });

                res.comparisons.forEach(c => {
                    const isCheapest = c.emi === minEmi;
                    bankHtml += `
                        <div class="rounded-lg border p-4 bg-slate-50/50">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div class="text-sm font-semibold text-slate-800">${c.name}</div>
                                    <div class="mt-1 text-xs text-slate-500">
                                        Rate used: ${c.annualRate}% p.a. • Tenure: ${c.tenureMonths} months
                                    </div>
                                </div>
                                ${isCheapest ? `<span class="bg-orange-600 text-white rounded text-[10px] px-2 py-0.5 font-semibold">Cheapest</span>` : ''}
                            </div>
                            <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div class="text-xs text-slate-400">Monthly EMI</div>
                                    <div class="font-bold text-slate-800">${formatCurrency(c.emi)}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-slate-400">Total payment</div>
                                    <div class="font-semibold text-slate-800">${formatCurrency(c.totalPayment)}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                bankContainer.innerHTML = bankHtml;

                // Load inline prefilled consultation form
                const totalSubs = res.central + res.state;
                const leadFormResponse = await fetch(`<?= url("templates/components/lead-form") ?>?calculatorType=loan&subsidyAmount=${totalSubs}&finalCost=${res.final}&state=${data.stateSlug}`);
                leadEmbed.innerHTML = await leadFormResponse.text();
                
                // Eval script hooks in lead form
                const scripts = leadEmbed.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                    eval(scripts[i].innerText);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateLoanOptions();
    });

    // Initial load
    updateLoanOptions();

    // Re-trigger calculation if range changes
    rangeInput.addEventListener('change', updateLoanOptions);

    function formatCurrency(v) {
        return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
});
</script>
