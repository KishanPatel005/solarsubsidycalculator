<?php
require_once __DIR__ . '/../../bootstrap.php';
$isHindi = currentLang() === 'hi';
$pathname = $_SERVER['REQUEST_URI'];
?>
<!DOCTYPE html>
<html lang="<?= $isHindi ? 'hi' : 'en' ?>" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Solar Subsidy Calculator India 2026 | PM Surya Ghar' ?></title>
    <meta name="description" content="<?= isset($pageDescription) ? htmlspecialchars($pageDescription) : 'Free solar subsidy calculator for India. Calculate PM Surya Ghar subsidy up to ₹78,000. Check eligibility for all 36 states.' ?>">
    
    <!-- Favicons -->
    <link rel="icon" href="<?= url('favicon.ico') ?>" sizes="any">
    <link rel="icon" href="<?= url('favicon-32x32.png') ?>" sizes="32x32" type="image/png">
    <link rel="icon" href="<?= url('favicon-16x16.png') ?>" sizes="16x16" type="image/png">
    <link rel="apple-touch-icon" href="<?= url('apple-touch-icon.png') ?>" sizes="180x180">
    
    <!-- Google Fonts (Inter) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            solar: {
              50: '#fff7ed',
              100: '#ffedd5',
              200: '#fed7aa',
              300: '#fdba74',
              400: '#fb923c',
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c',
              800: '#9a3412',
              900: '#7c2d12',
              950: '#431407',
            }
          }
        }
      }
    }
    </script>
    
    <style type="text/css">
        .theme {
            --primary: #ea580c;
        }
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z19Y3T44GQ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Z19Y3T44GQ');
    </script>
    
    <?= $extraHead ?? '' ?>
</head>
<body class="min-h-full bg-slate-50 text-slate-900 antialiased flex flex-col">
    <!-- Header Navigation -->
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <a href="<?= url('/') ?>" class="flex items-center gap-2 rounded-md focus-visible:outline-none">
                <span class="inline-flex items-center gap-2">
                    <img src="<?= url('logo.png') ?>" alt="Solar Subsidy Calculator" class="h-9 w-auto" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <span style="display:none;" class="inline-flex items-center justify-center rounded-full bg-solar-100 p-2 text-solar-700 font-bold">☀️</span>
                </span>
            </a>

            <!-- Desktop Links -->
            <div class="hidden items-center gap-2 sm:flex">
                <nav class="flex items-center gap-2">
                    <?php
                    $navItems = [
                        ['href' => 'calculator', 'label' => 'Calculator'],
                        ['href' => 'pm-kusum-calculator', 'label' => 'PM KUSUM'],
                        ['href' => 'blog/solar-subsidy-status-check', 'label' => 'Subsidy Status'],
                        ['href' => 'solar-subsidy', 'label' => 'State Guide'],
                        ['href' => 'blog', 'label' => 'Blog'],
                        ['href' => 'about', 'label' => 'About']
                    ];
                    foreach ($navItems as $item):
                        $linkUrl = url($item['href']);
                        // Check active status
                        $isActive = (strpos($pathname, '/' . $item['href']) !== false);
                        if ($item['href'] === 'calculator' && (strpos($pathname, '/calculator') !== false)) $isActive = true;
                    ?>
                        <a href="<?= $linkUrl ?>" class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 <?= $isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600' ?>">
                            <?= $item['label'] ?>
                        </a>
                    <?php endforeach; ?>
                </nav>
                <div class="ml-2 flex items-center gap-2 text-sm border-l pl-2">
                    <a href="<?= url('api/lang.php?lang=en&redirect=' . urlencode($_SERVER['REQUEST_URI'])) ?>" class="rounded px-2 py-1 hover:bg-slate-100 font-medium <?= !$isHindi ? 'text-solar-700 bg-solar-50' : 'text-slate-500' ?>">EN</a>
                    <span class="text-slate-300">|</span>
                    <a href="<?= url('api/lang.php?lang=hi&redirect=' . urlencode($_SERVER['REQUEST_URI'])) ?>" class="rounded px-2 py-1 hover:bg-slate-100 font-medium <?= $isHindi ? 'text-solar-700 bg-solar-50' : 'text-slate-500' ?>">हिं</a>
                </div>
                <a href="<?= url('calculator') ?>" class="ml-4 rounded-md bg-solar-600 px-4 py-2 text-sm font-semibold text-white hover:bg-solar-700 transition-colors">Start calculation</a>
            </div>

            <!-- Hamburger Button for Mobile -->
            <div class="sm:hidden">
                <button id="mobile-menu-btn" class="inline-flex items-center justify-center p-2 rounded-md border text-slate-700 hover:bg-slate-100 focus:outline-none" aria-label="Open Menu">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Mobile Slide-out Menu Drawer -->
    <div id="mobile-menu-drawer" class="fixed inset-0 z-50 hidden bg-slate-900/40 backdrop-blur-sm">
        <div class="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-white p-6 shadow-xl flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between border-b pb-4">
                    <div class="flex items-center gap-2">
                        <img src="<?= url('logo.png') ?>" alt="Solar Subsidy Calculator" class="h-8 w-auto" />
                    </div>
                    <button id="mobile-menu-close" class="p-2 text-slate-700 hover:bg-slate-100 rounded-md focus:outline-none">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav class="mt-6 flex flex-col gap-2">
                    <?php foreach ($navItems as $item): ?>
                        <a href="<?= url($item['href']) ?>" class="rounded-md px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <?= $item['label'] ?>
                        </a>
                    <?php endforeach; ?>
                </nav>
            </div>
            <div>
                <div class="flex items-center gap-2 text-sm border-t pt-4 border-slate-100">
                    <a href="<?= url('api/lang.php?lang=en&redirect=' . urlencode($_SERVER['REQUEST_URI'])) ?>" class="rounded px-3 py-1.5 hover:bg-slate-100 font-semibold <?= !$isHindi ? 'text-solar-700 bg-solar-50' : 'text-slate-500' ?>">English</a>
                    <span class="text-slate-300">|</span>
                    <a href="<?= url('api/lang.php?lang=hi&redirect=' . urlencode($_SERVER['REQUEST_URI'])) ?>" class="rounded px-3 py-1.5 hover:bg-slate-100 font-semibold <?= $isHindi ? 'text-solar-700 bg-solar-50' : 'text-slate-500' ?>">हिन्दी</a>
                </div>
                <div class="mt-4">
                    <a href="<?= url('calculator') ?>" class="block w-full text-center rounded-md bg-solar-600 py-2.5 text-sm font-semibold text-white hover:bg-solar-700 transition-colors">Start calculation</a>
                    <p class="mt-3 text-center text-xs text-slate-500">Built for India’s rooftop solar subsidy schemes.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Container -->
    <main class="flex-grow mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
