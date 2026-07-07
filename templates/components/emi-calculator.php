<?php
// EMI Calculator Component
$defaultPrincipal = isset($defaultPrincipal) ? (int)$defaultPrincipal : 200000;
$calcId = 'emi-calc-' . uniqid();
?>
<div id="<?= $calcId ?>-container" class="space-y-6">
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <div class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div class="rounded-xl border bg-white p-5 shadow-sm">
            <form id="<?= $calcId ?>-form" class="grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Loan Amount (₹)</label>
                    <input type="number" name="principal" required value="<?= $defaultPrincipal ?>" min="10000" max="5000000" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Annual Interest Rate (%)</label>
                    <input type="number" name="annualRate" required value="7.5" step="0.05" min="0" max="30" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                </div>

                <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Loan Tenure</label>
                    <select name="tenureMonths" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                        <option value="12">12 months (1 year)</option>
                        <option value="24">24 months (2 years)</option>
                        <option value="36">36 months (3 years)</option>
                        <option value="48">48 months (4 years)</option>
                        <option value="60" selected>60 months (5 years)</option>
                        <option value="84">84 months (7 years)</option>
                        <option value="120">120 months (10 years)</option>
                    </select>
                </div>

                <div class="sm:col-span-2">
                    <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
                        <span>Calculate EMI</span>
                    </button>
                </div>
            </form>
        </div>

        <div class="rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly EMI</p>
                <p class="mt-1 text-3xl font-bold text-slate-800 animate-fade" id="emi-val">₹0</p>
                
                <div class="mt-5 grid gap-3 text-sm text-slate-600 border-t pt-4">
                    <div class="flex justify-between">
                        <span>Total Interest Payable</span>
                        <span class="font-semibold text-slate-800" id="interest-val">₹0</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Total Payment Amount</span>
                        <span class="font-semibold text-slate-800" id="total-val">₹0</span>
                    </div>
                </div>
            </div>

            <!-- Chart.js split graph -->
            <div class="mt-6 flex flex-col items-center">
                <div class="h-44 w-44">
                    <canvas id="<?= $calcId ?>-chart"></canvas>
                </div>
                <div class="mt-3 flex justify-between w-full text-xs text-slate-500">
                    <span>Principal vs Interest split</span>
                    <span id="chart-tenure-txt">60 months</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Leads Embed -->
    <div id="<?= $calcId ?>-lead-embed"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('<?= $calcId ?>-form');
    const chartCanvas = document.getElementById('<?= $calcId ?>-chart');
    const leadEmbed = document.getElementById('<?= $calcId ?>-lead-embed');
    
    if (!form || !chartCanvas) return;

    let chart = null;

    async function updateEMI() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        try {
            const response = await fetch('<?= url("api/calculate?type=emi") ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const res = await response.json();

            if (res.emi) {
                // Update UI text
                document.getElementById('emi-val').textContent = formatCurrency(res.emi);
                document.getElementById('interest-val').textContent = formatCurrency(res.totalInterest);
                document.getElementById('total-val').textContent = formatCurrency(res.totalPayment);
                document.getElementById('chart-tenure-txt').textContent = `${data.tenureMonths} months`;

                // Update Chart.js Pie Graph
                if (chart) chart.destroy();

                chart = new Chart(chartCanvas, {
                    type: 'doughnut',
                    data: {
                        labels: ['Principal', 'Interest'],
                        datasets: [{
                            data: [Number(data.principal), Number(res.totalInterest)],
                            backgroundColor: ['#f97316', '#fed7aa'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.label + ': ' + formatCurrency(context.raw);
                                    }
                                }
                            }
                        },
                        cutout: '65%'
                    }
                });

                // Load prefilled Lead form
                const leadFormResponse = await fetch(`<?= url("templates/components/lead-form") ?>?calculatorType=emi&finalCost=${data.principal}`);
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
        updateEMI();
    });

    // Run first calculations on load
    updateEMI();

    function formatCurrency(v) {
        return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }

    // Expose final cost function hook
    window.onFinalCostComputed = function(cost) {
        const input = form.querySelector('input[name="principal"]');
        if (input) {
            input.value = cost;
            updateEMI();
        }
    };
});
</script>
