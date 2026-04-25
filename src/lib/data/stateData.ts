export type StateSolarData = {
  discoms: string[];
  sunHours: number;
  sunGrade: string;
  statePortal: string;
  approvalDays: string;
  bestDistricts: string[];
  stateBonus: number | null;
  stateBonusNote?: string;
  policy: string;
  avgTariff: string;
};

export const stateData: Record<string, StateSolarData> = {
  gujarat: {
    discoms: ["UGVCL (North Gujarat)", "MGVCL (Central Gujarat)", "PGVCL (Saurashtra/West)", "DGVCL (South Gujarat)"],
    sunHours: 5.8,
    sunGrade: "A+",
    statePortal: "suryagujarat.guvnl.in",
    approvalDays: "30–45 days",
    bestDistricts: ["Kutch", "Banaskantha", "Patan", "Mehsana", "Ahmedabad"],
    stateBonus: null,
    policy: "Gujarat Solar Power Policy 2021",
    avgTariff: "₹5.50/unit",
  },
  maharashtra: {
    discoms: ["MSEDCL (most areas)", "BEST (Mumbai city)", "Tata Power (Mumbai suburbs)", "Adani Electricity (parts of Mumbai)"],
    sunHours: 5.5,
    sunGrade: "A",
    statePortal: "mahaurja.com",
    approvalDays: "45–60 days",
    bestDistricts: ["Nashik", "Solapur", "Aurangabad", "Pune", "Nagpur"],
    stateBonus: null,
    policy: "Maharashtra Solar Policy 2023",
    avgTariff: "₹6.00/unit",
  },
  rajasthan: {
    discoms: ["JVVNL (Jaipur zone)", "AVVNL (Ajmer zone)", "JDVVNL (Jodhpur zone)"],
    sunHours: 6.0,
    sunGrade: "A+",
    statePortal: "energy.rajasthan.gov.in",
    approvalDays: "30–40 days",
    bestDistricts: ["Jodhpur", "Jaisalmer", "Barmer", "Bikaner", "Jaipur"],
    stateBonus: null,
    policy: "Rajasthan Solar Energy Policy 2019",
    avgTariff: "₹5.75/unit",
  },
  delhi: {
    discoms: ["BSES Rajdhani", "BSES Yamuna", "Tata Power Delhi (TPDDL)"],
    sunHours: 5.2,
    sunGrade: "A",
    statePortal: "solardelhi.in",
    approvalDays: "45–60 days",
    bestDistricts: ["All districts eligible"],
    stateBonus: 10_000,
    stateBonusNote: "Delhi state bonus up to ₹10,000 additional",
    policy: "Delhi Solar Policy 2024",
    avgTariff: "₹6.50/unit",
  },
  karnataka: {
    discoms: [
      "BESCOM (Bangalore + 8 districts)",
      "HESCOM (Hubli)",
      "MESCOM (Mangalore)",
      "GESCOM (Gulbarga)",
      "CESC (Mysore)",
    ],
    sunHours: 5.4,
    sunGrade: "A",
    statePortal: "bescom.org",
    approvalDays: "30–45 days",
    bestDistricts: ["Bidar", "Kalaburagi", "Raichur", "Bellary", "Vijayapura"],
    stateBonus: null,
    policy: "Karnataka Solar Policy 2022",
    avgTariff: "₹6.15/unit",
  },
  "uttar-pradesh": {
    discoms: ["PVVNL (Pashchimanchal)", "DVVNL (Dakshinanchal)", "MVVNL (Madhyanchal)", "PUVVNL (Purvanchal)"],
    sunHours: 4.9,
    sunGrade: "B+",
    statePortal: "upneda.in",
    approvalDays: "45–75 days",
    bestDistricts: ["Agra", "Mathura", "Jhansi", "Banda", "Lucknow"],
    stateBonus: null,
    policy: "UP Solar Energy Policy 2022",
    avgTariff: "₹5.50/unit",
  },
  "tamil-nadu": {
    discoms: ["TANGEDCO (entire state)"],
    sunHours: 5.3,
    sunGrade: "A",
    statePortal: "teda.in",
    approvalDays: "30–45 days",
    bestDistricts: ["Tirunelveli", "Thoothukudi", "Ramanathapuram", "Virudhunagar"],
    stateBonus: null,
    policy: "Tamil Nadu Solar Energy Policy 2019",
    avgTariff: "₹5.30/unit",
  },
  "madhya-pradesh": {
    discoms: ["MPPKVVCL (Jabalpur zone)", "MPMKVVCL (Bhopal zone)", "MPWKVVCL (Indore zone)"],
    sunHours: 5.5,
    sunGrade: "A",
    statePortal: "mprenewable.in",
    approvalDays: "40–60 days",
    bestDistricts: ["Neemuch", "Mandsaur", "Ratlam", "Indore", "Bhopal"],
    stateBonus: null,
    policy: "MP Solar Energy Policy 2022",
    avgTariff: "₹5.25/unit",
  },
};

