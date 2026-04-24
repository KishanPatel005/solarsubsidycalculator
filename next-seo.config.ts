import type { DefaultSeoProps } from "next-seo/pages";

const seoConfig: DefaultSeoProps = {
  titleTemplate: "%s | Solar Subsidy Calculator",
  defaultTitle: "Solar Subsidy Calculator",
  description:
    "Calculate rooftop solar subsidy in India, check subsidy status, and explore state-wise guides based on government scheme guidelines.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Solar Subsidy Calculator",
  },
  twitter: {
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    { name: "theme-color", content: "#F97316" },
    { name: "application-name", content: "Solar Subsidy Calculator" },
  ],
};

export default seoConfig;

