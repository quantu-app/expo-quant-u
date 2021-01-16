import React from "react";
import { Layout, Text } from "@ui-kitten/components";

export interface ILatexComponentProps {
  block: boolean;
  children: string;
}

export function LatexComponent(props: ILatexComponentProps) {
  if (props.block) {
    return (
      <Layout>
        <Text>{props.children}</Text>
      </Layout>
    );
  } else {
    return <Text>{props.children}</Text>;
  }
}
