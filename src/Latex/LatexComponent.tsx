import Katex from "react-native-katex";

export interface ILatexComponentProps {
  block: boolean;
  children: string;
}

export function LatexComponent(props: ILatexComponentProps) {
  return <Katex displayMode={props.block} expression={props.children} />;
}
