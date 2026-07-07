<?php

namespace Data;

class StateData {
    public static function getAllStatesAndUTs(): array {
        return [
            ['name' => 'Andhra Pradesh', 'slug' => 'andhra-pradesh', 'capital' => 'Amaravati', 'region' => 'South', 'type' => 'State'],
            ['name' => 'Arunachal Pradesh', 'slug' => 'arunachal-pradesh', 'capital' => 'Itanagar', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Assam', 'slug' => 'assam', 'capital' => 'Dispur', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Bihar', 'slug' => 'bihar', 'capital' => 'Patna', 'region' => 'East', 'type' => 'State'],
            ['name' => 'Chhattisgarh', 'slug' => 'chhattisgarh', 'capital' => 'Raipur', 'region' => 'Central', 'type' => 'State'],
            ['name' => 'Goa', 'slug' => 'goa', 'capital' => 'Panaji', 'region' => 'West', 'type' => 'State'],
            ['name' => 'Gujarat', 'slug' => 'gujarat', 'capital' => 'Gandhinagar', 'region' => 'West', 'type' => 'State'],
            ['name' => 'Haryana', 'slug' => 'haryana', 'capital' => 'Chandigarh', 'region' => 'North', 'type' => 'State'],
            ['name' => 'Himachal Pradesh', 'slug' => 'himachal-pradesh', 'capital' => 'Shimla', 'region' => 'North', 'type' => 'State'],
            ['name' => 'Jharkhand', 'slug' => 'jharkhand', 'capital' => 'Ranchi', 'region' => 'East', 'type' => 'State'],
            ['name' => 'Karnataka', 'slug' => 'karnataka', 'capital' => 'Bengaluru', 'region' => 'South', 'type' => 'State'],
            ['name' => 'Kerala', 'slug' => 'kerala', 'capital' => 'Thiruvananthapuram', 'region' => 'South', 'type' => 'State'],
            ['name' => 'Madhya Pradesh', 'slug' => 'madhya-pradesh', 'capital' => 'Bhopal', 'region' => 'Central', 'type' => 'State'],
            ['name' => 'Maharashtra', 'slug' => 'maharashtra', 'capital' => 'Mumbai', 'region' => 'West', 'type' => 'State'],
            ['name' => 'Manipur', 'slug' => 'manipur', 'capital' => 'Imphal', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Meghalaya', 'slug' => 'meghalaya', 'capital' => 'Shillong', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Mizoram', 'slug' => 'mizoram', 'capital' => 'Aizawl', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Nagaland', 'slug' => 'nagaland', 'capital' => 'Kohima', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Odisha', 'slug' => 'odisha', 'capital' => 'Bhubaneswar', 'region' => 'East', 'type' => 'State'],
            ['name' => 'Punjab', 'slug' => 'punjab', 'capital' => 'Chandigarh', 'region' => 'North', 'type' => 'State'],
            ['name' => 'Rajasthan', 'slug' => 'rajasthan', 'capital' => 'Jaipur', 'region' => 'North', 'type' => 'State'],
            ['name' => 'Sikkim', 'slug' => 'sikkim', 'capital' => 'Gangtok', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Tamil Nadu', 'slug' => 'tamil-nadu', 'capital' => 'Chennai', 'region' => 'South', 'type' => 'State'],
            ['name' => 'Telangana', 'slug' => 'telangana', 'capital' => 'Hyderabad', 'region' => 'South', 'type' => 'State'],
            ['name' => 'Tripura', 'slug' => 'tripura', 'capital' => 'Agartala', 'region' => 'Northeast', 'type' => 'State'],
            ['name' => 'Uttar Pradesh', 'slug' => 'uttar-pradesh', 'capital' => 'Lucknow', 'region' => 'North', 'type' => 'State'],
            ['name' => 'Uttarakhand', 'slug' => 'uttarakhand', 'capital' => 'Dehradun', 'region' => 'North', 'type' => 'State'],
            ['name' => 'West Bengal', 'slug' => 'west-bengal', 'capital' => 'Kolkata', 'region' => 'East', 'type' => 'State'],
            // UTs
            ['name' => 'Andaman and Nicobar Islands', 'slug' => 'andaman-and-nicobar-islands', 'capital' => 'Port Blair', 'region' => 'East', 'type' => 'UnionTerritory'],
            ['name' => 'Chandigarh', 'slug' => 'chandigarh', 'capital' => 'Chandigarh', 'region' => 'North', 'type' => 'UnionTerritory'],
            ['name' => 'Dadra and Nagar Haveli and Daman and Diu', 'slug' => 'dadra-and-nagar-haveli-and-daman-and-diu', 'capital' => 'Daman', 'region' => 'West', 'type' => 'UnionTerritory'],
            ['name' => 'Delhi', 'slug' => 'delhi', 'capital' => 'New Delhi', 'region' => 'North', 'type' => 'UnionTerritory'],
            ['name' => 'Jammu and Kashmir', 'slug' => 'jammu-and-kashmir', 'capital' => 'Srinagar (Summer), Jammu (Winter)', 'region' => 'North', 'type' => 'UnionTerritory'],
            ['name' => 'Ladakh', 'slug' => 'ladakh', 'capital' => 'Leh', 'region' => 'North', 'type' => 'UnionTerritory'],
            ['name' => 'Lakshadweep', 'slug' => 'lakshadweep', 'capital' => 'Kavaratti', 'region' => 'South', 'type' => 'UnionTerritory'],
            ['name' => 'Puducherry', 'slug' => 'puducherry', 'capital' => 'Puducherry', 'region' => 'South', 'type' => 'UnionTerritory']
        ];
    }

    public static function getStateSolarData(string $slug): ?array {
        $data = [
            'gujarat' => [
                'discoms' => ["UGVCL (North)", "MGVCL (Central)", "PGVCL (Saurashtra)", "DGVCL (South)"],
                'sunHours' => 5.8,
                'sunGrade' => 'A+',
                'statePortal' => 'suryagujarat.guvnl.in',
                'approvalDays' => '30–45 days',
                'bestDistricts' => ["Kutch", "Banaskantha", "Patan", "Mehsana", "Ahmedabad"],
                'stateBonus' => null,
                'policy' => 'Gujarat Solar Power Policy 2021',
                'avgTariff' => '₹5.50/unit'
            ],
            'maharashtra' => [
                'discoms' => ["MSEDCL (most areas)", "BEST (Mumbai city)", "Tata Power (suburbs)", "Adani Electricity"],
                'sunHours' => 5.5,
                'sunGrade' => 'A',
                'statePortal' => 'mahaurja.com',
                'approvalDays' => '45–60 days',
                'bestDistricts' => ["Nashik", "Solapur", "Aurangabad", "Pune", "Nagpur"],
                'stateBonus' => null,
                'policy' => 'Maharashtra Solar Policy 2023',
                'avgTariff' => '₹6.00/unit'
            ],
            'rajasthan' => [
                'discoms' => ["JVVNL (Jaipur)", "AVVNL (Ajmer)", "JDVVNL (Jodhpur)"],
                'sunHours' => 6.0,
                'sunGrade' => 'A+',
                'statePortal' => 'energy.rajasthan.gov.in',
                'approvalDays' => '30–40 days',
                'bestDistricts' => ["Jodhpur", "Jaisalmer", "Barmer", "Bikaner", "Jaipur"],
                'stateBonus' => null,
                'policy' => 'Rajasthan Solar Energy Policy 2019',
                'avgTariff' => '₹5.75/unit'
            ],
            'delhi' => [
                'discoms' => ["BSES Rajdhani", "BSES Yamuna", "Tata Power Delhi (TPDDL)"],
                'sunHours' => 5.2,
                'sunGrade' => 'A',
                'statePortal' => 'solardelhi.in',
                'approvalDays' => '45–60 days',
                'bestDistricts' => ["All districts eligible"],
                'stateBonus' => 10000,
                'stateBonusNote' => 'Delhi state bonus up to ₹10,000 additional',
                'policy' => 'Delhi Solar Policy 2024',
                'avgTariff' => '₹6.50/unit'
            ],
            'karnataka' => [
                'discoms' => ["BESCOM (Bangalore)", "HESCOM (Hubli)", "MESCOM (Mangalore)", "GESCOM (Gulbarga)", "CESC (Mysore)"],
                'sunHours' => 5.4,
                'sunGrade' => 'A',
                'statePortal' => 'bescom.org',
                'approvalDays' => '30–45 days',
                'bestDistricts' => ["Bidar", "Kalaburagi", "Raichur", "Bellary", "Vijayapura"],
                'stateBonus' => null,
                'policy' => 'Karnataka Solar Policy 2022',
                'avgTariff' => '₹6.15/unit'
            ],
            'uttar-pradesh' => [
                'discoms' => ["PVVNL (Pashchim)", "DVVNL (Dakshin)", "MVVNL (Madhya)", "PUVVNL (Purva)"],
                'sunHours' => 4.9,
                'sunGrade' => 'B+',
                'statePortal' => 'upneda.in',
                'approvalDays' => '45–75 days',
                'bestDistricts' => ["Agra", "Mathura", "Jhansi", "Banda", "Lucknow"],
                'stateBonus' => null,
                'policy' => 'UP Solar Energy Policy 2022',
                'avgTariff' => '₹5.50/unit'
            ],
            'tamil-nadu' => [
                'discoms' => ["TANGEDCO (entire state)"],
                'sunHours' => 5.3,
                'sunGrade' => 'A',
                'statePortal' => 'teda.in',
                'approvalDays' => '30–45 days',
                'bestDistricts' => ["Tirunelveli", "Thoothukudi", "Ramanathapuram", "Virudhunagar"],
                'stateBonus' => null,
                'policy' => 'Tamil Nadu Solar Energy Policy 2019',
                'avgTariff' => '₹5.30/unit'
            ],
            'madhya-pradesh' => [
                'discoms' => ["MPPKVVCL (Jabalpur)", "MPMKVVCL (Bhopal)", "MPWKVVCL (Indore)"],
                'sunHours' => 5.5,
                'sunGrade' => 'A',
                'statePortal' => 'mprenewable.in',
                'approvalDays' => '40–60 days',
                'bestDistricts' => ["Neemuch", "Mandsaur", "Ratlam", "Indore", "Bhopal"],
                'stateBonus' => null,
                'policy' => 'MP Solar Energy Policy 2022',
                'avgTariff' => '₹5.25/unit'
            ]
        ];
        return $data[$slug] ?? null;
    }

    public static function getStateSubsidyContent(string $slug): array {
        $commonEligibility = [
            "Applicant must be a residential electricity consumer (scheme is for residential rooftop solar).",
            "Rooftop solar system must be grid-connected and installed through an empanelled/approved vendor as per scheme process.",
            "Net metering / commissioning and DISCOM inspection are required before subsidy is released."
        ];

        $commonSteps = [
            "Register and apply on the National Portal, selecting your state, DISCOM and consumer number.",
            "Wait for DISCOM feasibility/approval on the portal.",
            "Install rooftop solar through an empanelled vendor as per portal guidance.",
            "Apply for net metering and complete DISCOM inspection/commissioning.",
            "Submit bank details on the portal to receive subsidy via DBT after commissioning."
        ];

        $commonDocuments = [
            "Latest electricity bill / consumer number",
            "Aadhaar / identity proof",
            "Address proof",
            "Bank account details for DBT (account number, IFSC)",
            "Rooftop ownership/authorization proof (as required by your DISCOM)"
        ];

        $states = [
            'gujarat' => [
                'officialPortalUrl' => 'https://suryagujarat.guvnl.in',
                'extraStateBenefits' => []
            ],
            'maharashtra' => [
                'officialPortalUrl' => 'https://www.mahadiscom.in/solar-rooftop/',
                'extraStateBenefits' => [
                    "Maharashtra State Solar Policy 2023 offers additional facilitation for residential housing societies.",
                    "Simplified net metering process through MSEDCL portal."
                ]
            ],
            'rajasthan' => [
                'officialPortalUrl' => 'https://energy.rajasthan.gov.in/rrecl',
                'extraStateBenefits' => [
                    "Rajasthan Solar Energy Policy 2019 focuses on maximizing solar potential in high-irradiation zones.",
                    "Special incentives for domestic manufacturing in some phases (verify latest status)."
                ]
            ],
            'uttar-pradesh' => [
                'officialPortalUrl' => 'http://upneda.in',
                'extraStateBenefits' => [
                    "UP Solar Energy Policy 2022 provides additional state subsidy for residential systems up to 10 kW.",
                    "Dedicated solar cities like Ayodhya and Varanasi with priority facilitation."
                ]
            ],
            'delhi' => [
                'officialPortalUrl' => 'https://solar.delhi.gov.in',
                'extraStateBenefits' => [
                    "State capital subsidy (policy-linked): ₹2,000/kW up to ₹10,000 per consumer (verify DISCOM implementation).",
                    "Generation-based incentive (GBI) slabs for 5 years (verify latest policy/portal slabs for your category)."
                ]
            ]
        ];

        $allStatesList = self::getAllStatesAndUTs();
        $matched = null;
        foreach ($allStatesList as $s) {
            if ($s['slug'] === $slug) {
                $matched = $s;
                break;
            }
        }

        if (!$matched) {
            return [];
        }

        $specific = $states[$slug] ?? [
            'officialPortalUrl' => 'https://pmsuryaghar.gov.in',
            'extraStateBenefits' => []
        ];

        return [
            'stateSlug' => $slug,
            'stateName' => $matched['name'],
            'eligibilityRules' => $commonEligibility,
            'howToApplySteps' => $commonSteps,
            'officialPortalUrl' => $specific['officialPortalUrl'],
            'documentsRequired' => $commonDocuments,
            'extraStateBenefits' => $specific['extraStateBenefits'],
            'sources' => [
                'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2010133',
                'https://pmsuryaghar.gov.in'
            ]
        ];
    }
}
