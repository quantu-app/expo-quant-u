import React, { Component, createRef, CSSProperties } from "react";
import { StyleProp, StyleSheet, ViewProps } from "react-native";
import { CanvasProps, CanvasRenderingContext2D } from "react-native-canvas";

interface IRNCanvasProps {
  style: StyleProp<ViewProps>;
  canvasRef: CanvasProps["ref"];
}

class RNCanvas extends Component<IRNCanvasProps> {
  constructor(props: IRNCanvasProps) {
    super(props);
    if (typeof props.canvasRef === "function") {
      props.canvasRef(this as any);
    } else if (props.canvasRef) {
      (props.canvasRef as any).current = this;
    }
  }
  private ref = createRef<HTMLCanvasElement>();

  componentWillUnmount() {
    (this.props.canvasRef as any).current = null;
  }

  get width() {
    return this.ref.current ? this.ref.current.width : 0;
  }
  get height() {
    return this.ref.current ? this.ref.current.height : 0;
  }
  toDataURL(): Promise<string> {
    return this.ref.current
      ? Promise.resolve(this.ref.current.toDataURL())
      : Promise.reject("Failed to get Canvas Element");
  }
  getContext(context: string): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = this.ref.current
      ? (this.ref.current.getContext(context) as any)
      : null;

    if (!ctx) {
      throw new Error("Failed to getContext from Canvas Element");
    }
    return ctx;
  }

  render() {
    return (
      <canvas
        ref={this.ref}
        style={StyleSheet.flatten(this.props.style) as CSSProperties}
      />
    );
  }
}

export function Canvas(props: CanvasProps) {
  return <RNCanvas canvasRef={props.ref} style={props.style} />;
}
