import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/schemas";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solarsubsidycalculator.com"),
  title: {
    default: "Solar Subsidy Calculator India 2025 | PM Surya Ghar",
    template: "%s | Solar Subsidy Calculator",
  },
  description:
    "Free solar subsidy calculator for India. Calculate PM Surya Ghar subsidy up to ₹78,000. Check eligibility for all 36 states. Instant results.",
  alternates: {
    canonical: "https://solarsubsidycalculator.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://solarsubsidycalculator.com",
    siteName: "Solar Subsidy Calculator",
    title: "Solar Subsidy Calculator India 2025 | PM Surya Ghar",
    description:
      "Free solar subsidy calculator for India. Calculate PM Surya Ghar subsidy up to ₹78,000. Check eligibility for all 36 states. Instant results.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SolarHelp — Free Solar Subsidy Calculator for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Subsidy Calculator India 2025 | PM Surya Ghar",
    description:
      "Free solar subsidy calculator for India. Calculate PM Surya Ghar subsidy up to ₹78,000. Check eligibility for all 36 states. Instant results.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F59E0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const org = OrganizationSchema({
    name: "Solar Subsidy Calculator",
    url: "https://solarsubsidycalculator.com",
    description:
      "Free solar subsidy calculator for India with state-wise solar subsidy guides and lead capture for solar consultation.",
    logo: "https://solarsubsidycalculator.com/icon.png",
  });

  const website = WebSiteSchema({
    name: "Solar Subsidy Calculator India",
    url: "https://solarsubsidycalculator.com",
    searchTarget: "https://solarsubsidycalculator.com/solar-subsidy-{search_term_string}",
  });

  return (
    <html
      lang="en"
      className={cn("font-sans", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-dvh bg-background antialiased">
        <SchemaMarkup schema={org} />
        <SchemaMarkup schema={website} />
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
