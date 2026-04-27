import * as React from "react";

export type SchemaObject = Record<string, unknown>;

export function SchemaMarkup(props: { schemaType?: string; data: SchemaObject }) {
  const schema: SchemaObject = {
    "@context": "https://schema.org",
    ...(props.schemaType ? { "@type": props.schemaType } : {}),
    ...props.data,
  };

  const json = JSON.stringify(schema);

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

