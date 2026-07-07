<?php
require_once __DIR__ . '/../../bootstrap.php';
?>
    </main>

    <!-- Footer Section -->
    <footer class="border-t bg-white mt-auto">
        <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div class="grid gap-10 md:grid-cols-[1fr_auto] md:gap-12">
                <div class="space-y-4">
                    <a href="<?= url('/') ?>" class="inline-flex items-center gap-2">
                        <img src="<?= url('logo.png') ?>" alt="Solar Subsidy Calculator" class="h-7 w-auto" />
                    </a>
                    <p class="max-w-md text-sm text-slate-500 leading-relaxed">
                        Tools and guides for India’s rooftop solar subsidy schemes—estimate
                        eligibility, understand state rules, and prepare documents for your
                        application.
                    </p>
                    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p class="text-sm font-semibold text-slate-900">Disclaimer</p>
                        <p class="mt-1 text-sm text-slate-500 leading-relaxed">
                            Data based on govt guidelines. Final subsidy approval and amounts
                            depend on your DISCOM, scheme rules, and verification outcomes.
                        </p>
                    </div>
                </div>

                <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 class="text-sm font-semibold text-slate-900">Calculators</h3>
                        <ul class="mt-3 space-y-2">
                            <li><a href="<?= url('calculator#subsidy') ?>" class="text-sm text-slate-500 hover:text-slate-900">Rooftop subsidy calculator</a></li>
                            <li><a href="<?= url('calculator#emi') ?>" class="text-sm text-slate-500 hover:text-slate-900">EMI estimate</a></li>
                            <li><a href="<?= url('calculator#savings') ?>" class="text-sm text-slate-500 hover:text-slate-900">Savings & payback estimate</a></li>
                            <li><a href="<?= url('calculator#loan') ?>" class="text-sm text-slate-500 hover:text-slate-900">Solar loan calculator</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-slate-900">Top states</h3>
                        <ul class="mt-3 space-y-2">
                            <li><a href="<?= url('solar-subsidy-maharashtra') ?>" class="text-sm text-slate-500 hover:text-slate-900">Maharashtra</a></li>
                            <li><a href="<?= url('solar-subsidy-gujarat') ?>" class="text-sm text-slate-500 hover:text-slate-900">Gujarat</a></li>
                            <li><a href="<?= url('solar-subsidy-rajasthan') ?>" class="text-sm text-slate-500 hover:text-slate-900">Rajasthan</a></li>
                            <li><a href="<?= url('solar-subsidy-karnataka') ?>" class="text-sm text-slate-500 hover:text-slate-900">Karnataka</a></li>
                            <li><a href="<?= url('solar-subsidy') ?>" class="text-sm text-solar-600 font-semibold hover:text-solar-700">View all 36 states →</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-slate-900">Top cities</h3>
                        <ul class="mt-3 space-y-2">
                            <li><a href="<?= url('solar-subsidy-mumbai') ?>" class="text-sm text-slate-500 hover:text-slate-900">Mumbai</a></li>
                            <li><a href="<?= url('solar-subsidy-ahmedabad') ?>" class="text-sm text-slate-500 hover:text-slate-900">Ahmedabad</a></li>
                            <li><a href="<?= url('solar-subsidy-delhi') ?>" class="text-sm text-slate-500 hover:text-slate-900">Delhi</a></li>
                            <li><a href="<?= url('solar-subsidy-bangalore') ?>" class="text-sm text-slate-500 hover:text-slate-900">Bangalore</a></li>
                            <li><a href="<?= url('solar-subsidy-pune') ?>" class="text-sm text-slate-500 hover:text-slate-900">Pune</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-slate-900">Blogs</h3>
                        <ul class="mt-3 space-y-2">
                            <li><a href="<?= url('blog') ?>" class="text-sm text-slate-500 hover:text-slate-900">Solar subsidy updates</a></li>
                            <li><a href="<?= url('blog/pm-surya-ghar-yojana-2026') ?>" class="text-sm text-slate-500 hover:text-slate-900">PM Surya Ghar scheme</a></li>
                            <li><a href="<?= url('blog/solar-subsidy-documents-required') ?>" class="text-sm text-slate-500 hover:text-slate-900">Documents checklist</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="mt-10 flex flex-col gap-2 border-t pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>© <?= date('Y') ?> SolarSubsidyCalculator.com</p>
                <div class="flex flex-wrap gap-x-4 gap-y-2">
                    <a href="<?= url('about') ?>" class="hover:text-slate-900">About</a>
                    <a href="<?= url('blog') ?>" class="hover:text-slate-900">Blog</a>
                    <a href="<?= url('blog/solar-subsidy-status-check') ?>" class="hover:text-slate-900">Subsidy Status</a>
                    <a href="<?= url('sitemap.xml') ?>" class="hover:text-slate-900">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Mobile Drawer Interactivity -->
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('mobile-menu-close');
        const drawer = document.getElementById('mobile-menu-drawer');

        if (menuBtn && drawer) {
            menuBtn.addEventListener('click', () => {
                drawer.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            });
        }

        if (closeBtn && drawer) {
            closeBtn.addEventListener('click', () => {
                drawer.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        }

        // Close on clicking backdrop
        if (drawer) {
            drawer.addEventListener('click', (e) => {
                if (e.target === drawer) {
                    drawer.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                }
            });
        }
    });
    </script>
</body>
</html>
