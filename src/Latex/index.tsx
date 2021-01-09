import React from "react";
import { ReactText } from "react";
import { LatexComponent } from "./LatexComponent";

export interface ILatexProps {
  block?: boolean;
  children: ReactText | ReactText[];
}

export function Latex(props: ILatexProps) {
  return (
    <LatexComponent block={props.block === true}>
      {Array.isArray(props.children)
        ? props.children.join("")
        : props.children.toString()}
    </LatexComponent>
  );
}
