<?php
$pageTitle = "PM-KUSUM Scheme Calculator 2026 | Solar Pump Subsidy";
$pageDescription = "Calculate PM-KUSUM agricultural solar pump subsidy (Component B). Estimate benchmark system costs, central/state subsidy splits, and farmer shares.";
require_once __DIR__ . '/templates/layout/header.php';

use Data\StateData;
$states = StateData::getAllStatesAndUTs();
usort($states, function($a, $b) { return strcmp($a['name'], $b['name']); });

$calcId = 'kusum-calc-' . uniqid();
?>
<div class="space-y-10 pb-12">
    <!-- Breadcrumb -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium">PM KUSUM Calculator</li>
        </ol>
    </nav>

    <!-- Hero Section -->
    <section class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
            <span class="rounded bg-orange-600 text-white font-semibold text-xs px-2.5 py-1">Updated 2026</span>
            <span class="rounded bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1">For farmers</span>
        </div>
        <div class="space-y-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                PM KUSUM Scheme Calculator 2026 — Solar Pump Subsidy for Farmers
            </h1>
            <p class="max-w-3xl text-sm text-slate-500 sm:text-base leading-relaxed">
                PM-KUSUM is a farmer-focused solar scheme (solar pumps / feeder solarisation / decentralised plants) and is 
                <span class="font-bold text-slate-900">separate from PM Surya Ghar</span> (which is for residential rooftop solar).
                Use this calculator to estimate pump benchmark cost, subsidy split, farmer share, and savings.
            </p>
        </div>
    </section>

    <!-- Calculator Section -->
    <section class="space-y-4" id="calculator">
        <h2 class="text-xl font-bold text-slate-900">PM-KUSUM solar pump subsidy calculator</h2>

        <div class="rounded-xl border bg-white p-5 shadow-sm space-y-6">
            <form id="<?= $calcId ?>-form" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border-b pb-6 border-slate-100">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">State</label>
                    <select name="stateSlug" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                        <?php foreach ($states as $s): ?>
                            <option value="<?= htmlspecialchars($s['slug']) ?>" <?= $s['slug'] === 'gujarat' ? 'selected' : '' ?>>
                                <?= htmlspecialchars($s['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <p class="mt-1 text-xs text-slate-400">Used for local guidance.</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Agricultural land (acres)</label>
                    <input type="number" name="acres" value="2" min="1" step="0.5" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                    <p class="mt-1 text-xs text-slate-400">Used for planning context.</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Current pump HP</label>
                    <select name="pumpHp" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                        <option value="2">2 HP</option>
                        <option value="3">3 HP</option>
                        <option value="5" selected>5 HP</option>
                        <option value="7.5">7.5 HP</option>
                        <option value="10">10 HP</option>
                    </select>
                    <p class="mt-1 text-xs text-slate-400">Benchmark costs applied by HP.</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Monthly diesel/electricity cost (₹)</label>
                    <input type="number" name="monthlyCost" value="5000" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                    <p class="mt-1 text-xs text-slate-400">Used to estimate payback ROI.</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Water source</label>
                    <select name="waterSource" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                        <option value="borewell">Borewell</option>
                        <option value="canal">Canal</option>
                        <option value="pond">Pond</option>
                    </select>
                    <p class="mt-1 text-xs text-slate-400">May affect approvals.</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">State subsidy % (default 30%)</label>
                    <input type="number" name="stateSubsidyPct" value="30" min="0" max="90" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                    <p class="mt-1 text-xs text-slate-400">Update if your state offers a different split.</p>
                </div>

                <div class="sm:col-span-2 lg:col-span-3">
                    <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
                        <span>Calculate KUSUM Split</span>
                    </button>
                </div>
            </form>

            <!-- Results Grid (Initially Hidden) -->
            <div id="<?= $calcId ?>-results" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 hidden animate-fade">
                <div class="rounded-xl border bg-white p-4 shadow-sm">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recommended capacity</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="res-capacity">5 HP (~3.73 kW)</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Benchmark cost</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="res-cost">₹0</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm border-emerald-100">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Central subsidy (60%)</p>
                    <p class="mt-1 text-lg font-bold text-emerald-600" id="res-central">₹0</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm border-emerald-100">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">State subsidy</p>
                    <p class="mt-1 text-lg font-bold text-emerald-600" id="res-state">₹0</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Farmer share (approx)</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="res-farmer">₹0</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly savings vs diesel</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="res-savings">₹0</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payback period</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="res-payback">0 years</p>
                </div>
                <div class="rounded-xl border bg-white p-4 shadow-sm">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">10 year savings</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="res-10yr">₹0</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Nodal Agencies Table -->
    <section class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Which states have PM-KUSUM active?</h2>
        <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <p class="text-sm text-slate-500 leading-relaxed">
                PM-KUSUM is implemented through State Implementing Agencies (SNAs/SIAs). The official state-wise list can change with quotas and
                portals. For the latest contact details, use the official portal.
            </p>
            <div class="rounded-md border bg-slate-50 p-4">
                <p class="text-xs font-semibold text-slate-800 uppercase tracking-wider">Official portal</p>
                <a href="https://pmkusum.mnre.gov.in/" target="_blank" rel="noreferrer" class="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-solar-700 hover:underline">
                    pmkusum.mnre.gov.in 
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
        </div>

        <div class="rounded-xl border bg-white overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <tr class="border-b">
                            <th class="px-6 py-4">State</th>
                            <th class="px-6 py-4">Nodal agency (example)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y text-slate-600">
                        <?php
                        $kusumAgencies = [
                            ['state' => 'Gujarat', 'agency' => 'GEDA (Gujarat Energy Development Agency)'],
                            ['state' => 'Maharashtra', 'agency' => 'MEDA (Maharashtra Energy Development Agency)'],
                            ['state' => 'Rajasthan', 'agency' => 'RRECL (Rajasthan Renewable Energy Corporation Ltd.)'],
                            ['state' => 'Uttar Pradesh', 'agency' => 'UPNEDA (Uttar Pradesh New & Renewable Energy Development Agency)'],
                            ['state' => 'Punjab', 'agency' => 'PEDA (Punjab Energy Development Agency)'],
                            ['state' => 'Bihar', 'agency' => 'BREDA (Bihar Renewable Energy Development Agency)'],
                            ['state' => 'Tamil Nadu', 'agency' => 'TEDA (Tamil Nadu Energy Development Agency)'],
                            ['state' => 'Karnataka', 'agency' => 'KREDL (Karnataka Renewable Energy Development Ltd.)'],
                            ['state' => 'Madhya Pradesh', 'agency' => 'MP Urja Vikas Nigam Ltd. (MPUVNL)'],
                            ['state' => 'Telangana', 'agency' => 'TSREDCO (Telangana State Renewable Energy Development Corp.)'],
                        ];
                        foreach ($kusumAgencies as $agency):
                        ?>
                            <tr class="hover:bg-slate-50">
                                <td class="px-6 py-4 font-semibold text-slate-800"><?= $agency['state'] ?></td>
                                <td class="px-6 py-4"><?= $agency['agency'] ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Sizing steps -->
    <section class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">How to apply for PM-KUSUM (simple steps)</h2>
        <div class="grid gap-3">
            <?php
            $kusumSteps = [
                "Check your state PM-KUSUM portal/agency and confirm that applications are open for your component/category.",
                "Keep your land records and pump details ready (HP, water source, location).",
                "Submit the online application and pay any required registration fee (if applicable).",
                "Wait for verification, site survey, and vendor allocation/selection as per the state process.",
                "Complete installation + inspection. Pay your farmer share and collect commissioning documents."
            ];
            foreach ($kusumSteps as $idx => $step):
            ?>
                <div class="rounded-xl border bg-white p-4 shadow-sm flex items-start gap-4">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">
                        <?= $idx + 1 ?>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step <?= $idx + 1 ?></p>
                        <p class="mt-1 text-sm text-slate-600 leading-relaxed"><?= htmlspecialchars($step) ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Documents needed -->
    <section class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Documents required for farmers</h2>
        <div class="rounded-xl border bg-white p-6 shadow-sm">
            <ul class="space-y-3">
                <?php
                $docs = [
                    "Aadhaar / ID proof",
                    "Land ownership / land record documents (as per state)",
                    "Khasra / Khatauni / 7/12 extract (state-specific)",
                    "Bank account details for beneficiary contribution and any DBT",
                    "Pump details (HP, existing connection details if grid-connected)",
                    "Passport-size photo and mobile number"
                ];
                foreach ($docs as $d):
                ?>
                    <li class="flex items-start gap-2.5 text-sm text-slate-600">
                        <span class="text-emerald-600">✔️</span>
                        <span><?= htmlspecialchars($d) ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </section>

    <!-- Inline Consultation form -->
    <section class="space-y-3">
        <h2 class="text-xl font-bold text-slate-900">Get Help with PM KUSUM Application</h2>
        <p class="text-sm text-slate-500">Share your details to get guidance for your state, documents, and eligibility checks.</p>
        <div id="kusum-lead-embed"></div>
    </section>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('<?= $calcId ?>-form');
    const results = document.getElementById('<?= $calcId ?>-results');
    const leadEmbed = document.getElementById('kusum-lead-embed');

    if (!form) return;

    async function updateKusum() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        try {
            const response = await fetch('<?= url("api/calculate.php?type=kusum") ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const res = await response.json();

            if (res.benchmarkCost) {
                // Update UI fields
                document.getElementById('res-capacity').textContent = `${res.recommendedHp} HP (~${res.recommendedKw} kW)`;
                document.getElementById('res-cost').textContent = formatCurrency(res.benchmarkCost);
                document.getElementById('res-central').textContent = formatCurrency(res.centralSubsidy);
                document.getElementById('res-state').textContent = formatCurrency(res.stateSubsidy);
                document.getElementById('res-farmer').textContent = formatCurrency(res.farmerShare);
                document.getElementById('res-savings').textContent = formatCurrency(res.monthlySavings);
                document.getElementById('res-payback').textContent = res.paybackYears ? `${res.paybackYears} years` : '—';
                document.getElementById('res-10yr').textContent = formatCurrency(res.tenYearSavings);

                results.classList.remove('hidden');

                // Load inline prefilled lead form
                const leadFormResponse = await fetch(`<?= url("templates/components/lead-form") ?>?calculatorType=subsidy&subsidyAmount=${res.centralSubsidy + res.stateSubsidy}&finalCost=${res.farmerShare}&monthlySavings=${res.monthlySavings}&state=${data.stateSlug}`);
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
        updateKusum();
    });

    // Initial load
    updateKusum();

    function formatCurrency(v) {
        return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
});
</script>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
