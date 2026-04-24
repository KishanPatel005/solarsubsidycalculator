import * as React from "react";

export type SchemaObject = Record<string, unknown>;

export function SchemaMarkup(props: { schema: SchemaObject }) {
  const json = JSON.stringify(props.schema);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

