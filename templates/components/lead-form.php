<?php
// Lead Form Template
// Accepts parameters: $calculatorType, $subsidyAmount, $finalCost, $monthlySavings, $state, $monthlyBill
$calculatorType = $calculatorType ?? 'subsidy';
$subsidyAmount = isset($subsidyAmount) ? (float)$subsidyAmount : null;
$finalCost = isset($finalCost) ? (float)$finalCost : null;
$monthlySavings = isset($monthlySavings) ? (float)$monthlySavings : null;
$state = $state ?? '';
$monthlyBill = $monthlyBill ?? 3000;

$formId = 'lead-form-' . uniqid();
?>
<div class="mt-8 overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-[1px] shadow-sm">
    <div class="rounded-xl bg-white p-5 sm:p-6" id="<?= $formId ?>-container">
        <div class="flex items-start gap-3">
            <div class="rounded-full bg-orange-100 p-2 text-orange-700">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-900">Get Free Solar Consultation</h3>
                <p class="mt-1 text-sm text-slate-500">Free tool — no login, no spam</p>
            </div>
        </div>

        <div class="mt-4 grid gap-2 grid-cols-3">
            <div class="flex items-center gap-2 rounded-md bg-white/60 border px-3 py-2 text-xs text-slate-500">
                <span class="text-orange-600">🛡️</span>
                <span class="font-medium text-slate-800">Free Advice</span>
            </div>
            <div class="flex items-center gap-2 rounded-md bg-white/60 border px-3 py-2 text-xs text-slate-500">
                <span class="text-orange-600">📞</span>
                <span class="font-medium text-slate-800">Expert Call</span>
            </div>
            <div class="flex items-center gap-2 rounded-md bg-white/60 border px-3 py-2 text-xs text-slate-500">
                <span class="text-orange-600">✅</span>
                <span class="font-medium text-slate-800">No Spam</span>
            </div>
        </div>

        <!-- Optional context chips -->
        <div class="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            <?php if ($subsidyAmount !== null): ?>
                <span class="rounded-full bg-slate-100 px-3 py-1">
                    Subsidy: <span class="font-medium text-slate-900"><?= formatINR($subsidyAmount) ?></span>
                </span>
            <?php endif; ?>
            <?php if ($finalCost !== null): ?>
                <span class="rounded-full bg-slate-100 px-3 py-1">
                    Final cost: <span class="font-medium text-slate-900"><?= formatINR($finalCost) ?></span>
                </span>
            <?php endif; ?>
            <?php if ($monthlySavings !== null): ?>
                <span class="rounded-full bg-slate-100 px-3 py-1">
                    Monthly savings: <span class="font-medium text-slate-900"><?= formatINR($monthlySavings) ?></span>
                </span>
            <?php endif; ?>
        </div>

        <!-- Submission Form -->
        <form id="<?= $formId ?>-form" class="mt-6 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="calculatorType" value="<?= htmlspecialchars($calculatorType) ?>">
            <input type="hidden" name="state" value="<?= htmlspecialchars($state) ?>">
            <input type="hidden" name="subsidyAmount" value="<?= $subsidyAmount ?>">
            <input type="hidden" name="finalCost" value="<?= $finalCost ?>">
            <input type="hidden" name="monthlySavings" value="<?= $monthlySavings ?>">

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" name="name" required placeholder="Your full name" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                <p class="mt-1 text-xs text-red-600 hidden error-name"></p>
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Mobile Number</label>
                <input type="tel" name="phone" required placeholder="10-digit mobile" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                <p class="mt-1 text-xs text-red-600 hidden error-phone"></p>
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">City</label>
                <input type="text" name="city" required placeholder="e.g. Ahmedabad" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                <p class="mt-1 text-xs text-red-600 hidden error-city"></p>
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Monthly Bill (₹)</label>
                <input type="number" name="bill" required value="<?= (int)$monthlyBill ?>" min="0" max="50000" class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                <p class="mt-1 text-xs text-red-600 hidden error-bill"></p>
            </div>

            <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Best Time to Call</label>
                <select name="callTime" required class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none transition-colors">
                    <option value="morning">Morning (9-12)</option>
                    <option value="afternoon">Afternoon (12-5)</option>
                    <option value="evening" selected>Evening (5-8)</option>
                </select>
                <p class="mt-1 text-xs text-red-600 hidden error-callTime"></p>
            </div>

            <div class="sm:col-span-2">
                <button type="submit" class="w-full rounded-md bg-solar-600 hover:bg-solar-700 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
                    <span class="btn-text">Get Free Consultation →</span>
                    <svg class="h-4 w-4 animate-spin hidden btn-spinner" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                </button>
            </div>
        </form>

        <!-- Success Message (Initially Hidden) -->
        <div id="<?= $formId ?>-success" class="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 hidden">
            <div class="flex items-start gap-3">
                <div class="text-emerald-600 mt-0.5 font-bold">
                    ✔️
                </div>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-slate-900" id="<?= $formId ?>-success-msg">
                        Thank you! Our solar expert will call you within 2 hours.
                    </p>
                    <p class="mt-2 text-sm text-slate-500">
                        While you wait, check your state's subsidy guide.
                    </p>
                    <div class="mt-3">
                        <a href="<?= empty($state) ? url('solar-subsidy') : url('solar-subsidy-' . $state) ?>" class="inline-flex items-center gap-1 text-sm font-medium text-solar-700 hover:underline">
                            Open subsidy guide →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('<?= $formId ?>-form');
    const container = document.getElementById('<?= $formId ?>-container');
    const successDiv = document.getElementById('<?= $formId ?>-success');
    const successMsg = document.getElementById('<?= $formId ?>-success-msg');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset errors
        form.querySelectorAll('.text-red-600').forEach(el => el.classList.add('hidden'));
        
        // Button state
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = form.querySelector('.btn-text');
        const spinner = form.querySelector('.btn-spinner');
        
        submitBtn.disabled = true;
        btnText.textContent = 'Submitting...';
        spinner.classList.remove('hidden');

        // Form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        try {
            const response = await fetch('<?= url("api/leads") ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const res = await response.json();

            if (res.ok) {
                // Track GA Lead Event
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        currency: 'INR',
                        value: data.bill,
                        calculator_type: data.calculatorType,
                        state: data.state || 'india'
                    });
                }
                
                // Show Success Page
                form.classList.add('hidden');
                successMsg.textContent = `Thank you ${data.name}! Our solar expert will call you within 2 hours on ${data.phone}`;
                successDiv.classList.remove('hidden');
            } else {
                alert(res.error || 'Submission failed. Please check inputs.');
                submitBtn.disabled = false;
                btnText.textContent = 'Get Free Consultation →';
                spinner.classList.add('hidden');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
            submitBtn.disabled = false;
            btnText.textContent = 'Get Free Consultation →';
            spinner.classList.add('hidden');
        }
    });
});
</script>
