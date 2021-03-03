import React from "react";
import RNCanvas, { CanvasProps } from "react-native-canvas";

export function Canvas(props: CanvasProps) {
  return <RNCanvas {...props} />;
}
