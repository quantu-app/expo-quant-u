import React from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

export interface ILatexComponentProps {
  block: boolean;
  children: string;
}

export function LatexComponent(props: ILatexComponentProps) {
  return <TeX block={props.block}>{props.children}</TeX>;
}
