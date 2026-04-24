export type VerificationStatus = "verified" | "unverified";

export interface CentralSubsidyRate {
  schemeName: string;
  effectiveFromYear: number;
  currency: "INR";
  /**
   * ₹ per kW for the first 1–2 kW (capped at 2 kW).
   * PIB describes this as CFA ~60% at benchmark prices, i.e. ₹30,000 per kW for 1–2 kW.
   */
  perKwUpTo2kW: number;
  /**
   * Lump-sum amount for a 2 kW system (₹60,000 in PIB).
   * Kept explicit to match official comms.
   */
  amountFor2kW: number;
  /**
   * Additional amount for the 3rd kW (₹18,000), for systems between 2–3 kW.
   */
  amountForThirdkW: number;
  /**
   * Maximum CFA cap for >= 3 kW system (₹78,000).
   */
  maxAmount: number;
  sources: string[];
}

export interface StateAdditionalSubsidy {
  /**
   * State/UT slug (e.g. "gujarat", "delhi").
   */
  stateSlug: string;
  stateName: string;
  verificationStatus: VerificationStatus;
  /**
   * Some states offer an extra capital subsidy/GBI/rebate. If the amount is not
   * reliably available for 2026, keep this undefined and use notes + sources.
   */
  additionalSubsidyAmount?: {
    currency: "INR";
    /**
     * When known, express as a fixed amount per kW OR a flat cap.
     * Exactly one of these should typically be present.
     */
    perKw?: number;
    flat?: number;
    maxCap?: number;
  };
  notes: string;
  officialPortalUrl?: string;
  sources: string[];
}

export interface SubsidyRatesData {
  central: CentralSubsidyRate;
  stateAdditional: readonly StateAdditionalSubsidy[];
}

export const subsidyRates2026: SubsidyRatesData = {
  central: {
    schemeName: "PM-Surya Ghar: Muft Bijli Yojana (Residential Rooftop Solar CFA)",
    effectiveFromYear: 2024,
    currency: "INR",
    perKwUpTo2kW: 30_000,
    amountFor2kW: 60_000,
    amountForThirdkW: 18_000,
    maxAmount: 78_000,
    sources: [
      "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2010133",
      "https://pmsuryaghar.gov.in",
    ],
  },

  /**
   * NOTE (data policy):
   * - These are STATE-LEVEL add-ons beyond the central CFA, where applicable.
   * - 2026 state add-ons are not consistently published in one official machine-readable source.
   * - We include entries for the states you requested, and mark unverified if amounts can't be confirmed.
   */
  stateAdditional: [
    {
      stateSlug: "gujarat",
      stateName: "Gujarat",
      verificationStatus: "unverified",
      notes:
        "Gujarat has historically run state-level rooftop programs (e.g., SURYA Gujarat). For 2026, verify any extra state subsidy/GBI on the official Gujarat DISCOM rooftop portal and state energy department policy documents.",
      officialPortalUrl: "https://suryagujarat.guvnl.in",
      sources: [
        "https://suryagujarat.guvnl.in",
        "https://guj-epd.gujarat.gov.in/Home/GujaratREPolicy",
      ],
    },
    {
      stateSlug: "haryana",
      stateName: "Haryana",
      verificationStatus: "unverified",
      notes:
        "Haryana rooftop solar applications typically route via DISCOM portals (DHBVN/UHBVN) for approvals and net metering. Verify if any state incentive applies for residential consumers in 2026.",
      sources: [
        "https://pmsuryaghar.gov.in",
      ],
    },
    {
      stateSlug: "maharashtra",
      stateName: "Maharashtra",
      verificationStatus: "unverified",
      notes:
        "State-level residential add-ons vary by DISCOM and policy. Verify 2026 incentives (if any) via MSEDCL/other DISCOM portals and official notifications.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "delhi",
      stateName: "Delhi",
      verificationStatus: "verified",
      additionalSubsidyAmount: {
        currency: "INR",
        perKw: 2_000,
        maxCap: 10_000,
      },
      notes:
        "Delhi Solar Energy Policy provides (a) state capital subsidy of ₹2,000/kW up to ₹10,000 per consumer, and (b) generation-based incentive (GBI) slabs for 5 years (verify DISCOM/portal implementation for your category).",
      officialPortalUrl: "https://solar.delhi.gov.in",
      sources: [
        "https://eerem.delhi.gov.in/eerem/about-delhi-solar-energy-policy",
        "https://solar.delhi.gov.in",
        "https://pmsuryaghar.gov.in",
      ],
    },
    {
      stateSlug: "kerala",
      stateName: "Kerala",
      verificationStatus: "unverified",
      notes:
        "Kerala rooftop solar is coordinated via KSEB and the national portal. Verify any Kerala-specific additional subsidy/benefits for 2026 via official KSEB/ANERT communications.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "punjab",
      stateName: "Punjab",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Punjab residential rooftop solar add-on subsidy/GBI via PEDA/PSPCL official sources and notifications.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "telangana",
      stateName: "Telangana",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Telangana residential rooftop add-on incentives via TSREDCO/DISCOM notifications. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "karnataka",
      stateName: "Karnataka",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Karnataka residential rooftop add-on incentives via KREDL/ESCOM official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "andhra-pradesh",
      stateName: "Andhra Pradesh",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Andhra Pradesh residential rooftop add-on incentives via NREDCAP/APDISCOM official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "rajasthan",
      stateName: "Rajasthan",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Rajasthan residential rooftop add-on incentives via RRECL/JVVNL/AVVNL/JdVVNL official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "uttar-pradesh",
      stateName: "Uttar Pradesh",
      verificationStatus: "unverified",
      notes:
        "Uttar Pradesh rooftop solar is coordinated via UPNEDA and DISCOMs. Verify any 2026 state add-on incentives via UPNEDA official portal/notifications.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "tamil-nadu",
      stateName: "Tamil Nadu",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Tamil Nadu residential rooftop add-on incentives via TEDA/TANGEDCO official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "bihar",
      stateName: "Bihar",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Bihar residential rooftop add-on incentives via BREDA/BSPHCL official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "assam",
      stateName: "Assam",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Assam residential rooftop add-on incentives via AEDA/APDCL official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "odisha",
      stateName: "Odisha",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 Odisha residential rooftop add-on incentives via OREDA/TPCODL/other DISCOM official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
    {
      stateSlug: "west-bengal",
      stateName: "West Bengal",
      verificationStatus: "unverified",
      notes:
        "Verify any 2026 West Bengal residential rooftop add-on incentives via WBREDA/WBSEDCL/CESC official sources. Central CFA applies via the national portal.",
      sources: ["https://pmsuryaghar.gov.in"],
    },
  ] as const,
};

export function calculateCentralSubsidyINR(systemSizeKw: number): number {
  const kw = Math.max(0, systemSizeKw);

  if (kw <= 0) return 0;
  if (kw <= 1) return Math.min(subsidyRates2026.central.perKwUpTo2kW, subsidyRates2026.central.maxAmount);
  if (kw <= 2) return Math.min(kw * subsidyRates2026.central.perKwUpTo2kW, subsidyRates2026.central.maxAmount);

  // 2–3 kW: ₹60k + ₹18k for the third kW (cap at 3 kW)
  const amount =
    subsidyRates2026.central.amountFor2kW +
    Math.min(1, kw - 2) * subsidyRates2026.central.amountForThirdkW;

  return Math.min(amount, subsidyRates2026.central.maxAmount);
}

