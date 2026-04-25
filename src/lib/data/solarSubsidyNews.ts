export type SolarSubsidyNewsItem = {
  dateISO: string; // YYYY-MM-DD
  headline: string;
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
  tags: string[];
};

/**
 * Update this list whenever there is news.
 * This page is designed for repeat visitors, so keep the newest items on top.
 */
export const solarSubsidyNews2026: readonly SolarSubsidyNewsItem[] = [
  {
    dateISO: "2026-04-10",
    headline: "PM Surya Ghar: Portal maintenance window announced",
    summary: "MNRE portal will undergo a scheduled update. If your application is pending, retry status checks after the maintenance period.",
    sourceLabel: "MNRE (official)",
    sourceUrl: "https://pmsuryaghar.gov.in/",
    tags: ["PM Surya Ghar", "Portal"],
  },
  {
    dateISO: "2026-03-15",
    headline: "Several DISCOMs start faster net-metering approvals (pilot)",
    summary: "Selected DISCOM divisions reported quicker document verification for rooftop connections. Timelines may vary by circle and feeder.",
    sourceLabel: "DISCOM circular / local notice",
    sourceUrl: "https://pmsuryaghar.gov.in/",
    tags: ["DISCOM", "Net metering"],
  },
  {
    dateISO: "2026-02-01",
    headline: "Budget season: rooftop solar allocation focus continues",
    summary: "Policy focus remains on household rooftop adoption, with continued emphasis on simplified subsidy workflows and domestic manufacturing.",
    sourceLabel: "Union Budget references",
    sourceUrl: "https://www.indiabudget.gov.in/",
    tags: ["Budget", "Policy"],
  },
] as const;

