<?php
$pageTitle = "India Solar Potential Map 2026 | Solar Irradiance";
$pageDescription = "Explore state-wise solar radiation potential, peak sun hours per day, grade ratings, and recommended districts on our interactive India solar map.";
require_once __DIR__ . '/templates/layout/header.php';

use Data\SolarPotential;
$rows = SolarPotential::getSolarPotentialStateRows();

$tilesLayout = [
    ['slug' => 'ladakh', 'x' => 7, 'y' => 0, 'label' => 'LA'],
    ['slug' => 'jammu-and-kashmir', 'x' => 6, 'y' => 1, 'label' => 'J&K'],
    ['slug' => 'himachal-pradesh', 'x' => 7, 'y' => 1, 'label' => 'HP'],
    ['slug' => 'punjab', 'x' => 6, 'y' => 2, 'label' => 'PB'],
    ['slug' => 'chandigarh', 'x' => 7, 'y' => 2, 'label' => 'CH'],
    ['slug' => 'haryana', 'x' => 8, 'y' => 2, 'label' => 'HR'],
    ['slug' => 'delhi', 'x' => 8, 'y' => 3, 'label' => 'DL'],
    ['slug' => 'uttarakhand', 'x' => 9, 'y' => 2, 'label' => 'UK'],
    ['slug' => 'rajasthan', 'x' => 6, 'y' => 4, 'label' => 'RJ'],
    ['slug' => 'uttar-pradesh', 'x' => 9, 'y' => 4, 'label' => 'UP'],
    ['slug' => 'bihar', 'x' => 11, 'y' => 4, 'label' => 'BR'],
    ['slug' => 'sikkim', 'x' => 12, 'y' => 3, 'label' => 'SK'],
    ['slug' => 'arunachal-pradesh', 'x' => 14, 'y' => 3, 'label' => 'AR'],
    ['slug' => 'assam', 'x' => 13, 'y' => 4, 'label' => 'AS'],
    ['slug' => 'nagaland', 'x' => 14, 'y' => 4, 'label' => 'NL'],
    ['slug' => 'manipur', 'x' => 14, 'y' => 5, 'label' => 'MN'],
    ['slug' => 'mizoram', 'x' => 13, 'y' => 5, 'label' => 'MZ'],
    ['slug' => 'tripura', 'x' => 13, 'y' => 6, 'label' => 'TR'],
    ['slug' => 'meghalaya', 'x' => 12, 'y' => 5, 'label' => 'ML'],
    ['slug' => 'west-bengal', 'x' => 12, 'y' => 4, 'label' => 'WB'],
    ['slug' => 'jharkhand', 'x' => 11, 'y' => 5, 'label' => 'JH'],
    ['slug' => 'odisha', 'x' => 11, 'y' => 6, 'label' => 'OD'],
    ['slug' => 'gujarat', 'x' => 5, 'y' => 6, 'label' => 'GJ'],
    ['slug' => 'dadra-and-nagar-haveli-and-daman-and-diu', 'x' => 6, 'y' => 7, 'label' => 'DN'],
    ['slug' => 'maharashtra', 'x' => 7, 'y' => 7, 'label' => 'MH'],
    ['slug' => 'goa', 'x' => 6, 'y' => 8, 'label' => 'GA'],
    ['slug' => 'madhya-pradesh', 'x' => 8, 'y' => 6, 'label' => 'MP'],
    ['slug' => 'chhattisgarh', 'x' => 9, 'y' => 6, 'label' => 'CG'],
    ['slug' => 'telangana', 'x' => 9, 'y' => 8, 'label' => 'TG'],
    ['slug' => 'andhra-pradesh', 'x' => 10, 'y' => 9, 'label' => 'AP'],
    ['slug' => 'karnataka', 'x' => 8, 'y' => 9, 'label' => 'KA'],
    ['slug' => 'tamil-nadu', 'x' => 9, 'y' => 11, 'label' => 'TN'],
    ['slug' => 'kerala', 'x' => 8, 'y' => 11, 'label' => 'KL'],
    ['slug' => 'puducherry', 'x' => 10, 'y' => 11, 'label' => 'PY'],
    ['slug' => 'andaman-and-nicobar-islands', 'x' => 14, 'y' => 11, 'label' => 'AN'],
    ['slug' => 'lakshadweep', 'x' => 5, 'y' => 11, 'label' => 'LD'],
];

// SVG Dimension configurations
$tileSize = 34;
$tileGap = 6;
$pad = 10;
$svgW = $pad * 2 + (16 * ($tileSize + $tileGap));
$svgH = $pad * 2 + (13 * ($tileSize + $tileGap));

// Sort potential rows by grade descending, then sun hours descending
usort($rows, function($a, $b) {
    $order = ['A+' => 0, 'A' => 1, 'B+' => 2, 'B' => 3];
    $g = $order[$a['grade']] - $order[$b['grade']];
    return $g !== 0 ? $g : ($b['sunHours'] <=> $a['sunHours']);
});
?>
<div class="space-y-10 pb-12">
    <section class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
            <span class="rounded bg-orange-600 text-white font-semibold text-xs px-2.5 py-1">Updated 2026</span>
            <span class="rounded bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1">Interactive map</span>
            <span class="rounded bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1">State-wise sun hours</span>
        </div>
        <div class="space-y-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                India Solar Potential Map 2026 — State Wise Solar Irradiance
            </h1>
            <p class="max-w-3xl text-sm text-slate-500 sm:text-base leading-relaxed">
                Click a state/UT to see typical peak sun hours, best districts for rooftop solar, and an official central
                subsidy estimate (up to 3kW).
            </p>
        </div>
    </section>

    <!-- Interactive Grid Layout -->
    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <!-- Map Canvas -->
        <div class="rounded-xl border bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between gap-3 border-b pb-4 mb-4">
                <div class="text-sm font-semibold text-slate-800">Interactive India solar map (schematic)</div>
                <div class="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
                    <span class="inline-flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-emerald-600"></span> A+</span>
                    <span class="inline-flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-emerald-500"></span> A</span>
                    <span class="inline-flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-amber-500"></span> B+</span>
                    <span class="inline-flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-orange-500"></span> B</span>
                </div>
            </div>

            <div class="overflow-x-auto">
                <svg width="<?= $svgW ?>" height="<?= $svgH ?>" viewBox="0 0 <?= $svgW ?> <?= $svgH ?>" class="mx-auto block min-w-[640px]">
                    <?php
                    // Group potentials by slug for easy map matching
                    $potMap = [];
                    foreach ($rows as $r) {
                        $potMap[$r['slug']] = $r;
                    }

                    foreach ($tilesLayout as $t):
                        $r = $potMap[$t['slug']] ?? null;
                        if (!$r) continue;
                        $x = $pad + $t['x'] * ($tileSize + $tileGap);
                        $y = $pad + $t['y'] * ($tileSize + $tileGap);
                        
                        // Map colors based on potential grades
                        $fillClass = 'fill-orange-500';
                        if ($r['grade'] === 'A+') $fillClass = 'fill-emerald-600';
                        elseif ($r['grade'] === 'A') $fillClass = 'fill-emerald-500';
                        elseif ($r['grade'] === 'B+') $fillClass = 'fill-amber-500';
                    ?>
                        <g class="map-tile cursor-pointer transition-opacity opacity-85 hover:opacity-100" 
                           data-slug="<?= htmlspecialchars($t['slug']) ?>" 
                           data-name="<?= htmlspecialchars($r['name']) ?>"
                           data-grade="<?= htmlspecialchars($r['grade']) ?>"
                           data-sunhours="<?= $r['sunHours'] ?>"
                           data-districts="<?= htmlspecialchars(json_encode($r['bestDistricts'])) ?>">
                            <rect x="<?= $x ?>" y="<?= $y ?>" width="<?= $tileSize ?>" height="<?= $tileSize ?>" rx="8" class="<?= $fillClass ?> stroke-slate-200" stroke-width="1" />
                            <text x="<?= $x + $tileSize / 2 ?>" y="<?= $y + $tileSize / 2 + 4 ?>" text-anchor="middle" class="select-none fill-white text-[10px] font-bold"><?= $t['label'] ?></text>
                        </g>
                    <?php endforeach; ?>
                </svg>
            </div>
            
            <div class="mt-4 flex items-start gap-2 text-xs text-slate-400">
                <span>ℹ️</span>
                <p>This is a schematic tile-map for fast comparison and sharing. For exact irradiance layers, use MNRE/NISE GIS tools.</p>
            </div>
        </div>

        <!-- Sidebar Info -->
        <div class="rounded-xl border bg-white p-5 shadow-sm space-y-6 h-fit">
            <div class="flex items-start justify-between gap-3 border-b pb-4">
                <div>
                    <div class="text-sm text-slate-400">Selected state / UT</div>
                    <div class="mt-1 text-xl font-bold text-slate-800" id="sidebar-state-name">Gujarat</div>
                    <div class="mt-2">
                        <span class="rounded bg-emerald-600 text-white font-semibold text-xs px-2.5 py-1" id="sidebar-state-grade">Grade A+</span>
                    </div>
                </div>
                <a href="<?= url('solar-subsidy-gujarat') ?>" id="sidebar-state-link" class="rounded-md border border-slate-200 hover:bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors">Open guide</a>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div class="rounded-xl border bg-slate-50 p-4">
                    <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Typical peak sun hours</p>
                    <p class="mt-1 text-lg font-bold text-slate-800" id="sidebar-state-hours">5.8 hrs/day</p>
                </div>
                <div class="rounded-xl border bg-slate-50 p-4 border-emerald-100">
                    <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Central subsidy estimate (up to 3kW)</p>
                    <p class="mt-1 text-lg font-bold text-emerald-600">₹78,000</p>
                    <p class="mt-1 text-xs text-slate-400">Actual state bonus varies by policy/utility.</p>
                </div>
            </div>

            <div>
                <div class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <span>📍</span>
                    <span>Best districts (shortlist)</span>
                </div>
                <div class="mt-2 flex flex-wrap gap-2" id="sidebar-state-districts">
                    <span class="rounded bg-slate-100 text-slate-800 text-xs px-2.5 py-1 font-medium">Kutch</span>
                    <span class="rounded bg-slate-100 text-slate-800 text-xs px-2.5 py-1 font-medium">Banaskantha</span>
                    <span class="rounded bg-slate-100 text-slate-800 text-xs px-2.5 py-1 font-medium">Jamnagar</span>
                    <span class="rounded bg-slate-100 text-slate-800 text-xs px-2.5 py-1 font-medium">Bhavnagar</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Data Table -->
    <section class="space-y-4">
        <div class="space-y-1">
            <h2 class="text-xl font-bold text-slate-900">State-wise solar potential table</h2>
            <p class="text-sm text-slate-500">Use this for quick comparisons and as a shareable reference.</p>
        </div>

        <div class="rounded-xl border bg-white overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-sm text-left">
                    <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <tr class="border-b">
                            <th class="px-6 py-4">State / UT</th>
                            <th class="px-6 py-4">Grade</th>
                            <th class="px-6 py-4">Sun hours</th>
                            <th class="px-6 py-4">Best districts</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y text-slate-600">
                        <?php foreach ($rows as $r):
                            $gClass = 'bg-orange-500';
                            if ($r['grade'] === 'A+') $gClass = 'bg-emerald-600';
                            elseif ($r['grade'] === 'A') $gClass = 'bg-emerald-500';
                            elseif ($r['grade'] === 'B+') $gClass = 'bg-amber-500';
                        ?>
                            <tr class="hover:bg-slate-50" data-row-slug="<?= htmlspecialchars($r['slug']) ?>">
                                <td class="px-6 py-4">
                                    <button class="font-bold text-solar-700 hover:underline hover:text-solar-800 select-state-btn" data-slug="<?= htmlspecialchars($r['slug']) ?>">
                                        <?= htmlspecialchars($r['name']) ?>
                                    </button>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="rounded text-white font-bold text-xs px-2 py-0.5 <?= $gClass ?>"><?= htmlspecialchars($r['grade']) ?></span>
                                </td>
                                <td class="px-6 py-4 font-medium"><?= number_format($r['sunHours'], 1) ?> hrs/day</td>
                                <td class="px-6 py-4 text-slate-400"><?= htmlspecialchars(implode(', ', $r['bestDistricts'])) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.map-tile');
    
    // Elements to update
    const stateNameEl = document.getElementById('sidebar-state-name');
    const stateGradeEl = document.getElementById('sidebar-state-grade');
    const stateHoursEl = document.getElementById('sidebar-state-hours');
    const stateLinkEl = document.getElementById('sidebar-state-link');
    const districtsContainer = document.getElementById('sidebar-state-districts');

    function selectState(slug, name, grade, sunhours, districts) {
        stateNameEl.textContent = name;
        stateGradeEl.textContent = `Grade ${grade}`;
        stateHoursEl.textContent = `${Number(sunhours).toFixed(1)} hrs/day`;
        stateLinkEl.setAttribute('href', `<?= url("solar-subsidy-") ?>${slug}`);
        
        // Update grade badge colors
        stateGradeEl.className = 'rounded text-white font-semibold text-xs px-2.5 py-1';
        if (grade === 'A+') stateGradeEl.classList.add('bg-emerald-600');
        else if (grade === 'A') stateGradeEl.classList.add('bg-emerald-500');
        else if (grade === 'B+') stateGradeEl.classList.add('bg-amber-500');
        else stateGradeEl.classList.add('bg-orange-500');

        // Render districts
        let distHtml = '';
        districts.forEach(d => {
            distHtml += `<span class="rounded bg-slate-100 text-slate-800 text-xs px-2.5 py-1 font-medium">${d}</span>`;
        });
        districtsContainer.innerHTML = distHtml;

        // Toggle active border styles on svg tiles
        tiles.forEach(t => {
            const rect = t.querySelector('rect');
            if (t.getAttribute('data-slug') === slug) {
                rect.setAttribute('stroke', '#111827');
                rect.setAttribute('stroke-width', '2');
                t.style.opacity = '1';
            } else {
                rect.setAttribute('stroke', 'rgba(17,24,39,0.25)');
                rect.setAttribute('stroke-width', '1');
                t.style.opacity = '0.85';
            }
        });
    }

    // Attach click events on SVG tiles
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const slug = tile.getAttribute('data-slug');
            const name = tile.getAttribute('data-name');
            const grade = tile.getAttribute('data-grade');
            const sunhours = tile.getAttribute('data-sunhours');
            const districts = JSON.parse(tile.getAttribute('data-districts'));

            selectState(slug, name, grade, sunhours, districts);
        });
    });

    // Attach click events on Table Buttons
    document.querySelectorAll('.select-state-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const slug = btn.getAttribute('data-slug');
            // Find map tile and click it
            const matchedTile = document.querySelector(`.map-tile[data-slug="${slug}"]`);
            if (matchedTile) {
                matchedTile.dispatchEvent(new Event('click'));
                // Scroll to sidebar on mobile
                document.getElementById('sidebar-state-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Set initial active state (Gujarat)
    const initialTile = document.querySelector('.map-tile[data-slug="gujarat"]');
    if (initialTile) initialTile.dispatchEvent(new Event('click'));
});
</script>
<?php require_once __DIR__ . '/templates/layout/footer.php'; ?>
