<?php

namespace Data;

class SubsidyRates {
    public static function getSubsidyRates(): array {
        return [
            'central' => [
                'schemeName' => 'PM-Surya Ghar: Muft Bijli Yojana (Residential Rooftop Solar CFA)',
                'effectiveFromYear' => 2024,
                'currency' => 'INR',
                'perKwUpTo2kW' => 30000,
                'amountFor2kW' => 60000,
                'amountForThirdkW' => 18000,
                'maxAmount' => 78000,
                'sources' => [
                    'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2010133',
                    'https://pmsuryaghar.gov.in'
                ]
            ],
            'stateAdditional' => [
                [
                    'stateSlug' => 'gujarat',
                    'stateName' => 'Gujarat',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Gujarat has historically run state-level rooftop programs (e.g., SURYA Gujarat). For 2026, verify any extra state subsidy/GBI on the official Gujarat DISCOM rooftop portal and state energy department policy documents.',
                    'officialPortalUrl' => 'https://suryagujarat.guvnl.in',
                    'sources' => [
                        'https://suryagujarat.guvnl.in',
                        'https://guj-epd.gujarat.gov.in/Home/GujaratREPolicy'
                    ]
                ],
                [
                    'stateSlug' => 'haryana',
                    'stateName' => 'Haryana',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Haryana rooftop solar applications typically route via DISCOM portals (DHBVN/UHBVN) for approvals and net metering. Verify if any state incentive applies for residential consumers in 2026.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'maharashtra',
                    'stateName' => 'Maharashtra',
                    'verificationStatus' => 'unverified',
                    'notes' => 'State-level residential add-ons vary by DISCOM and policy. Verify 2026 incentives (if any) via MSEDCL/other DISCOM portals and official notifications.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'delhi',
                    'stateName' => 'Delhi',
                    'verificationStatus' => 'verified',
                    'additionalSubsidyAmount' => [
                        'currency' => 'INR',
                        'perKw' => 2000,
                        'maxCap' => 10000
                    ],
                    'notes' => 'Delhi Solar Energy Policy provides (a) state capital subsidy of ₹2,000/kW up to ₹10,000 per consumer, and (b) generation-based incentive (GBI) slabs for 5 years (verify DISCOM/portal implementation for your category).',
                    'officialPortalUrl' => 'https://solar.delhi.gov.in',
                    'sources' => [
                        'https://eerem.delhi.gov.in/eerem/about-delhi-solar-energy-policy',
                        'https://solar.delhi.gov.in',
                        'https://pmsuryaghar.gov.in'
                    ]
                ],
                [
                    'stateSlug' => 'kerala',
                    'stateName' => 'Kerala',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Kerala rooftop solar is coordinated via KSEB and the national portal. Verify any Kerala-specific additional subsidy/benefits for 2026 via official KSEB/ANERT communications.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'punjab',
                    'stateName' => 'Punjab',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Punjab residential rooftop solar add-on subsidy/GBI via PEDA/PSPCL official sources and notifications.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'telangana',
                    'stateName' => 'Telangana',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Telangana residential rooftop add-on incentives via TSREDCO/DISCOM notifications. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'karnataka',
                    'stateName' => 'Karnataka',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Karnataka residential rooftop add-on incentives via KREDL/ESCOM official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'andhra-pradesh',
                    'stateName' => 'Andhra Pradesh',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Andhra Pradesh residential rooftop add-on incentives via NREDCAP/APDISCOM official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'rajasthan',
                    'stateName' => 'Rajasthan',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Rajasthan residential rooftop add-on incentives via RRECL/JVVNL/AVVNL/JdVVNL official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'uttar-pradesh',
                    'stateName' => 'Uttar Pradesh',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Uttar Pradesh rooftop solar is coordinated via UPNEDA and DISCOMs. Verify any 2026 state add-on incentives via UPNEDA official portal/notifications.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'tamil-nadu',
                    'stateName' => 'Tamil Nadu',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Tamil Nadu residential rooftop add-on incentives via TEDA/TANGEDCO official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'bihar',
                    'stateName' => 'Bihar',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Bihar residential rooftop add-on incentives via BREDA/BSPHCL official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'assam',
                    'stateName' => 'Assam',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Assam residential rooftop add-on incentives via AEDA/APDCL official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'odisha',
                    'stateName' => 'Odisha',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 Odisha residential rooftop add-on incentives via OREDA/TPCODL/other DISCOM official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ],
                [
                    'stateSlug' => 'west-bengal',
                    'stateName' => 'West Bengal',
                    'verificationStatus' => 'unverified',
                    'notes' => 'Verify any 2026 West Bengal residential rooftop add-on incentives via WBREDA/WBSEDCL/CESC official sources. Central CFA applies via the national portal.',
                    'sources' => ['https://pmsuryaghar.gov.in']
                ]
            ]
        ];
    }

    public static function calculateCentralSubsidy(float $systemSizeKw): float {
        $rates = self::getSubsidyRates()['central'];
        $kw = max(0.0, $systemSizeKw);

        if ($kw <= 0) return 0;
        if ($kw <= 1) return min($rates['perKwUpTo2kW'], $rates['maxAmount']);
        if ($kw <= 2) return min($kw * $rates['perKwUpTo2kW'], $rates['maxAmount']);

        // 2–3 kW: amountFor2kW + dynamic portion of 3rd kW
        $thirdKwPortion = min(1.0, $kw - 2.0);
        $amount = $rates['amountFor2kW'] + ($thirdKwPortion * $rates['amountForThirdkW']);

        return min($amount, $rates['maxAmount']);
    }

    public static function calculateStateSubsidy(float $systemSizeKw, string $stateSlug): float {
        $rates = self::getSubsidyRates()['stateAdditional'];
        $matched = null;
        foreach ($rates as $r) {
            if ($r['stateSlug'] === $stateSlug) {
                $matched = $r;
                break;
            }
        }

        if (!$matched || !isset($matched['additionalSubsidyAmount'])) {
            return 0;
        }

        $amt = $matched['additionalSubsidyAmount'];
        $maxCap = $amt['maxCap'] ?? null;

        if (isset($amt['perKw'])) {
            $raw = $amt['perKw'] * $systemSizeKw;
            $capped = ($maxCap !== null) ? min($raw, $maxCap) : $raw;
            return max(0.0, round($capped));
        }

        if (isset($amt['flat'])) {
            $raw = $amt['flat'];
            $capped = ($maxCap !== null) ? min($raw, $maxCap) : $raw;
            return max(0.0, round($capped));
        }

        return 0;
    }
}
