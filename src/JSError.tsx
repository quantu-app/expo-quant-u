import React from "react";
import { Text, Layout } from "@ui-kitten/components";

const RE_NEWLINE = /[^\r\n]+/g;

export interface IJSErrorProps {
  error: Error;
}

export function JSError(props: IJSErrorProps) {
  console.error(props.error);

  return (
    <>
      <Text category="h1">{props.error.name}</Text>
      <Text category="h3">{props.error.message}</Text>
      <Layout>
        {(props.error.stack || "").split(RE_NEWLINE).map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
      </Layout>
    </>
  );
}
