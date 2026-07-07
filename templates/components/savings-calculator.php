<?php
// Savings Calculator Component
require_once __DIR__ . '/../../bootstrap.php';
use Data\StateData;
$states = StateData::getAllStatesAndUTs();
usort($states, function($a, $b) { return strcmp($a['name'], $b['name']); });

$calcId = 'savings-calc-' . uniqid();
?>
<div id="<?= $calcId ?>-container" class="space-y-6">
    <!-- Form Inputs -->
    <div class="rounded-xl border bg-white p-5 shadow-sm">
        <form id="<?= $calcId ?>-form" class="grid gap-4 sm:grid-cols-3">
            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Current Monthly Bill (₹)</label>
                <input type="number" name="monthlyBill" required value="3000" min="500" max="50000" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
            </div>

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

            <div class="sm:col-span-3">
                <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
                    <span>Calculate Savings</span>
                </button>
            </div>
        </form>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-3 grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly savings</p>
            <p class="mt-1 text-xl font-bold text-slate-800" id="sav-res-monthly">₹0</p>
        </div>
        <div class="rounded-xl border bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual savings</p>
            <p class="mt-1 text-xl font-bold text-slate-800" id="sav-res-annual">₹0</p>
        </div>
        <div class="rounded-xl border bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Units generated / year</p>
            <p class="mt-1 text-xl font-bold text-slate-800" id="sav-res-units">0</p>
        </div>
        <div class="rounded-xl border bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">10 year savings</p>
            <p class="mt-1 text-xl font-bold text-slate-800" id="sav-res-10yr">₹0</p>
        </div>
        <div class="rounded-xl border bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">25 year savings</p>
            <p class="mt-1 text-xl font-bold text-slate-800" id="sav-res-25yr">₹0</p>
        </div>
        <div class="rounded-xl border bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">CO₂ saved / year</p>
            <p class="mt-1 text-xl font-bold text-slate-800" id="sav-res-co2">0 tonnes</p>
        </div>
    </div>

    <!-- Chart Block -->
    <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
                <h3 class="text-base font-semibold text-slate-900">Cumulative savings (1–25 years)</h3>
                <p class="mt-1 text-xs text-slate-500">Shows how savings add up over time. Breakeven is approximate.</p>
            </div>
            <span class="rounded bg-orange-50 border border-orange-100 text-xs px-2.5 py-1 font-semibold text-orange-700" id="sav-res-breakeven">Breakeven ~ Year 0</span>
        </div>

        <div class="h-64 w-full">
            <canvas id="<?= $calcId ?>-chart"></canvas>
        </div>
    </div>

    <!-- Lead Form Embed -->
    <div id="<?= $calcId ?>-lead-embed"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('<?= $calcId ?>-form');
    const chartCanvas = document.getElementById('<?= $calcId ?>-chart');
    const leadEmbed = document.getElementById('<?= $calcId ?>-lead-embed');

    if (!form || !chartCanvas) return;

    let chart = null;

    async function updateSavings() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        try {
            const response = await fetch('<?= url("api/calculate?type=savings") ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const res = await response.json();

            if (res.monthlySavings !== undefined) {
                // Update stats
                document.getElementById('sav-res-monthly').textContent = formatCurrency(res.monthlySavings);
                document.getElementById('sav-res-annual').textContent = formatCurrency(res.annualSavings);
                document.getElementById('sav-res-units').textContent = Number(res.unitsPerYear).toLocaleString('en-IN');
                document.getElementById('sav-res-10yr').textContent = formatCurrency(res.tenYearSavings);
                document.getElementById('sav-res-25yr').textContent = formatCurrency(res.twentyFiveYearSavings);
                
                // Fetch sunHours from stateData to display CO2 or do it locally
                const co2 = (data.systemSize * 1.5).toFixed(2);
                document.getElementById('sav-res-co2').textContent = `${co2} tonnes`;
                
                document.getElementById('sav-res-breakeven').textContent = `Breakeven ~ Year ${res.breakevenYear}`;

                // Populate cumulative array
                const years = [];
                const cumulativeSavings = [];
                let runningSum = 0;
                for (let i = 1; i <= 25; i++) {
                    years.push(`Year ${i}`);
                    runningSum += res.annualSavings;
                    cumulativeSavings.push(runningSum);
                }

                // Render Chart.js Graph
                if (chart) chart.destroy();

                chart = new Chart(chartCanvas, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [{
                            label: 'Cumulative Savings',
                            data: cumulativeSavings,
                            borderColor: '#f97316',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.1,
                            pointRadius: function(context) {
                                // Highlight breakeven year point
                                return context.dataIndex === (res.breakevenYear - 1) ? 6 : 0;
                            },
                            pointBackgroundColor: '#ea580c',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: { grid: { display: false } },
                            y: {
                                ticks: {
                                    callback: function(value) {
                                        return '₹' + Math.round(value / 100000) + 'L';
                                    }
                                }
                            }
                        }
                    }
                });

                // Load inline prefilled consultation form
                const leadFormResponse = await fetch(`<?= url("templates/components/lead-form") ?>?calculatorType=savings&monthlySavings=${res.monthlySavings}&state=${data.stateSlug}&monthlyBill=${data.monthlyBill}`);
                leadEmbed.innerHTML = await leadFormResponse.text();

                // Eval scripts in lead form
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
        updateSavings();
    });

    // Initial load
    updateSavings();

    function formatCurrency(v) {
        return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
});
</script>
