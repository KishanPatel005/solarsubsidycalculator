import type { VerificationStatus } from "./subsidyRates";

export interface StateSubsidyContent {
  stateSlug: string;
  stateName: string;
  verificationStatus: VerificationStatus;

  eligibilityRules: string[];
  howToApplySteps: string[];
  officialPortalUrl: string;
  documentsRequired: string[];
  extraStateBenefits: string[];
  sources: string[];
}

const nationalPortal = "https://pmsuryaghar.gov.in";
const pibCfaSource = "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2010133";

const commonEligibility: string[] = [
  "Applicant must be a residential electricity consumer (scheme is for residential rooftop solar).",
  "Rooftop solar system must be grid-connected and installed through an empanelled/approved vendor as per scheme process.",
  "Net metering / commissioning and DISCOM inspection are required before subsidy is released.",
];

const commonSteps: string[] = [
  "Register and apply on the National Portal, selecting your state, DISCOM and consumer number.",
  "Wait for DISCOM feasibility/approval on the portal.",
  "Install rooftop solar through an empanelled vendor as per portal guidance.",
  "Apply for net metering and complete DISCOM inspection/commissioning.",
  "Submit bank details on the portal to receive subsidy via DBT after commissioning.",
];

const commonDocuments: string[] = [
  "Latest electricity bill / consumer number",
  "Aadhaar / identity proof",
  "Address proof",
  "Bank account details for DBT (account number, IFSC)",
  "Rooftop ownership/authorization proof (as required by your DISCOM)",
];

function mkStateContent(params: {
  stateSlug: string;
  stateName: string;
  officialPortalUrl?: string;
  extraStateBenefits?: string[];
  verificationStatus?: VerificationStatus;
  sources?: string[];
}): StateSubsidyContent {
  return {
    stateSlug: params.stateSlug,
    stateName: params.stateName,
    verificationStatus: params.verificationStatus ?? "unverified",
    eligibilityRules: commonEligibility,
    howToApplySteps: commonSteps,
    officialPortalUrl: params.officialPortalUrl ?? nationalPortal,
    documentsRequired: commonDocuments,
    extraStateBenefits: params.extraStateBenefits ?? [],
    sources: [
      pibCfaSource,
      nationalPortal,
      ...(params.sources ?? []),
    ],
  };
}

/**
 * Policy note:
 * - This file intentionally avoids quoting state “additional subsidy” rupee amounts unless verified.
 * - We still provide state portal pointers and state-specific benefit bullets only when sourced.
 */
export const statesSubsidyContent2026: readonly StateSubsidyContent[] = [
  // States (28)
  mkStateContent({ stateSlug: "andhra-pradesh", stateName: "Andhra Pradesh" }),
  mkStateContent({ stateSlug: "arunachal-pradesh", stateName: "Arunachal Pradesh" }),
  mkStateContent({ stateSlug: "assam", stateName: "Assam" }),
  mkStateContent({ stateSlug: "bihar", stateName: "Bihar" }),
  mkStateContent({ stateSlug: "chhattisgarh", stateName: "Chhattisgarh" }),
  mkStateContent({ stateSlug: "goa", stateName: "Goa" }),
  mkStateContent({
    stateSlug: "gujarat",
    stateName: "Gujarat",
    officialPortalUrl: "https://suryagujarat.guvnl.in",
    sources: ["https://suryagujarat.guvnl.in", "https://guj-epd.gujarat.gov.in/Home/GujaratREPolicy"],
  }),
  mkStateContent({ stateSlug: "haryana", stateName: "Haryana" }),
  mkStateContent({ stateSlug: "himachal-pradesh", stateName: "Himachal Pradesh" }),
  mkStateContent({ stateSlug: "jharkhand", stateName: "Jharkhand" }),
  mkStateContent({ stateSlug: "karnataka", stateName: "Karnataka" }),
  mkStateContent({ stateSlug: "kerala", stateName: "Kerala" }),
  mkStateContent({ stateSlug: "madhya-pradesh", stateName: "Madhya Pradesh" }),
  mkStateContent({ 
    stateSlug: "maharashtra", 
    stateName: "Maharashtra",
    officialPortalUrl: "https://www.mahadiscom.in/solar-rooftop/",
    extraStateBenefits: [
      "Maharashtra State Solar Policy 2023 offers additional facilitation for residential housing societies.",
      "Simplified net metering process through MSEDCL portal."
    ],
    sources: ["https://www.mahadiscom.in", "https://mahaurja.com"]
  }),
  mkStateContent({ stateSlug: "manipur", stateName: "Manipur" }),
  mkStateContent({ stateSlug: "meghalaya", stateName: "Meghalaya" }),
  mkStateContent({ stateSlug: "mizoram", stateName: "Mizoram" }),
  mkStateContent({ stateSlug: "nagaland", stateName: "Nagaland" }),
  mkStateContent({ stateSlug: "odisha", stateName: "Odisha" }),
  mkStateContent({ stateSlug: "punjab", stateName: "Punjab" }),
  mkStateContent({ 
    stateSlug: "rajasthan", 
    stateName: "Rajasthan",
    officialPortalUrl: "https://energy.rajasthan.gov.in/rrecl",
    extraStateBenefits: [
      "Rajasthan Solar Energy Policy 2019 focuses on maximizing solar potential in high-irradiation zones.",
      "Special incentives for domestic manufacturing in some phases (verify latest status)."
    ],
    sources: ["https://energy.rajasthan.gov.in", "https://rrecl.rajasthan.gov.in"]
  }),
  mkStateContent({ stateSlug: "sikkim", stateName: "Sikkim" }),
  mkStateContent({ stateSlug: "tamil-nadu", stateName: "Tamil Nadu" }),
  mkStateContent({ stateSlug: "telangana", stateName: "Telangana" }),
  mkStateContent({ stateSlug: "tripura", stateName: "Tripura" }),
  mkStateContent({ 
    stateSlug: "uttar-pradesh", 
    stateName: "Uttar Pradesh",
    officialPortalUrl: "http://upneda.in",
    extraStateBenefits: [
      "UP Solar Energy Policy 2022 provides additional state subsidy for residential systems up to 10 kW.",
      "Dedicated solar cities like Ayodhya and Varanasi with priority facilitation."
    ],
    sources: ["http://upneda.in", "http://uppcl.org"]
  }),
  mkStateContent({ stateSlug: "uttarakhand", stateName: "Uttarakhand" }),
  mkStateContent({ stateSlug: "west-bengal", stateName: "West Bengal" }),

  // Union Territories (8)
  mkStateContent({ stateSlug: "andaman-and-nicobar-islands", stateName: "Andaman and Nicobar Islands" }),
  mkStateContent({ stateSlug: "chandigarh", stateName: "Chandigarh" }),
  mkStateContent({ stateSlug: "dadra-and-nagar-haveli-and-daman-and-diu", stateName: "Dadra and Nagar Haveli and Daman and Diu" }),
  mkStateContent({
    stateSlug: "delhi",
    stateName: "Delhi",
    officialPortalUrl: "https://solar.delhi.gov.in",
    verificationStatus: "verified",
    extraStateBenefits: [
      "State capital subsidy (policy-linked): ₹2,000/kW up to ₹10,000 per consumer (verify DISCOM implementation).",
      "Generation-based incentive (GBI) slabs for 5 years (verify latest policy/portal slabs for your category).",
    ],
    sources: [
      "https://eerem.delhi.gov.in/eerem/about-delhi-solar-energy-policy",
      "https://solar.delhi.gov.in",
    ],
  }),
  mkStateContent({ stateSlug: "jammu-and-kashmir", stateName: "Jammu and Kashmir" }),
  mkStateContent({ stateSlug: "ladakh", stateName: "Ladakh" }),
  mkStateContent({ stateSlug: "lakshadweep", stateName: "Lakshadweep" }),
  mkStateContent({ stateSlug: "puducherry", stateName: "Puducherry" }),
] as const;

