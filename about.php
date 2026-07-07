<?php
$pageTitle = "About Solar Subsidy Calculator";
$pageDescription = "Solar Subsidy Calculator is a free tool to help Indian homeowners calculate solar subsidy, understand PM Surya Ghar eligibility and prepare documents.";
require_once __DIR__ . '/templates/layout/header.php';
?>
<div class="space-y-6 pb-10">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold tracking-tight text-slate-800">About Solar Subsidy Calculator</h1>
        <p class="text-sm text-slate-500 sm:text-base">
            Solar Subsidy Calculator is a free tool to help Indian homeowners calculate solar
            subsidy, understand PM Surya Ghar eligibility and prepare documents
            for their application.
        </p>
    </div>

    <div class="rounded-xl border bg-white p-5 sm:p-6 shadow-sm">
        <div class="space-y-4 text-sm text-slate-500">
            <p>Built by an independent developer in Ahmedabad, Gujarat.</p>
            <p>
                Data sources include 
                <a href="https://pmsuryaghar.gov.in" target="_blank" rel="noreferrer" class="text-solar-700 underline hover:text-solar-800 font-semibold">pmsuryaghar.gov.in</a> 
                and MNRE guidelines/communications.
            </p>
            <p>
                Disclaimer: Data is for reference only. Final subsidy approval and
                amounts depend on DISCOM verification, scheme rules, and eligibility.
            </p>
        </div>

        <div class="mt-6">
            <a href="<?= url('calculator') ?>" class="rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700 transition-colors inline-block">Open calculator</a>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
