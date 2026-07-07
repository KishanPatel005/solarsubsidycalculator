<?php
require_once __DIR__ . '/bootstrap.php';

use Data\CityData;
use Data\StateData;

$citySlug = $_GET['city'] ?? '';
$city = CityData::getCityBySlug($citySlug);

if (!$city) {
    // 404 Not Found
    http_response_code(404);
    $pageTitle = "Page Not Found | Solar Subsidy Calculator";
    require_once __DIR__ . '/templates/layout/header.php';
    ?>
    <div class="py-12 text-center space-y-4">
        <h1 class="text-3xl font-bold text-slate-800">City Guide Not Found</h1>
        <p class="text-slate-500">The city guide you are looking for does not exist or is currently being compiled.</p>
        <a href="<?= url('solar-subsidy') ?>" class="inline-block rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700">View All States & Cities</a>
    </div>
    <?php
    require_once __DIR__ . '/templates/layout/footer.php';
    exit();
}

$cityName = $city['name'];
$stateName = $city['stateName'];
$stateSlug = $city['stateSlug'];

$pageTitle = "Solar Subsidy in " . $cityName . " (" . $stateName . ") 2026 | Calculator & Cost";
$pageDescription = "Rooftop solar panel cost and subsidy in " . $cityName . " for 2026. Calculate PM Surya Ghar subsidy up to ₹78,000, view local DISCOM rules (" . $city['discom'] . ") & apply.";

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
            <li><a href="<?= url('solar-subsidy-' . $stateSlug) ?>" class="hover:text-slate-800"><?= htmlspecialchars($stateName) ?></a></li>
            <li>/</li>
            <li class="text-slate-800 font-medium"><?= htmlspecialchars($cityName) ?></li>
        </ol>
    </nav>

    <!-- Header / Hero section -->
    <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
            <span class="rounded bg-orange-600 text-white font-semibold text-xs px-2.5 py-1">Updated 2026</span>
            <span class="rounded bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1">DISCOM: <?= htmlspecialchars($city['discom']) ?></span>
            <span class="rounded bg-slate-100 text-slate-500 font-medium text-xs px-2.5 py-1">Average Tariff: <?= htmlspecialchars($city['avgTariff']) ?></span>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Solar Subsidy in <?= htmlspecialchars($cityName) ?> 2026 — Complete Guide
        </h1>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">Max Central Subsidy</p>
                <p class="mt-1 text-lg font-bold text-slate-800">₹78,000</p>
                <p class="mt-0.5 text-xs text-slate-400">For 3kW and above</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">Peak Sun Hours</p>
                <p class="mt-1 text-lg font-bold text-slate-800"><?= number_format($city['sunHours'], 1) ?> hrs/day</p>
                <p class="mt-0.5 text-xs text-slate-400">Solar Grade: High</p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">Local DISCOM</p>
                <p class="mt-1 text-lg font-bold text-slate-800"><?= htmlspecialchars($city['discom']) ?></p>
            </div>
            <div class="rounded-xl border bg-white p-4 shadow-sm">
                <p class="text-xs text-slate-400 uppercase font-semibold">State Scheme</p>
                <p class="mt-1 text-lg font-bold text-slate-800"><?= htmlspecialchars($stateName) ?></p>
            </div>
        </div>
    </div>

    <!-- Quick info box -->
    <div class="rounded-xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm">
        <p class="text-sm text-slate-800 leading-relaxed">
            Homeowners in <span class="font-bold text-slate-900"><?= htmlspecialchars($cityName) ?></span> can install rooftop solar 
            under the PM Surya Ghar Muft Bijli Yojana 2026 and get a direct DBT bank subsidy of up to 
            <span class="font-bold text-slate-900">₹78,000</span>.
        </p>
        <p class="mt-2 text-xs text-slate-400">
            Net-metering applications and grid approvals are processed through <span class="font-semibold text-slate-800"><?= htmlspecialchars($city['discom']) ?></span>.
        </p>
    </div>

    <!-- Embedded Calculator Widget -->
    <div class="space-y-3">
        <h2 class="text-xl font-bold text-slate-900">Estimate your solar cost & subsidy in <?= htmlspecialchars($cityName) ?></h2>
        <?php
        $defaultStateSlug = $stateSlug;
        require __DIR__ . '/templates/components/subsidy-calculator.php';
        ?>
    </div>

    <hr class="border-slate-200" />

    <!-- Local rules details -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Net Metering & Installation in <?= htmlspecialchars($cityName) ?></h2>
        <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <p class="text-sm text-slate-600 leading-relaxed">
                Rooftop solar integration in <?= htmlspecialchars($cityName) ?> is governed by the state net metering policy of <?= htmlspecialchars($stateName) ?>.
                Here are the key points to keep in mind:
            </p>
            <ul class="space-y-3 text-sm text-slate-500">
                <li class="flex items-start gap-2.5">
                    <span class="text-emerald-600 mt-0.5">✔️</span>
                    <span class="leading-relaxed">Applications must be submitted via the national PM Surya Ghar portal.</span>
                </li>
                <li class="flex items-start gap-2.5">
                    <span class="text-emerald-600 mt-0.5">✔️</span>
                    <span class="leading-relaxed">Feasibility check and technical clearance is issued by <?= htmlspecialchars($city['discom']) ?> engineers.</span>
                </li>
                <li class="flex items-start gap-2.5">
                    <span class="text-emerald-600 mt-0.5">✔️</span>
                    <span class="leading-relaxed">Only DCR (Domestic Content Requirement) panels are eligible for the central subsidy.</span>
                </li>
            </ul>
        </div>
    </div>

    <!-- Embedded Pre-configured Lead Form -->
    <div class="space-y-3">
        <h2 class="text-xl font-bold text-slate-900">Get Free Solar Quotes from Authorized Installers in <?= htmlspecialchars($cityName) ?></h2>
        <p class="text-sm text-slate-500">Share your requirements to get local installer estimates, site survey scheduling, and loan options.</p>
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
                "Who is the solar subsidy distributor in $cityName?",
                "Can I choose any solar vendor in $cityName?",
                "What is the average payback period for solar in $cityName?",
                "Is net metering mandatory in $cityName for subsidy?"
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
                        Yes, net metering is mandatory for the PM Surya Ghar subsidy scheme. The feasibility approval is processed by <?= htmlspecialchars($city['discom']) ?>.
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Nearby Cities -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Guides for nearby cities</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <?php
            $nearbyCities = CityData::getNearbyCities($citySlug);
            foreach ($nearbyCities as $c):
            ?>
                <div class="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="text-sm font-semibold text-slate-800"><?= htmlspecialchars($c['name']) ?></div>
                        <div class="mt-1 text-xs text-slate-400">DISCOM: <?= htmlspecialchars($c['discom']) ?></div>
                    </div>
                    <div class="mt-3">
                        <a class="text-sm font-bold text-solar-700 hover:underline" href="<?= url('solar-subsidy-' . $c['slug']) ?>">View guide</a>
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
