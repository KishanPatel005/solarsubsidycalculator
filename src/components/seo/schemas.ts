export type SchemaObject = Record<string, unknown>;

export type QAItem = { question: string; answer: string };
export type BreadcrumbItem = { name: string; item: string };

export function OrganizationSchema(params: {
  name: string;
  url: string;
  description: string;
  logo: string;
}): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: params.name,
    url: params.url,
    description: params.description,
    logo: params.logo,
  };
}

export function WebSiteSchema(params: {
  name: string;
  url: string;
  searchTarget: string; // e.g. https://site.com/solar-subsidy-{search_term_string}
}): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: params.name,
    url: params.url,
    potentialAction: {
      "@type": "SearchAction",
      target: params.searchTarget,
      "query-input": "required name=search_term_string",
    },
  };
}

export function FAQSchema(items: QAItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function BreadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: i.item,
    })),
  };
}

export function CalculatorSchema(params: {
  name: string;
  url: string;
  description: string;
}): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: params.name,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: params.url,
    description: params.description,
  };
}

