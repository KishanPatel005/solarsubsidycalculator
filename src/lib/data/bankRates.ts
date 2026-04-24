import type { VerificationStatus } from "./subsidyRates";

export interface BankSolarLoanOffer {
  name: string;
  /**
   * Keep as string because most banks quote ranges / benchmark-linked rates.
   * Example: "RLLR-linked" or "9.15%–10.25% p.a."
   */
  interestRate: string;
  /**
   * Maximum tenure as a human-readable string (banks differ between standalone vs home-loan top-up).
   */
  maxTenure: string;
  /**
   * Maximum amount as a human-readable string; often depends on project cost and borrower profile.
   */
  maxAmount: string;
  processingFee: string;
  specialFeatures: string[];
  verificationStatus: VerificationStatus;
  sources: string[];
}

/**
 * 2025 snapshot (best-effort):
 * - Many bank product pages and MNRE/National-Portal tables are not reliably accessible
 *   from automated fetches in this environment.
 * - These offers are therefore marked unverified unless we can pin an official 2025 page.
 * - Use as a starter dataset and verify on the bank's official product page before publishing.
 */
export const bankSolarLoanOffers2025: readonly BankSolarLoanOffer[] = [
  {
    name: "State Bank of India (SBI)",
    interestRate: "Benchmark/RLLR-linked (varies by borrower profile); PIB notes ~7% collateral-free products for RTS up to 3 kW",
    maxTenure: "Up to ~10 years (varies by product)",
    maxAmount: "Often up to ₹10 lakh (scheme/product dependent)",
    processingFee: "Often nil/low for solar-specific products (verify)",
    specialFeatures: [
      "Standalone rooftop solar finance products",
      "May offer collateral-free options for smaller ticket sizes",
    ],
    verificationStatus: "unverified",
    sources: [
      "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2010133",
      "https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/",
    ],
  },
  {
    name: "Punjab National Bank (PNB)",
    interestRate: "RLLR/benchmark-linked (varies)",
    maxTenure: "Typically up to ~5–10 years (varies)",
    maxAmount: "Often up to ₹10 lakh (scheme/product dependent)",
    processingFee: "Varies (verify)",
    specialFeatures: ["Public sector solar financing options (verify latest scheme name)"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
  {
    name: "Bank of Baroda",
    interestRate: "Benchmark-linked; varies by borrower profile",
    maxTenure: "Up to ~10 years (varies by product)",
    maxAmount: "Often up to ₹10 lakh+ (scheme/product dependent)",
    processingFee: "Varies (verify)",
    specialFeatures: ["May offer solar as part of home-loan top-up/composite products"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
  {
    name: "Union Bank of India",
    interestRate: "Benchmark-linked; varies",
    maxTenure: "Up to ~7–10 years (varies)",
    maxAmount: "Project-cost dependent (often up to ₹10–15 lakh range; verify)",
    processingFee: "Often nil/low for solar-specific products (verify)",
    specialFeatures: ["Standalone URTS-style schemes may exist (verify current product)"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
  {
    name: "Canara Bank",
    interestRate: "Benchmark-linked; varies",
    maxTenure: "Up to ~10–20 years (home-loan composite variants may be longer)",
    maxAmount: "Often up to ₹10 lakh+ (scheme/product dependent)",
    processingFee: "Varies (verify)",
    specialFeatures: ["Housing-cum-solar/composite products are common in PSBs (verify)"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
  {
    name: "HDFC Bank",
    interestRate: "Retail personal/home-loan rates; varies",
    maxTenure: "Typically up to ~5 years (personal loan) or longer via home-loan top-up",
    maxAmount: "Higher limits possible via secured products (verify)",
    processingFee: "Varies (verify)",
    specialFeatures: ["May finance rooftop solar via personal loan or home-loan top-up"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
  {
    name: "ICICI Bank",
    interestRate: "Retail personal/home-loan rates; varies",
    maxTenure: "Varies by product",
    maxAmount: "Varies by product",
    processingFee: "Varies (verify)",
    specialFeatures: ["May finance rooftop solar via personal loan or home-loan top-up"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
  {
    name: "Axis Bank",
    interestRate: "Retail personal/home-loan rates; varies",
    maxTenure: "Varies by product",
    maxAmount: "Varies by product",
    processingFee: "Varies (verify)",
    specialFeatures: ["May finance rooftop solar via personal loan or home-loan top-up"],
    verificationStatus: "unverified",
    sources: ["https://solsetu.com/news/solar-news/solar-loans-india-2025-top-banks-emi-subsidies/"],
  },
] as const;

