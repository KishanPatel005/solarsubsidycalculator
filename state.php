<?php
require_once __DIR__ . '/bootstrap.php';

use Data\StateData;
use Data\SubsidyRates;

$stateSlug = $_GET['state'] ?? '';
$stateMeta = null;

// Find state meta
$allStates = StateData::getAllStatesAndUTs();
foreach ($allStates as $s) {
    if ($s['slug'] === $stateSlug) {
        $stateMeta = $s;
        break;
    }
}

if (!$stateMeta) {
    // 404 Not Found
    http_response_code(404);
    $pageTitle = "Page Not Found | Solar Subsidy Calculator";
    require_once __DIR__ . '/templates/layout/header.php';
    ?>
    <div class="py-12 text-center space-y-4">
        <h1 class="text-3xl font-bold text-slate-800">State Guide Not Found</h1>
        <p class="text-slate-500">The state guide you are looking for does not exist or is currently being compiled.</p>
        <a href="<?= url('solar-subsidy') ?>" class="inline-block rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700">View All States</a>
    </div>
    <?php
    require_once __DIR__ . '/templates/layout/footer.php';
    exit();
}

$stateName = $stateMeta['name'];
$solarData = StateData::getStateSolarData($stateSlug);
$subsidyContent = StateData::getStateSubsidyContent($stateSlug);

// Calculate state bonus display
$stateBonusAmount = null;
if ($solarData && isset($solarData['stateBonus'])) {
    $stateBonusAmount = $solarData['stateBonus'];
} else {
    // Check if additional rate exists
    $stateBonusAmount = SubsidyRates::calculateStateSubsidy(10.0, $stateSlug); // max potential up to 10kW
    if ($stateBonusAmount <= 0) $stateBonusAmount = null;
}

$totalPotential = 78000 + ($stateBonusAmount ?? 0);

$pageTitle = "Solar Subsidy in " . $stateName . " 2026 | Calculator & Guide";
$pageDescription = "Get up to " . formatINR($totalPotential) . " solar subsidy in " . $stateName . ". Use our free calculator, check eligibility and apply for PM Surya Ghar Yojana 2026.";

require_once __DIR__ . '/templates/layout/header.php';
?>
<div class="space-y-10">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-slate-500 mb-4">
        <ol class="flex flex-wrap items-center gap-2">
            <li><a href="<?= url('/') ?>" class="hover:text-slate-800">Home</a></li>
            <li>/</li>
            <li><a href="<?= url('solar-subsidy') ?>" class="hover:text-slate-800">Solar Subsidy</a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium"><?= htmlspecialchars($stateName) ?></li>
        </ol>
    </nav>

    <!-- Header / Hero Card -->
    <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
            <span class="rounded bg-orange-600 text-white font-semibold text-xs px-2.5 py-1">Updated 2026</span>
            <span class="rounded bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1">Central subsidy confirmed</span>
            <span class="rounded bg-slate-100 text-slate-500 font-medium text-xs px-2.5 py-1">State bonus — verify on portal</span>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Solar Subsidy in <?= htmlspecialchars($stateName) ?> 2026 — Complete Guide
        </h1>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">Central Subsidy</p>
                <p class="mt-1 text-lg font-bold text-slate-800">Up to <?= formatINR(78000) ?></p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">State Bonus</p>
                <p class="mt-1 text-lg font-bold text-slate-800"><?= $stateBonusAmount ? formatINR($stateBonusAmount) : '—' ?></p>
                <p class="mt-0.5 text-xs text-slate-400">Verify on official portal</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">Max System</p>
                <p class="mt-1 text-lg font-bold text-slate-800">10 kW</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">Scheme</p>
                <p class="mt-1 text-lg font-bold text-slate-800">PM Surya Ghar</p>
            </div>
        </div>
    </div>

    <!-- Quick summary card -->
    <div class="rounded-xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm">
        <p class="text-sm text-slate-800 leading-relaxed">
            In <span class="font-bold text-slate-900"><?= htmlspecialchars($stateName) ?></span>, homeowners can get up to 
            <span class="font-bold text-slate-900"><?= formatINR($totalPotential) ?></span> subsidy on rooftop
            solar installation under PM Surya Ghar Yojana 2026.
        </p>
        <p class="mt-2 text-xs text-slate-400">
            Central subsidy is confirmed. State-level bonus (if any) can vary by DISCOM and policy—verify on the official portal link below.
        </p>
    </div>

    <!-- Embedded Calculator Widget -->
    <div class="space-y-3">
        <h2 class="text-xl font-bold text-slate-900">Calculate your subsidy in <?= htmlspecialchars($stateName) ?></h2>
        <?php
        $defaultStateSlug = $stateSlug;
        require __DIR__ . '/templates/components/subsidy-calculator.php';
        ?>
    </div>

    <hr class="border-slate-200" />

    <!-- Eligibility Rules -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Eligibility</h2>
        <div class="grid gap-3">
            <?php foreach ($subsidyContent['eligibilityRules'] as $rule): ?>
                <div class="flex items-start gap-2.5 text-sm text-slate-600">
                    <span class="text-emerald-600 mt-0.5">✔️</span>
                    <p class="leading-relaxed"><?= htmlspecialchars($rule) ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Apply Steps -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">How to apply</h2>
        <div class="grid gap-3">
            <?php foreach ($subsidyContent['howToApplySteps'] as $idx => $step): ?>
                <div class="rounded-xl border bg-white p-4 shadow-sm flex items-start gap-4">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">
                        <?= $idx + 1 ?>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step <?= $idx + 1 ?></p>
                        <p class="mt-1 text-sm text-slate-600 leading-relaxed"><?= htmlspecialchars($step) ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
            
            <div class="rounded-xl border bg-white p-4 shadow-sm flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-slate-700">
                    <span>🌐</span>
                    <span class="font-semibold">Official portal</span>
                </div>
                <a href="<?= htmlspecialchars($subsidyContent['officialPortalUrl']) ?>" target="_blank" rel="noreferrer" class="text-sm font-bold text-solar-700 hover:underline">
                    Open portal →
                </a>
            </div>
        </div>
    </div>

    <!-- State Solar Facts -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">State Solar Facts</h2>
        <?php if ($solarData): ?>
            <div class="grid gap-4 lg:grid-cols-3">
                <div class="rounded-xl border bg-white p-5 shadow-sm">
                    <p class="text-sm font-semibold text-slate-800 border-b pb-2 mb-3">DISCOMs in <?= htmlspecialchars($stateName) ?></p>
                    <ul class="space-y-2.5 text-sm text-slate-500">
                        <?php foreach ($solarData['discoms'] as $d): ?>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                                <span><?= htmlspecialchars($d) ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <div class="rounded-xl border bg-white p-5 shadow-sm">
                    <p class="text-sm font-semibold text-slate-800 border-b pb-2 mb-3">Approvals, policy & tariff</p>
                    <ul class="space-y-2.5 text-sm text-slate-500">
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                            <span>Average approval time: <span class="font-semibold text-slate-800"><?= htmlspecialchars($solarData['approvalDays']) ?></span></span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                            <span>Policy: <span class="font-semibold text-slate-800"><?= htmlspecialchars($solarData['policy']) ?></span></span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                            <span>Avg tariff: <span class="font-semibold text-slate-800"><?= htmlspecialchars($solarData['avgTariff']) ?></span></span>
                        </li>
                        <?php if ($solarData['stateBonus']): ?>
                            <li class="flex items-start gap-2 text-emerald-800 font-semibold bg-emerald-50 rounded p-1.5">
                                <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                                <span>State bonus: <?= formatINR($solarData['stateBonus']) ?></span>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>

                <div class="rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <p class="text-sm font-semibold text-slate-800 border-b pb-2 mb-3">Best districts</p>
                        <div class="flex flex-wrap gap-2">
                            <?php foreach ($solarData['bestDistricts'] as $d): ?>
                                <span class="rounded bg-slate-100 text-slate-800 text-xs px-2.5 py-1 font-medium"><?= htmlspecialchars($d) ?></span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div class="mt-4 rounded-md border bg-slate-50 p-3">
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">State portal</p>
                        <a href="https://<?= htmlspecialchars($solarData['statePortal']) ?>" target="_blank" rel="noreferrer" class="mt-1 inline-flex items-center gap-1 text-sm font-bold text-solar-700 hover:underline">
                            <?= htmlspecialchars($solarData['statePortal']) ?> 🔗
                        </a>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm text-slate-500">
                    State-specific DISCOM and solar facts are being added for this page. Central subsidy details remain available above.
                </p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Documents checklist -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Documents required</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm font-semibold text-slate-800 border-b pb-2 mb-3">Primary documents</p>
                <ul class="space-y-2.5 text-sm text-slate-500">
                    <?php
                    $half = ceil(count($subsidyContent['documentsRequired']) / 2);
                    $firstHalf = array_slice($subsidyContent['documentsRequired'], 0, $half);
                    $secondHalf = array_slice($subsidyContent['documentsRequired'], $half);
                    foreach ($firstHalf as $d):
                    ?>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                            <span><?= htmlspecialchars($d) ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm font-semibold text-slate-800 border-b pb-2 mb-3">Supporting documents</p>
                <ul class="space-y-2.5 text-sm text-slate-500">
                    <?php foreach ($secondHalf as $d): ?>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-600 text-xs mt-0.5">✔️</span>
                            <span><?= htmlspecialchars($d) ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>

    <!-- Extra state benefits -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">State scheme details</h2>
        <?php if (!empty($subsidyContent['extraStateBenefits'])): ?>
            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <ul class="space-y-2.5 text-sm text-slate-500">
                    <?php foreach ($subsidyContent['extraStateBenefits'] as $b): ?>
                        <li class="flex items-start gap-2.5">
                            <span class="text-emerald-600 mt-0.5">✔️</span>
                            <span class="leading-relaxed"><?= htmlspecialchars($b) ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php else: ?>
            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm text-slate-500">State-specific additional benefits are not confirmed in our dataset yet. Central subsidy still applies.</p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Pre-configured Consultation Form -->
    <div class="space-y-3">
        <h2 class="text-xl font-bold text-slate-900">Need Help Applying in <?= htmlspecialchars($stateName) ?>?</h2>
        <?php
        $calculatorType = 'subsidy';
        $state = $stateSlug;
        $monthlyBill = 3000;
        require __DIR__ . '/templates/components/lead-form.php';
        ?>
    </div>

    <!-- FAQs -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">FAQ</h2>
        <div class="space-y-2" id="faq-accordion">
            <?php
            $faqs = [
                "How to apply for rooftop solar subsidy in $stateName?",
                "What is the maximum subsidy in $stateName in 2026?",
                "How long does DISCOM approval take in $stateName?",
                "What system size is best for my home in $stateName?",
                "Do I need net metering for subsidy in $stateName?"
            ];
            foreach ($faqs as $idx => $q):
            ?>
                <div class="border rounded-lg bg-white overflow-hidden shadow-sm">
                    <button class="faq-btn w-full px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between focus:outline-none">
                        <span><?= htmlspecialchars($q) ?></span>
                        <svg class="h-4 w-4 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="faq-answer px-5 py-4 border-t text-sm text-slate-600 hidden leading-relaxed">
                        Refer to the steps above and the official portal for the latest DISCOM requirements. Central subsidy is capped at <?= formatINR(78000) ?> for 3 kW and above.
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Nearby states list -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Also check subsidy in nearby states</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <?php
            $nearby = [];
            foreach ($allStates as $s) {
                if ($s['region'] === $stateMeta['region'] && $s['slug'] !== $stateSlug) {
                    $nearby[] = $s;
                }
            }
            $nearby = array_slice($nearby, 0, 4);
            foreach ($nearby as $s):
            ?>
                <div class="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="text-sm font-semibold text-slate-800"><?= htmlspecialchars($s['name']) ?></div>
                        <div class="mt-1 text-xs text-slate-400"><?= htmlspecialchars($s['region']) ?> • Capital: <?= htmlspecialchars($s['capital']) ?></div>
                    </div>
                    <div class="mt-3">
                        <a class="text-sm font-bold text-solar-700 hover:underline" href="<?= url('solar-subsidy-' . $s['slug']) ?>">View guide</a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic
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
