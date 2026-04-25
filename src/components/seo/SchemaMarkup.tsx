import * as React from "react";

export type SchemaObject = Record<string, unknown>;

export function SchemaMarkup(props: { schemaType?: string; data: SchemaObject }) {
  const schema: SchemaObject = {
    "@context": "https://schema.org",
    ...(props.schemaType ? { "@type": props.schemaType } : null),
    ...props.data,
  };

  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {JSON.stringify(schema)}
    </script>
  );
}

